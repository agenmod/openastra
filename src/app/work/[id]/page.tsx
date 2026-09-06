import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AstraEmbed } from "@/components/AstraEmbed";
import { AstraPromptList } from "@/components/AstraPromptList";
import { CommentBox } from "@/components/CommentBox";
import { ASTRA_FEED_ALL, ASTRA_SOURCE_LABEL } from "@/lib/astra-feed";
import { astraCanEmbed, getAstraPrompts, getAstraWork } from "@/lib/astra-work";
import { readSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export function generateStaticParams() {
  return ASTRA_FEED_ALL.map((work) => ({ id: work.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const work = getAstraWork(id);
  if (!work) return { title: "作品不存在" };
  return {
    title: `${work.title} · openAstra`,
    description: work.blurb,
  };
}

export default async function AstraWorkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const work = getAstraWork(id);
  if (!work) notFound();

  const source = work.source ?? "community";
  const prompts = getAstraPrompts(work.id);
  const canEmbed = astraCanEmbed(work.playUrl);
  const session = await readSession();
  const comments = await prisma.workComment.findMany({
    where: { workId: work.id },
    orderBy: { createdAt: "desc" },
    include: { author: { select: { username: true, displayName: true } } },
  });

  return (
    <main className="mx-auto max-w-5xl px-5 py-8">
      <p className="mb-4 text-sm text-mute">
        <Link href="/" className="hover:text-ink">
          ← 广场
        </Link>
      </p>

      <AstraEmbed
        title={work.title}
        playUrl={work.playUrl}
        cover={work.cover}
        canEmbed={canEmbed}
      />

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.25em] text-mute">正在玩</p>
          <h1 className="display mt-2 text-4xl">{work.title}</h1>
          <p className="mt-2 text-mute">
            @{work.handle} · {work.creator}
          </p>
          <p className="mt-1 text-xs text-ion">
            {work.kind === "game" ? "游戏" : "3D"} · {ASTRA_SOURCE_LABEL[source]}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href={work.playUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-solid rounded-full px-4 py-2 text-sm"
          >
            去原站玩
          </a>
          <a
            href={work.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-line px-4 py-2 text-sm"
          >
            查看出处
          </a>
        </div>
      </div>

      <p className="mt-6 max-w-2xl text-ink/80">{work.blurb}</p>

      <section className="mt-10 rounded-2xl border border-line bg-panel px-4 py-4">
        <h2 className="display text-2xl">作者</h2>
        <p className="mt-3 text-lg">{work.creator}</p>
        <p className="mt-1 text-sm text-mute">@{work.handle}</p>
        <p className="mt-2 text-sm text-mute">
          本页只聚合公开地址，游戏仍在作者原站。
        </p>
      </section>

      <section className="mt-10">
        <h2 className="display text-2xl">制作步骤</h2>
        {prompts ? (
          <>
            <p className="mt-2 text-sm text-mute">
              不是不同版本。作者在官方页按时间公布了怎么一步步做出来：先出概念，再做成能玩的一截，再改手感和画面。下面是每一步当时用的提示词原文。
            </p>
            <AstraPromptList record={prompts} />
          </>
        ) : (
          <p className="mt-3 text-sm text-mute">
            作者没有在公开页公布完整制作步骤。可以去
            <a
              href={work.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mx-1 text-ion hover:underline"
            >
              出处页
            </a>
            或原站看看有没有补充说明。
          </p>
        )}
      </section>

      <section className="mt-10">
        <h2 className="display text-2xl">评论</h2>
        <CommentBox
          action={`/api/works/${work.id}/comments`}
          loginNext={`/work/${work.id}`}
          loggedIn={Boolean(session)}
        />
        <div className="mt-6 space-y-4">
          {comments.length === 0 && (
            <p className="text-sm text-mute">还没人说话。玩过就留一句。</p>
          )}
          {comments.map((comment) => (
            <article key={comment.id} className="rounded-2xl border border-line bg-panel px-4 py-3">
              <p className="text-xs text-mute">@{comment.author.username}</p>
              <p className="mt-1">{comment.content}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

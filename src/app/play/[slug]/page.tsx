import Link from "next/link";
import { notFound } from "next/navigation";
import { CommentBox } from "@/components/CommentBox";
import { GamePlayer } from "@/components/GamePlayer";
import { PlayActions } from "@/components/PlayActions";
import { readSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCount } from "@/lib/utils";

export default async function PlayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await readSession();
  const game = await prisma.game.findUnique({
    where: { slug },
    include: {
      author: { select: { username: true, displayName: true } },
      comments: {
        orderBy: { createdAt: "desc" },
        include: { author: { select: { username: true, displayName: true } } },
      },
      likes: session ? { where: { userId: session.id } } : false,
    },
  });

  if (!game || !game.published) notFound();

  const liked = Array.isArray(game.likes) && game.likes.length > 0;

  return (
    <main className="mx-auto max-w-5xl px-5 py-8">
      <GamePlayer gameId={game.id} title={game.title} countPlay />
      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.25em] text-mute">正在玩</p>
          <h1 className="display mt-2 text-4xl">{game.title}</h1>
          <p className="mt-2 text-mute">
            @{game.author.username} · {formatCount(game.playCount)} 次游玩
          </p>
          <p className="mt-1 text-xs text-ion">游戏 · 本站</p>
        </div>
        <PlayActions
          gameId={game.id}
          liked={liked}
          likeCount={game.likeCount}
          loggedIn={Boolean(session)}
        />
      </div>
      <p className="mt-6 max-w-2xl text-ink/80">{game.prompt}</p>
      {session?.id === game.authorId && (
        <Link href={`/create?game=${game.id}`} className="mt-4 inline-block text-sm text-ion">
          回去改这局
        </Link>
      )}

      <section className="mt-10">
        <h2 className="display text-2xl">评论</h2>
        <CommentBox
          action={`/api/games/${game.id}/comments`}
          loginNext={`/play/${game.slug}`}
          loggedIn={Boolean(session)}
        />
        <div className="mt-6 space-y-4">
          {game.comments.length === 0 && (
            <p className="text-sm text-mute">还没人说话。通关了就留一句。</p>
          )}
          {game.comments.map((comment) => (
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

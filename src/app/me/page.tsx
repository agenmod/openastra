import Link from "next/link";
import { redirect } from "next/navigation";
import { CoverSync } from "@/components/CoverSync";
import { GameCard } from "@/components/GameCard";
import { readSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function MePage() {
  const user = await readSession();
  if (!user) redirect("/login?next=/me");

  const games = await prisma.game.findMany({
    where: { authorId: user.id },
    include: { author: { select: { username: true, displayName: true } } },
    orderBy: { updatedAt: "desc" },
  });

  const published = games.filter((g) => g.published);
  const drafts = games.filter((g) => !g.published);
  const missingCovers = published.filter((g) => !g.cover).map((g) => g.id);

  return (
    <main className="px-5 py-10 md:px-10">
      <CoverSync ids={missingCovers} />
      <p className="text-xs tracking-[0.3em] text-mute">我的游戏</p>
      <h1 className="display mt-2 text-4xl">{user.displayName} 的游戏</h1>
      <div className="mt-6">
        <Link href="/create" className="btn-solid rounded-full px-5 py-3">
          新做一局
        </Link>
      </div>

      <section className="mt-12">
        <h2 className="display text-2xl">已发布</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {published.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
          {published.length === 0 && (
            <p className="text-mute">还没有发布。做完一局后点「发布到广场」。</p>
          )}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="display text-2xl">草稿</h2>
        <div className="mt-5 grid gap-4">
          {drafts.map((game) => (
            <Link
              key={game.id}
              href={`/create?game=${game.id}`}
              className="rounded-2xl border border-line bg-panel px-5 py-4 hover:border-nova/50"
            >
              <p className="display text-xl">{game.title}</p>
              <p className="mt-1 text-sm text-mute">{game.prompt}</p>
            </Link>
          ))}
          {drafts.length === 0 && <p className="text-mute">没有未发布的草稿。</p>}
        </div>
      </section>
    </main>
  );
}

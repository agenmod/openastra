import Link from "next/link";
import { AstraFeedGrid } from "@/components/AstraFeedGrid";
import { ASTRA_FEED_ALL } from "@/lib/astra-feed";
import { prisma } from "@/lib/prisma";
import { localGameToWork } from "@/lib/workshop";

export default async function HomePage() {
  const localGames = await prisma.game.findMany({
    where: { published: true },
    include: { author: { select: { username: true, displayName: true } } },
    orderBy: { updatedAt: "desc" },
    take: 24,
  });

  const works = [...localGames.map(localGameToWork), ...ASTRA_FEED_ALL];

  return (
    <main className="px-5 py-10 md:px-10">
      <section className="max-w-3xl">
        <p className="text-xs tracking-[0.35em] text-ion">openAstra</p>
        <h1 className="display mt-3 text-5xl leading-[1.05] md:text-7xl">
          玩别人做好的，
          <br />
          也做一局自己的
        </h1>
        <p className="mt-5 max-w-xl text-lg text-mute">
          官方、评测和社区里能打开的游戏 / 3D。点卡片进详情：小窗玩、看作者、抄已公开的制作步骤。不是 OpenAI 官方站，社区作品不保证都是 GPT-6 Astra。
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/create" className="btn-solid rounded-full px-6 py-3">
            做一局
          </Link>
          <Link href="/me" className="rounded-full border border-line px-6 py-3">
            我的游戏
          </Link>
        </div>
      </section>

      <AstraFeedGrid works={works} />
    </main>
  );
}

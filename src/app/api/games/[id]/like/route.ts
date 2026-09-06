import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const game = await prisma.game.findUnique({ where: { id } });
    if (!game || !game.published) {
      return NextResponse.json({ error: "游戏不存在" }, { status: 404 });
    }

    const existing = await prisma.like.findUnique({
      where: { gameId_userId: { gameId: id, userId: user.id } },
    });

    if (existing) {
      await prisma.$transaction([
        prisma.like.delete({ where: { id: existing.id } }),
        prisma.game.update({
          where: { id },
          data: { likeCount: { decrement: 1 } },
        }),
      ]);
      const next = await prisma.game.findUnique({ where: { id } });
      return NextResponse.json({ liked: false, likeCount: next?.likeCount ?? 0 });
    }

    await prisma.$transaction([
      prisma.like.create({ data: { gameId: id, userId: user.id } }),
      prisma.game.update({
        where: { id },
        data: { likeCount: { increment: 1 } },
      }),
    ]);
    const next = await prisma.game.findUnique({ where: { id } });
    return NextResponse.json({ liked: true, likeCount: next?.likeCount ?? 0 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHENTICATED") {
      return NextResponse.json({ error: "请先登录再点赞" }, { status: 401 });
    }
    return NextResponse.json({ error: "点赞失败" }, { status: 500 });
  }
}

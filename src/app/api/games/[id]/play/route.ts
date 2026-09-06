import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const game = await prisma.game.findUnique({ where: { id } });
  if (!game || !game.published) {
    return NextResponse.json({ error: "游戏不存在" }, { status: 404 });
  }
  const updated = await prisma.game.update({
    where: { id },
    data: { playCount: { increment: 1 } },
  });
  return NextResponse.json({ playCount: updated.playCount });
}

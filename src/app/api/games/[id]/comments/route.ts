import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  content: z.string().trim().min(1).max(280),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const game = await prisma.game.findUnique({ where: { id } });
    if (!game || !game.published) {
      return NextResponse.json({ error: "游戏不存在" }, { status: 404 });
    }

    const body = schema.parse(await req.json());
    const comment = await prisma.comment.create({
      data: { content: body.content, gameId: id, authorId: user.id },
      include: { author: { select: { username: true, displayName: true } } },
    });
    return NextResponse.json({ comment });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "评论太短或太长" }, { status: 400 });
    }
    if (error instanceof Error && error.message === "UNAUTHENTICATED") {
      return NextResponse.json({ error: "请先登录再评论" }, { status: 401 });
    }
    return NextResponse.json({ error: "评论失败" }, { status: 500 });
  }
}

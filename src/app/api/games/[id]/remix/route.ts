import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { makeSlug } from "@/lib/utils";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const source = await prisma.game.findUnique({ where: { id } });
    if (!source || !source.published) {
      return NextResponse.json({ error: "游戏不存在" }, { status: 404 });
    }

    const game = await prisma.game.create({
      data: {
        title: `${source.title}（改）`,
        prompt: `基于《${source.title}》改一版：${source.prompt}`,
        html: source.html,
        conversation: JSON.stringify([
          { role: "user", content: `基于《${source.title}》改一局` },
          { role: "assistant", content: "已经复制原作，可以继续改。" },
        ]),
        published: false,
        slug: makeSlug(`${source.title}-remix`),
        authorId: user.id,
      },
    });
    return NextResponse.json({ game });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHENTICATED") {
      return NextResponse.json({ error: "请先登录再改一局" }, { status: 401 });
    }
    return NextResponse.json({ error: "没复制成" }, { status: 500 });
  }
}

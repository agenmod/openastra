import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { saveCoverFromDataUrl } from "@/lib/cover-file";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  title: z.string().min(1).max(40).optional(),
  prompt: z.string().min(1).max(4000).optional(),
  html: z.string().min(20).max(200_000).optional(),
  conversation: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() }))
    .max(20)
    .optional(),
  published: z.boolean().optional(),
  coverDataUrl: z.string().max(2_500_000).optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireUser();
    const { id } = await params;
    const game = await prisma.game.findUnique({ where: { id } });
    if (!game || game.authorId !== user.id) {
      return NextResponse.json({ error: "找不到这个游戏" }, { status: 404 });
    }

    const body = schema.parse(await req.json());
    let cover: string | undefined;
    if (body.coverDataUrl) {
      try {
        cover = await saveCoverFromDataUrl(id, body.coverDataUrl);
      } catch (err) {
        return NextResponse.json(
          { error: err instanceof Error ? err.message : "封面保存失败" },
          { status: 400 },
        );
      }
    }
    const updated = await prisma.game.update({
      where: { id },
      data: {
        title: body.title,
        prompt: body.prompt,
        html: body.html,
        published: body.published,
        cover,
        conversation: body.conversation
          ? JSON.stringify(body.conversation)
          : undefined,
      },
    });
    return NextResponse.json({ game: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "参数错误" }, { status: 400 });
    }
    if (error instanceof Error && error.message === "UNAUTHENTICATED") {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}

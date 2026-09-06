import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { makeSlug } from "@/lib/utils";

const schema = z.object({
  title: z.string().min(1).max(40),
  prompt: z.string().min(1).max(4000),
  html: z.string().min(20).max(200_000),
  conversation: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() }))
    .max(20)
    .optional(),
  published: z.boolean().optional(),
});

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = schema.parse(await req.json());
    const game = await prisma.game.create({
      data: {
        title: body.title,
        prompt: body.prompt,
        html: body.html,
        conversation: JSON.stringify(body.conversation ?? []),
        published: body.published ?? false,
        slug: makeSlug(body.title),
        authorId: user.id,
      },
    });
    return NextResponse.json({ game });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "参数错误" }, { status: 400 });
    }
    if (error instanceof Error && error.message === "UNAUTHENTICATED") {
      return NextResponse.json({ error: "请先登录" }, { status: 401 });
    }
    return NextResponse.json({ error: "保存失败" }, { status: 500 });
  }
}

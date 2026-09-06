import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { extractGame, GAME_SYSTEM_PROMPT, type ChatTurn } from "@/lib/game-prompt";

export const maxDuration = 120;

const schema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(8000),
      }),
    )
    .min(1)
    .max(20),
  currentHtml: z.string().max(200_000).optional(),
});

export async function POST(req: Request) {
  try {
    await requireUser();
  } catch {
    return NextResponse.json({ error: "请先登录再做一局" }, { status: 401 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "还没配置 ANTHROPIC_API_KEY" }, { status: 500 });
  }

  try {
    const body = schema.parse(await req.json());
    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
      baseURL: process.env.ANTHROPIC_BASE_URL || undefined,
      defaultHeaders: {
        "User-Agent": "openastra/1.0",
      },
    });

    const lastUser = [...body.messages].reverse().find((m) => m.role === "user");
    const extra = body.currentHtml
      ? `\n\nCURRENT_HTML:\n${body.currentHtml.slice(0, 120000)}`
      : "";

    const messages: ChatTurn[] = body.messages.map((m, i, arr) =>
      i === arr.length - 1 && m.role === "user"
        ? { ...m, content: `${m.content}${extra}` }
        : m,
    );

    const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";
    const result = await client.messages.create({
      model,
      max_tokens: 16384,
      temperature: 0.7,
      system: GAME_SYSTEM_PROMPT,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const text = result.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    const game = extractGame(text);
    return NextResponse.json({
      title: game.title,
      html: game.html,
      prompt: lastUser?.content ?? "",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "参数错误" }, { status: 400 });
    }
    const message =
      error instanceof Anthropic.APIError
        ? error.message
        : error instanceof Error
          ? error.message
          : "生成失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

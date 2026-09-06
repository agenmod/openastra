import { NextResponse } from "next/server";
import { z } from "zod";
import {
  hashPassword,
  normalizeEmail,
  setSessionCookie,
  toSessionUser,
  uniqueUsername,
  usernameFromEmail,
} from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.email("邮箱格式不对").max(120),
  password: z.string().min(6, "密码至少 6 位").max(72),
  displayName: z.string().min(1).max(24).optional(),
});

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    const email = normalizeEmail(body.email);
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json({ error: "这个邮箱已经注册过了" }, { status: 409 });
    }

    const username = await uniqueUsername(usernameFromEmail(email));
    const user = await prisma.user.create({
      data: {
        email,
        username,
        displayName: body.displayName?.trim() || username,
        passwordHash: await hashPassword(body.password),
      },
    });

    await setSessionCookie(toSessionUser(user));

    return NextResponse.json({
      user: toSessionUser(user),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "参数错误" }, { status: 400 });
    }
    return NextResponse.json({ error: "注册失败" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { z } from "zod";
import {
  normalizeEmail,
  setSessionCookie,
  toSessionUser,
  verifyPassword,
} from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.string().min(1, "请填写邮箱").max(120),
  password: z.string().min(1, "请填写密码"),
});

export async function POST(req: Request) {
  try {
    const body = schema.parse(await req.json());
    const identifier = body.email.trim();
    const user = identifier.includes("@")
      ? await prisma.user.findUnique({ where: { email: normalizeEmail(identifier) } })
      : await prisma.user.findUnique({
          where: { username: identifier.toLowerCase() },
        });

    if (!user || !(await verifyPassword(body.password, user.passwordHash))) {
      return NextResponse.json({ error: "邮箱或密码不对" }, { status: 401 });
    }

    await setSessionCookie(toSessionUser(user));

    return NextResponse.json({
      user: toSessionUser(user),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "参数错误" }, { status: 400 });
    }
    return NextResponse.json({ error: "登录失败" }, { status: 500 });
  }
}

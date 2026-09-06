import { compare, hash } from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const COOKIE = "openastra_session";

export type SessionUser = {
  id: string;
  username: string;
  displayName: string;
  email: string;
};

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function usernameFromEmail(email: string) {
  const local = normalizeEmail(email)
    .split("@")[0]
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 16);
  return local.length >= 3 ? local : `user_${local || "new"}`;
}

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value) {
    throw new Error("缺少 AUTH_SECRET");
  }
  return new TextEncoder().encode(value);
}

export async function hashPassword(password: string) {
  return hash(password, 10);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return compare(password, passwordHash);
}

export async function signSession(user: SessionUser) {
  return new SignJWT({
    sub: user.id,
    username: user.username,
    displayName: user.displayName,
    email: user.email,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret());
}

export async function readSession(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret());
    if (!payload.sub || typeof payload.username !== "string") return null;
    return {
      id: payload.sub,
      username: payload.username,
      displayName:
        typeof payload.displayName === "string"
          ? payload.displayName
          : payload.username,
      email:
        typeof payload.email === "string"
          ? payload.email
          : `${payload.username}@openastra.cc`,
    };
  } catch {
    return null;
  }
}

export async function setSessionCookie(user: SessionUser) {
  const jar = await cookies();
  jar.set(COOKIE, await signSession(user), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function uniqueUsername(base: string) {
  let candidate = base;
  let n = 0;
  while (await prisma.user.findUnique({ where: { username: candidate } })) {
    n += 1;
    candidate = `${base.slice(0, 14)}${n}`;
  }
  return candidate;
}

export function toSessionUser(user: {
  id: string;
  username: string;
  displayName: string;
  email: string;
}): SessionUser {
  return {
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    email: user.email,
  };
}

export async function requireUser() {
  const session = await readSession();
  if (!session) {
    throw new Error("UNAUTHENTICATED");
  }
  const user = await prisma.user.findUnique({ where: { id: session.id } });
  if (!user) {
    throw new Error("UNAUTHENTICATED");
  }
  return user;
}

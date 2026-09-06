"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function AuthForm({
  mode,
  nextPath = "/",
}: {
  mode: "login" | "register";
  nextPath?: string;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const nextQuery = nextPath && nextPath !== "/" ? `?next=${encodeURIComponent(nextPath)}` : "";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError("");
    const res = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, displayName }),
    });
    const data = await res.json();
    setPending(false);
    if (!res.ok) {
      setError(data.error || (mode === "login" ? "登录失败" : "注册失败"));
      return;
    }
    router.push(nextPath);
    router.refresh();
  }

  return (
    <div className="mx-auto w-full max-w-md px-6 py-16">
      <p className="text-sm tracking-[0.18em] text-mute">openAstra</p>
      <h1 className="display mt-3 text-4xl">
        {mode === "login" ? "邮箱登录" : "邮箱注册"}
      </h1>
      <p className="mt-3 text-mute">
        {mode === "login"
          ? "登录后可以发布游戏、写评论。演示号 orbit@openastra.cc / demo1234。"
          : "先不发验证码。注册后就能发布自己的游戏，也能评论。"}
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <input
          type="email"
          className="w-full rounded-2xl border border-line bg-panel px-4 py-3 outline-none ring-nova/40 focus:ring-2"
          placeholder="邮箱"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
        {mode === "register" && (
          <input
            className="w-full rounded-2xl border border-line bg-panel px-4 py-3 outline-none ring-nova/40 focus:ring-2"
            placeholder="显示名（可选）"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        )}
        <input
          type="password"
          className="w-full rounded-2xl border border-line bg-panel px-4 py-3 outline-none ring-nova/40 focus:ring-2"
          placeholder={mode === "register" ? "密码（至少 6 位）" : "密码"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          required
        />
        {error && <p className="text-sm text-plasma">{error}</p>}
        <button
          disabled={pending}
          className="btn-solid w-full rounded-full py-3 disabled:opacity-60"
        >
          {pending ? (mode === "login" ? "正在登录…" : "正在注册…") : mode === "login" ? "登录" : "注册"}
        </button>
      </form>
      <p className="mt-6 text-sm text-mute">
        {mode === "login" ? (
          <>
            还没有账号？{" "}
            <Link href={`/register${nextQuery}`} className="text-ink">
              去注册
            </Link>
          </>
        ) : (
          <>
            已经有账号了？{" "}
            <Link href={`/login${nextQuery}`} className="text-ink">
              去登录
            </Link>
          </>
        )}
      </p>
    </div>
  );
}

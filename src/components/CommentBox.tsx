"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CommentBox({
  action,
  loginNext,
  loggedIn,
}: {
  action: string;
  loginNext: string;
  loggedIn: boolean;
}) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!loggedIn) {
      router.push(`/login?next=${encodeURIComponent(loginNext)}`);
      return;
    }
    const res = await fetch(action, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "没发出去");
      return;
    }
    setContent("");
    setError("");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="mt-4 flex gap-3">
      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={loggedIn ? "说一句好不好玩" : "登录后才能评论"}
        className="flex-1 rounded-2xl border border-line bg-panel px-4 py-3 outline-none focus:ring-2 focus:ring-nova/40"
      />
      <button className="rounded-full bg-nova px-5 py-3 text-sm text-ink">发送</button>
      {error && <p className="self-center text-sm text-plasma">{error}</p>}
    </form>
  );
}

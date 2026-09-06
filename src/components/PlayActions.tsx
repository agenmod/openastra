"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function PlayActions({
  gameId,
  liked,
  likeCount,
  loggedIn,
}: {
  gameId: string;
  liked: boolean;
  likeCount: number;
  loggedIn: boolean;
}) {
  const router = useRouter();
  const [state, setState] = useState({ liked, likeCount });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function like() {
    if (!loggedIn) {
      router.push("/login");
      return;
    }
    const res = await fetch(`/api/games/${gameId}/like`, { method: "POST" });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "点赞失败");
      return;
    }
    setState({ liked: data.liked, likeCount: data.likeCount });
  }

  async function remix() {
    if (!loggedIn) {
      router.push(`/login?next=/play`);
      return;
    }
    setBusy(true);
    const res = await fetch(`/api/games/${gameId}/remix`, { method: "POST" });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error || "没复制成");
      return;
    }
    router.push(`/create?game=${data.game.id}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        onClick={like}
        className={`rounded-full px-4 py-2 text-sm ${state.liked ? "bg-plasma text-white" : "border border-line"}`}
      >
        {state.liked ? "已喜欢" : "喜欢"} · {state.likeCount}
      </button>
      <button
        onClick={remix}
        disabled={busy}
        className="btn-solid rounded-full px-4 py-2 text-sm disabled:opacity-60"
      >
        {busy ? "正在复制…" : "改一局"}
      </button>
      {error && <p className="text-sm text-plasma">{error}</p>}
    </div>
  );
}

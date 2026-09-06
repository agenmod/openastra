"use client";

import { useEffect } from "react";

export function GamePlayer({
  gameId,
  title,
  html,
  countPlay = false,
}: {
  gameId?: string;
  title: string;
  html?: string;
  countPlay?: boolean;
}) {
  useEffect(() => {
    if (!countPlay || !gameId) return;
    void fetch(`/api/games/${gameId}/play`, { method: "POST" });
  }, [countPlay, gameId]);

  return (
    <div className="overflow-hidden rounded-[28px] border border-line bg-black shadow-[0_20px_80px_rgba(0,0,0,.45)]">
      <iframe
        title={title}
        className="block aspect-[16/10] w-full bg-black"
        sandbox="allow-scripts allow-pointer-lock"
        src={gameId ? `/api/games/${gameId}/html` : undefined}
        srcDoc={gameId ? undefined : html}
      />
    </div>
  );
}

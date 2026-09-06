"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { captureGameCover } from "@/lib/capture-cover";

export function CoverSync({ ids }: { ids: string[] }) {
  const router = useRouter();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current || ids.length === 0) return;
    ran.current = true;

    void (async () => {
      let saved = 0;
      for (const id of ids) {
        const coverDataUrl = await captureGameCover(id);
        if (!coverDataUrl) continue;
        const res = await fetch(`/api/games/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ coverDataUrl }),
        });
        if (res.ok) saved += 1;
      }
      if (saved > 0) router.refresh();
    })();
  }, [ids, router]);

  return null;
}

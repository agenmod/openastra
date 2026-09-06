"use client";

import { useMemo, useState } from "react";
import { AstraCard } from "@/components/AstraCard";
import type { AstraSource, AstraWork } from "@/lib/astra-feed";

type KindFilter = "all" | "game" | "3d";
type SourceFilter = "all" | AstraSource;

export function AstraFeedGrid({ works }: { works: AstraWork[] }) {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<KindFilter>("all");
  const [source, setSource] = useState<SourceFilter>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return works.filter((work) => {
      if (kind !== "all" && work.kind !== kind) return false;
      if (source !== "all" && (work.source ?? "community") !== source) return false;
      if (!q) return true;
      const hay = `${work.title} ${work.creator} ${work.handle} ${work.blurb}`.toLowerCase();
      return hay.includes(q);
    });
  }, [works, query, kind, source]);

  return (
    <section className="mt-14">
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="display text-2xl">正在玩的作品</h2>
          <p className="mt-1 text-sm text-mute">
            {filtered.length} / {works.length} 个能打开
          </p>
        </div>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="搜作品、作者…"
          className="w-full rounded-full border border-line bg-void px-4 py-2 text-sm outline-none placeholder:text-mute/70 focus:border-ion/60 md:w-72"
        />
      </div>
      <div className="mb-6 flex flex-wrap gap-2 text-sm">
        {(
          [
            ["all", "全部"],
            ["game", "游戏"],
            ["3d", "3D"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setKind(value)}
            className={`rounded-full border px-3 py-1 ${
              kind === value ? "border-ion bg-ion/10 text-ion" : "border-line text-mute"
            }`}
          >
            {label}
          </button>
        ))}
        <span className="mx-1 text-line">|</span>
        {(
          [
            ["all", "来源不限"],
            ["official", "官方"],
            ["astra-review", "评测"],
            ["community", "社区"],
            ["workshop", "本站"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setSource(value)}
            className={`rounded-full border px-3 py-1 ${
              source === value ? "border-ion bg-ion/10 text-ion" : "border-line text-mute"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <p className="text-sm text-mute">没有对上的作品。换个词，或者把筛选清掉。</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((work) => (
            <AstraCard key={work.id} work={work} />
          ))}
        </div>
      )}
    </section>
  );
}

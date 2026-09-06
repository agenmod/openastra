import Link from "next/link";
import type { AstraWork } from "@/lib/astra-feed";
import { ASTRA_SOURCE_LABEL } from "@/lib/astra-feed";

export function AstraCard({ work }: { work: AstraWork }) {
  const source = work.source ?? "community";
  const sourceLabel = ASTRA_SOURCE_LABEL[source];
  const kindLabel = work.kind === "game" ? "游戏" : "3D";

  return (
    <Link
      href={work.href ?? `/work/${work.id}`}
      className="group overflow-hidden rounded-3xl border border-line bg-panel transition hover:-translate-y-1 hover:border-ion/50"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-black">
        <img
          src={work.cover}
          alt={work.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-black/55 px-2.5 py-1 text-[11px] tracking-wide text-ion">
          {kindLabel} · {sourceLabel}
        </span>
        <span className="absolute bottom-4 right-4 text-xs text-white/80">
          {source === "workshop" ? "开玩" : "看详情"}
        </span>
      </div>
      <div className="px-4 py-4">
        <p className="display text-xl leading-none">{work.title}</p>
        <p className="mt-2 line-clamp-2 text-sm text-mute">{work.blurb}</p>
        <div className="mt-3 flex items-center justify-between text-xs text-mute">
          <span>@{work.handle}</span>
          <span>{work.creator}</span>
        </div>
      </div>
    </Link>
  );
}

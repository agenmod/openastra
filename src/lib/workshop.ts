import type { AstraWork } from "@/lib/astra-feed";

export function localGameToWork(game: {
  id: string;
  slug: string;
  title: string;
  prompt: string;
  cover?: string | null;
  author: { username: string; displayName: string };
}): AstraWork {
  const href = `/play/${game.slug}`;
  return {
    id: game.id,
    title: game.title,
    creator: game.author.displayName,
    handle: game.author.username,
    kind: "game",
    source: "workshop",
    blurb: game.prompt,
    playUrl: href,
    sourceUrl: href,
    cover: game.cover || "/covers/_fallback.svg",
    coverRemote: "",
    href,
  };
}

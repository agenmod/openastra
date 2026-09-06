import { customAlphabet } from "nanoid";

const nano = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 8);

export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function makeSlug(title: string) {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);
  return `${base || "game"}-${nano()}`;
}

export function formatCount(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(n);
}

export function initials(name: string) {
  return name.slice(0, 1).toUpperCase();
}

const PALETTES = [
  ["#1b1030", "#ff4d9a", "#7c5cff"],
  ["#071820", "#3ee6c3", "#4cc9f0"],
  ["#1a0b08", "#ff7a18", "#ffd166"],
  ["#0c1024", "#4361ee", "#f72585"],
  ["#101010", "#beff3c", "#7c5cff"],
  ["#14081c", "#c77dff", "#ff6b6b"],
];

export function coverFor(title: string) {
  let hash = 0;
  for (const ch of title) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  const [from, mid, to] = PALETTES[hash % PALETTES.length];
  return { from, mid, to };
}

import { ASTRA_FEED_ALL, type AstraWork } from "@/lib/astra-feed";
import promptFile from "@/lib/astra-prompts.json";

export type AstraPromptStep = {
  title: string;
  prompts: string[];
};

export type AstraPromptRecord = {
  sourceUrl: string;
  steps: AstraPromptStep[];
};

const PROMPTS = promptFile as Record<string, AstraPromptRecord>;

const EMBED_BLOCKED_HOSTS = new Set([
  "zork-underground-empire.netlify.app",
]);

export function getAstraWork(id: string): AstraWork | undefined {
  return ASTRA_FEED_ALL.find((work) => work.id === id);
}

export function getAstraPrompts(id: string): AstraPromptRecord | null {
  return PROMPTS[id] ?? null;
}

export function astraCanEmbed(playUrl: string): boolean {
  try {
    return !EMBED_BLOCKED_HOSTS.has(new URL(playUrl).host);
  } catch {
    return false;
  }
}

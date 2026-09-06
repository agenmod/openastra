import { AstraCard } from "@/components/AstraCard";
import { localGameToWork } from "@/lib/workshop";

export type GameCardData = {
  id: string;
  slug: string;
  title: string;
  prompt: string;
  cover?: string | null;
  playCount: number;
  likeCount: number;
  author: { displayName: string; username: string };
};

export function GameCard({ game }: { game: GameCardData }) {
  return <AstraCard work={localGameToWork(game)} />;
}

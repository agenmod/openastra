import { redirect } from "next/navigation";
import { CreateStudio } from "@/components/CreateStudio";
import { readSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { ChatTurn } from "@/lib/game-prompt";

export default async function CreatePage({
  searchParams,
}: {
  searchParams: Promise<{ game?: string }>;
}) {
  const user = await readSession();
  if (!user) {
    redirect("/login?next=/create");
  }

  const { game: gameId } = await searchParams;
  if (!gameId) {
    return <CreateStudio />;
  }

  const game = await prisma.game.findFirst({
    where: { id: gameId, authorId: user.id },
  });
  if (!game) {
    redirect("/create");
  }

  let conversation: ChatTurn[] = [];
  try {
    conversation = JSON.parse(game.conversation) as ChatTurn[];
  } catch {
    conversation = [];
  }

  return (
    <CreateStudio
      initial={{
        id: game.id,
        title: game.title,
        html: game.html,
        prompt: game.prompt,
        published: game.published,
        slug: game.slug,
        conversation,
      }}
    />
  );
}

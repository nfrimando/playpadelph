import { notFound } from "next/navigation";
import { getPlayerWithEvents } from "@/lib/db/players";
import PlayerProfileView from "@/components/players/PlayerProfileView";

export default async function PlayerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: rawId } = await params;
  const id = parseInt(rawId);
  if (isNaN(id)) notFound();

  const data = await getPlayerWithEvents(id);
  if (!data) notFound();

  return (
    <PlayerProfileView
      player={data.player}
      events={data.events}
      categoryPoints={data.categoryPoints}
    />
  );
}

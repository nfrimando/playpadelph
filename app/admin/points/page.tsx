import { createClient } from "@/lib/supabase-server";
import PointsView from "./PointsView";
import type { DbPlayer, DbEvent } from "@/lib/types";
import type { PointRow } from "@/components/admin/PointForm";

export default async function AdminPointsPage() {
  const supabase = await createClient();

  const [pointsRes, playersRes, eventsRes] = await Promise.all([
    supabase
      .from("points")
      .select(
        "id, player_id, event_id, points, date_added, player:players(name), event:events(name, category)",
      )
      .order("date_added", { ascending: false }),
    supabase
      .from("players")
      .select("id, name, nickname, nationality, image_link")
      .order("name"),
    supabase
      .from("events")
      .select("id, name, category, start_date, end_date, venue, status")
      .order("end_date", { ascending: false }),
  ]);

  return (
    <PointsView
      points={(pointsRes.data ?? []) as unknown as PointRow[]}
      players={(playersRes.data ?? []) as DbPlayer[]}
      events={(eventsRes.data ?? []) as DbEvent[]}
    />
  );
}

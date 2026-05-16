"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import AdminDataTable, { type Column } from "@/components/admin/AdminDataTable";
import PointForm, { type PointRow } from "@/components/admin/PointForm";
import PointImportModal from "@/components/admin/PointImportModal";
import {
  deletePoint,
  bulkDeletePoints,
  bulkUpdatePoints,
} from "@/lib/admin/actions";
import type { DbPlayer, DbEvent } from "@/lib/types";

const CATEGORY_LABELS: Record<string, string> = {
  mo: "Men's Open",
  ma: "Men's Amateur",
  wo: "Women's Open",
  wa: "Women's Amateur",
  mi: "Men's Intermediate",
  wi: "Women's Intermediate",
};

const inputClass =
  "bg-oat border border-line rounded-[3px] px-3 py-2 text-[12px] text-ink focus:outline-none focus:border-green focus:bg-white transition-colors";

interface PointsViewProps {
  points: PointRow[];
  players: DbPlayer[];
  events: DbEvent[];
}

export default function PointsView({
  points,
  players,
  events,
}: PointsViewProps) {
  const router = useRouter();

  // ── Event selector ────────────────────────────────────────────────────────
  const [selectedEventId, setSelectedEventId] = useState<number | null>(
    events[0]?.id ?? null,
  );
  const selectedEvent = events.find((e) => e.id === selectedEventId);

  const filteredPoints = useMemo(
    () =>
      selectedEventId
        ? points.filter((p) => p.event_id === selectedEventId)
        : points,
    [points, selectedEventId],
  );

  // ── Modals ────────────────────────────────────────────────────────────────
  const [editing, setEditing] = useState<PointRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [importing, setImporting] = useState(false);

  // ── Inline bulk edit ──────────────────────────────────────────────────────
  const [editMode, setEditMode] = useState(false);
  const [editedRows, setEditedRows] = useState<
    Map<number, { points: string; date_added: string }>
  >(new Map());
  const [saving, setSaving] = useState(false);

  function enterEditMode() {
    const initial = new Map<number, { points: string; date_added: string }>();
    for (const row of filteredPoints) {
      initial.set(row.id, {
        points: String(row.points),
        date_added: row.date_added,
      });
    }
    setEditedRows(initial);
    setEditMode(true);
  }

  function cancelEditMode() {
    setEditedRows(new Map());
    setEditMode(false);
  }

  async function handleSaveBulkEdit() {
    setSaving(true);
    const updates: { id: number; points: number; date_added: string }[] = [];
    for (const [id, vals] of editedRows.entries()) {
      const original = filteredPoints.find((r) => r.id === id);
      if (!original) continue;
      const newPts = parseInt(vals.points, 10);
      if (isNaN(newPts)) continue;
      // only send changed rows
      if (
        newPts !== original.points ||
        vals.date_added !== original.date_added
      ) {
        updates.push({ id, points: newPts, date_added: vals.date_added });
      }
    }
    if (updates.length > 0) await bulkUpdatePoints(updates);
    setEditMode(false);
    setEditedRows(new Map());
    setSaving(false);
    router.refresh();
  }

  // ── Edit-mode columns ─────────────────────────────────────────────────────
  const editColumns: Column<PointRow>[] = [
    { key: "id", label: "ID", width: "60px" },
    {
      key: "player",
      label: "Player",
      render: (row) =>
        row.player?.name ?? (
          <span className="text-mid text-[11px]">ID {row.player_id}</span>
        ),
    },
    {
      key: "event",
      label: "Event",
      render: (row) =>
        row.event?.name ?? (
          <span className="text-mid text-[11px]">ID {row.event_id}</span>
        ),
    },
    {
      key: "points",
      label: "Points",
      render: (row) => {
        const val = editedRows.get(row.id)?.points ?? String(row.points);
        return (
          <input
            type="number"
            min="0"
            value={val}
            onChange={(e) =>
              setEditedRows((prev) => {
                const next = new Map(prev);
                next.set(row.id, {
                  ...(next.get(row.id) ?? {
                    points: val,
                    date_added: row.date_added,
                  }),
                  points: e.target.value,
                });
                return next;
              })
            }
            className="w-[90px] bg-oat border border-line rounded-[3px] px-2 py-1 text-[13px] font-display font-semibold text-green focus:outline-none focus:border-green focus:bg-white"
          />
        );
      },
    },
    {
      key: "date_added",
      label: "Date Added",
      render: (row) => {
        const val = editedRows.get(row.id)?.date_added ?? row.date_added;
        return (
          <input
            type="date"
            value={val}
            onChange={(e) =>
              setEditedRows((prev) => {
                const next = new Map(prev);
                const pts = next.get(row.id)?.points ?? String(row.points);
                next.set(row.id, { points: pts, date_added: e.target.value });
                return next;
              })
            }
            className="bg-oat border border-line rounded-[3px] px-2 py-1 text-[12px] text-ink focus:outline-none focus:border-green focus:bg-white"
          />
        );
      },
    },
  ];

  // ── Normal columns ────────────────────────────────────────────────────────
  const normalColumns: Column<PointRow>[] = [
    { key: "id", label: "ID", width: "60px" },
    {
      key: "player",
      label: "Player",
      render: (row) =>
        row.player?.name ?? (
          <span className="text-mid text-[11px]">ID {row.player_id}</span>
        ),
    },
    {
      key: "event",
      label: "Event",
      render: (row) =>
        row.event?.name ?? (
          <span className="text-mid text-[11px]">ID {row.event_id}</span>
        ),
    },
    {
      key: "event_category",
      label: "Cat.",
      render: (row) =>
        row.event?.category ? (
          <span className="text-[11px] text-mid uppercase tracking-[1px]">
            {row.event.category}
          </span>
        ) : (
          <span className="text-mid">—</span>
        ),
    },
    {
      key: "points",
      label: "Points",
      render: (row) => (
        <span className="font-display text-[18px] font-semibold text-green">
          {row.points.toLocaleString()}
        </span>
      ),
    },
    { key: "date_added", label: "Date Added" },
  ];

  // ── Handlers ──────────────────────────────────────────────────────────────
  async function handleDelete(row: PointRow) {
    const playerName = row.player?.name ?? `Player #${row.player_id}`;
    const eventName = row.event?.name ?? `Event #${row.event_id}`;
    if (!confirm(`Delete ${row.points} pts for ${playerName} at ${eventName}?`))
      return;
    await deletePoint(row.id);
    router.refresh();
  }

  async function handleBulkDelete(rows: PointRow[]) {
    if (
      !confirm(`Delete ${rows.length} points entry(s)? This cannot be undone.`)
    )
      return;
    await bulkDeletePoints(rows.map((r) => r.id));
    router.refresh();
  }

  function handleSaved() {
    setCreating(false);
    setEditing(null);
    router.refresh();
  }

  // ── Event selector label ──────────────────────────────────────────────────
  const eventSelectLabel = selectedEvent
    ? `${selectedEvent.name} · ${CATEGORY_LABELS[selectedEvent.category] ?? selectedEvent.category} · ends ${selectedEvent.end_date}`
    : "";

  return (
    <>
      {/* Event selector bar */}
      <div className="bg-white border border-line rounded-[3px] px-5 py-4 mb-4 flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[280px]">
          <label className="block text-[9px] tracking-[2.5px] uppercase text-mid mb-1.5">
            Event
          </label>
          <select
            value={selectedEventId ?? ""}
            onChange={(e) => setSelectedEventId(Number(e.target.value) || null)}
            className={`w-full ${inputClass}`}
          >
            <option value="">— All events —</option>
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.name} · {CATEGORY_LABELS[ev.category] ?? ev.category} · ends{" "}
                {ev.end_date}
              </option>
            ))}
          </select>
        </div>

        {/* Bulk edit controls */}
        <div className="flex items-end gap-2 pb-0.5">
          {editMode ? (
            <>
              <button
                type="button"
                onClick={handleSaveBulkEdit}
                disabled={saving}
                className={`px-4 py-2 text-[9.5px] font-bold tracking-[1.5px] uppercase rounded-[2px] font-body transition-colors
                  ${saving ? "bg-oat-dark text-line" : "bg-green text-oat hover:bg-green-dark"}`}
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={cancelEditMode}
                className="px-4 py-2 text-[9.5px] font-bold tracking-[1.5px] uppercase rounded-[2px] font-body text-mid hover:text-ink transition-colors border border-line"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  if (selectedEventId) setImporting(true);
                }}
                disabled={!selectedEventId}
                title={!selectedEventId ? "Select an event first" : undefined}
                className={`px-4 py-2 text-[9.5px] font-bold tracking-[1.5px] uppercase rounded-[2px] font-body transition-colors border border-line
                  ${!selectedEventId ? "bg-oat-dark text-line cursor-not-allowed" : "bg-oat text-mid hover:text-ink"}`}
              >
                Import CSV
              </button>
              <button
                type="button"
                onClick={() => {
                  if (filteredPoints.length > 0) enterEditMode();
                }}
                disabled={filteredPoints.length === 0}
                title={
                  filteredPoints.length === 0 ? "No rows to edit" : undefined
                }
                className={`px-4 py-2 text-[9.5px] font-bold tracking-[1.5px] uppercase rounded-[2px] font-body transition-colors border border-line
                  ${filteredPoints.length === 0 ? "bg-oat-dark text-line cursor-not-allowed" : "bg-oat text-mid hover:text-ink"}`}
              >
                Edit Mode
              </button>
            </>
          )}
        </div>
      </div>

      <AdminDataTable<PointRow>
        title={`Points${selectedEvent ? ` — ${selectedEvent.name}` : ""}`}
        columns={editMode ? editColumns : normalColumns}
        rows={filteredPoints}
        searchKeys={editMode ? [] : ["date_added"]}
        onAdd={editMode ? undefined : () => setCreating(true)}
        onEdit={editMode ? undefined : (row) => setEditing(row)}
        onDelete={editMode ? undefined : handleDelete}
        onBulkDelete={editMode ? undefined : handleBulkDelete}
      />

      {(creating || editing) && (
        <PointForm
          point={editing ?? undefined}
          players={players}
          events={events}
          defaultEventId={selectedEventId ?? undefined}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
          onSaved={handleSaved}
        />
      )}

      {importing && selectedEventId && selectedEvent && (
        <PointImportModal
          eventId={selectedEventId}
          eventLabel={eventSelectLabel}
          players={players}
          onClose={() => setImporting(false)}
          onImported={() => {
            setImporting(false);
            router.refresh();
          }}
        />
      )}
    </>
  );
}

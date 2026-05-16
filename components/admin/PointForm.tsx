"use client";

import { useState } from "react";
import type { DbPlayer, DbEvent } from "@/lib/types";
import { createPoint, updatePoint } from "@/lib/admin/actions";

export interface PointRow {
  id: number;
  player_id: number;
  event_id: number;
  points: number;
  date_added: string;
  player: { name: string } | null;
  event: { name: string; category: string } | null;
}

interface PointFormProps {
  point?: PointRow;
  players: DbPlayer[];
  events: DbEvent[];
  defaultEventId?: number;
  onClose: () => void;
  onSaved: () => void;
}

const inputClass =
  "w-full bg-oat border border-line rounded-[3px] px-3 py-2 text-[12px] text-ink focus:outline-none focus:border-green focus:bg-white transition-colors";

function CloseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

const CATEGORY_LABELS: Record<string, string> = {
  mo: "Men's Open",
  ma: "Men's Amateur",
  wo: "Women's Open",
  wa: "Women's Amateur",
};

export default function PointForm({
  point,
  players,
  events,
  defaultEventId,
  onClose,
  onSaved,
}: PointFormProps) {
  const [form, setForm] = useState({
    player_id: point?.player_id?.toString() ?? "",
    event_id: point?.event_id?.toString() ?? defaultEventId?.toString() ?? "",
    points: point?.points?.toString() ?? "",
    date_added: point?.date_added ?? new Date().toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function set(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = {
        player_id: Number(form.player_id),
        event_id: Number(form.event_id),
        points: Number(form.points),
        date_added: form.date_added,
      };
      if (point) {
        await updatePoint(point.id, data);
      } else {
        await createPoint(data);
      }
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40">
      <div className="bg-white border border-line rounded-[3px] w-full max-w-[440px] mx-4 shadow-[0_8px_40px_rgba(0,0,0,.18)]">
        <div className="flex items-center justify-between px-6 py-5 border-b border-line">
          <h2 className="font-display text-[22px] font-semibold text-ink">
            {point ? "Edit Points Entry" : "Add Points Entry"}
          </h2>
          <button
            onClick={onClose}
            className="text-mid hover:text-ink transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="text-[11px] text-[#c0392b] bg-[#fceaea] border border-[#f5c6c6] rounded-[3px] px-3 py-2.5">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[9px] tracking-[2.5px] uppercase text-mid mb-1.5">
              Player <span className="text-[#c0392b]">*</span>
            </label>
            <select
              value={form.player_id}
              onChange={set("player_id")}
              required
              className={inputClass}
            >
              <option value="">— Select player —</option>
              {players.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[9px] tracking-[2.5px] uppercase text-mid mb-1.5">
              Event <span className="text-[#c0392b]">*</span>
            </label>
            <select
              value={form.event_id}
              onChange={set("event_id")}
              required
              className={inputClass}
            >
              <option value="">— Select event —</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.name} · {CATEGORY_LABELS[ev.category] ?? ev.category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[9px] tracking-[2.5px] uppercase text-mid mb-1.5">
              Points <span className="text-[#c0392b]">*</span>
            </label>
            <input
              type="number"
              min="0"
              value={form.points}
              onChange={set("points")}
              required
              className={inputClass}
              placeholder="e.g. 1000"
            />
          </div>

          <div>
            <label className="block text-[9px] tracking-[2.5px] uppercase text-mid mb-1.5">
              Date Added <span className="text-[#c0392b]">*</span>
            </label>
            <input
              type="date"
              value={form.date_added}
              onChange={set("date_added")}
              required
              className={inputClass}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[9.5px] font-bold tracking-[1.5px] uppercase rounded-[2px] text-mid hover:text-ink transition-colors font-body"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-5 py-2.5 text-[9.5px] font-bold tracking-[1.5px] uppercase rounded-[2px] font-body transition-colors
                ${loading ? "bg-oat-dark text-line" : "bg-green text-oat hover:bg-green-dark"}`}
            >
              {loading ? "Saving…" : point ? "Save changes" : "Add entry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

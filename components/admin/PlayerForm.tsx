"use client";

import { useState } from "react";
import type { DbPlayer } from "@/lib/types";
import { createPlayer, updatePlayer } from "@/lib/admin/actions";

interface PlayerFormProps {
  player?: DbPlayer;
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

export default function PlayerForm({
  player,
  onClose,
  onSaved,
}: PlayerFormProps) {
  const [form, setForm] = useState({
    name: player?.name ?? "",
    nickname: player?.nickname ?? "",
    nationality: player?.nationality ?? "",
    image_link: player?.image_link ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function set(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = {
        name: form.name.trim(),
        nickname: form.nickname.trim() || null,
        nationality: form.nationality.trim() || null,
        image_link: form.image_link.trim() || null,
      };
      if (player) {
        await updatePlayer(player.id, data);
      } else {
        await createPlayer(data);
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
            {player ? "Edit Player" : "Add Player"}
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
              Name <span className="text-[#c0392b]">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={set("name")}
              required
              className={inputClass}
              placeholder="Full name"
            />
          </div>

          <div>
            <label className="block text-[9px] tracking-[2.5px] uppercase text-mid mb-1.5">
              Nickname
            </label>
            <input
              type="text"
              value={form.nickname}
              onChange={set("nickname")}
              className={inputClass}
              placeholder="Optional"
            />
          </div>

          <div>
            <label className="block text-[9px] tracking-[2.5px] uppercase text-mid mb-1.5">
              Nationality
            </label>
            <input
              type="text"
              value={form.nationality}
              onChange={set("nationality")}
              className={inputClass}
              placeholder="e.g. PH, USA, JPN"
            />
          </div>

          <div>
            <label className="block text-[9px] tracking-[2.5px] uppercase text-mid mb-1.5">
              Image URL
            </label>
            <input
              type="url"
              value={form.image_link}
              onChange={set("image_link")}
              className={inputClass}
              placeholder="https://…"
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
              {loading ? "Saving…" : player ? "Save changes" : "Add player"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

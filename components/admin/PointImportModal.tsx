"use client";

import { useRef, useState } from "react";
import type { DbPlayer } from "@/lib/types";
import {
  bulkCreatePoints,
  replaceEventPoints,
  type BulkCreateConflict,
} from "@/lib/admin/actions";

interface PointImportModalProps {
  eventId: number;
  eventLabel: string;
  players: DbPlayer[];
  onClose: () => void;
  onImported: () => void;
}

type Tab = "file" | "paste";
type Mode = "add" | "replace";

interface ParsedRow {
  player_id: number;
  points: number;
  date_added: string;
}

interface ParseError {
  row: number;
  message: string;
}

const TODAY = new Date().toISOString().split("T")[0];

const TOOLTIP_LINES = [
  "CSV format: player_id,points,date_added",
  "• player_id — numeric ID from the Players table",
  "• points — integer point value",
  "• date_added — optional ISO date (YYYY-MM-DD); defaults to today",
  "• First row must be the header row",
  "• event_id is set from the event selector (not a CSV column)",
  "",
  "Example:",
  "player_id,points,date_added",
  "3,500,2026-05-16",
  "7,300",
];

function InfoIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <line
        x1="12"
        y1="8"
        x2="12"
        y2="8"
        strokeLinecap="round"
        strokeWidth="3"
      />
      <line
        x1="12"
        y1="12"
        x2="12"
        y2="16"
        strokeLinecap="round"
        strokeWidth="2.5"
      />
    </svg>
  );
}

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

function parseCSV(raw: string): { rows: ParsedRow[]; errors: ParseError[] } {
  const lines = raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length < 2) {
    return {
      rows: [],
      errors: [
        {
          row: 0,
          message: "CSV must have a header row and at least one data row.",
        },
      ],
    };
  }

  const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const pidIdx = header.indexOf("player_id");
  const ptsIdx = header.indexOf("points");
  const dateIdx = header.indexOf("date_added");

  if (pidIdx === -1 || ptsIdx === -1) {
    return {
      rows: [],
      errors: [
        {
          row: 1,
          message: `Missing required columns. Found: "${header.join(", ")}". Expected: player_id, points (and optionally date_added).`,
        },
      ],
    };
  }

  const rows: ParsedRow[] = [];
  const errors: ParseError[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",").map((c) => c.trim());
    const rowNum = i + 1;

    const rawPid = cols[pidIdx];
    const rawPts = cols[ptsIdx];
    const rawDate = dateIdx !== -1 ? cols[dateIdx] : undefined;

    const player_id = parseInt(rawPid, 10);
    if (!rawPid || isNaN(player_id) || player_id <= 0) {
      errors.push({
        row: rowNum,
        message: `Row ${rowNum}: invalid player_id "${rawPid}".`,
      });
      continue;
    }

    const points = parseInt(rawPts, 10);
    if (!rawPts || isNaN(points) || points < 0) {
      errors.push({
        row: rowNum,
        message: `Row ${rowNum}: invalid points value "${rawPts}".`,
      });
      continue;
    }

    let date_added = TODAY;
    if (rawDate && rawDate.length > 0) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
        errors.push({
          row: rowNum,
          message: `Row ${rowNum}: invalid date_added "${rawDate}". Use YYYY-MM-DD.`,
        });
        continue;
      }
      date_added = rawDate;
    }

    rows.push({ player_id, points, date_added });
  }

  return { rows, errors };
}

export default function PointImportModal({
  eventId,
  eventLabel,
  players,
  onClose,
  onImported,
}: PointImportModalProps) {
  const [tab, setTab] = useState<Tab>("file");
  const [mode, setMode] = useState<Mode>("add");
  const [pasteText, setPasteText] = useState("");
  const [parseErrors, setParseErrors] = useState<ParseError[]>([]);
  const [conflicts, setConflicts] = useState<BulkCreateConflict[]>([]);
  const [preview, setPreview] = useState<ParsedRow[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const playerMap = new Map<number, string>(players.map((p) => [p.id, p.name]));

  function resetState() {
    setParseErrors([]);
    setConflicts([]);
    setPreview(null);
    setServerError("");
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    resetState();
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const { rows, errors } = parseCSV(text);
      setParseErrors(errors);
      if (errors.length === 0) setPreview(rows);
    };
    reader.readAsText(file);
  }

  function handleParsePaste() {
    resetState();
    const { rows, errors } = parseCSV(pasteText);
    setParseErrors(errors);
    if (errors.length === 0) setPreview(rows);
  }

  async function handleImport() {
    if (!preview || preview.length === 0) return;
    setLoading(true);
    setServerError("");
    setConflicts([]);
    try {
      const data = preview.map((r) => ({ ...r, event_id: eventId }));
      if (mode === "replace") {
        await replaceEventPoints(eventId, data);
        onImported();
      } else {
        const result = await bulkCreatePoints(data);
        if (result.conflicts.length > 0) {
          setConflicts(result.conflicts);
          setLoading(false);
          return;
        }
        onImported();
      }
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Something went wrong",
      );
      setLoading(false);
    }
  }

  const tabClass = (t: Tab) =>
    `px-4 py-2.5 text-[10px] font-bold tracking-[1.5px] uppercase font-body border-b-2 transition-colors ${
      tab === t
        ? "text-green border-green"
        : "text-mid border-transparent hover:text-ink"
    }`;

  const modeClass = (m: Mode) =>
    `flex-1 py-2 text-[10px] font-bold tracking-[1.5px] uppercase font-body rounded-[2px] transition-colors ${
      mode === m ? "bg-green text-oat" : "bg-oat text-mid hover:text-ink"
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40">
      <div className="bg-white border border-line rounded-[3px] w-full max-w-[540px] mx-4 shadow-[0_8px_40px_rgba(0,0,0,.18)] max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-line shrink-0">
          <div>
            <h2 className="font-display text-[22px] font-semibold text-ink">
              Import CSV
            </h2>
            <p className="text-[11px] text-mid mt-0.5">{eventLabel}</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Tooltip */}
            <div className="relative">
              <button
                type="button"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="text-mid hover:text-ink transition-colors p-1"
                aria-label="CSV format help"
              >
                <InfoIcon />
              </button>
              {showTooltip && (
                <div className="absolute right-0 top-7 z-10 w-[300px] bg-ink text-oat text-[11px] leading-5 rounded-[3px] p-3 shadow-lg whitespace-pre font-mono">
                  {TOOLTIP_LINES.join("\n")}
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-mid hover:text-ink transition-colors"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 flex flex-col">
          {/* Mode toggle */}
          <div className="px-6 pt-5 pb-0 shrink-0">
            <p className="text-[9px] tracking-[2.5px] uppercase text-mid mb-2">
              Import Mode
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                className={modeClass("add")}
                onClick={() => {
                  setMode("add");
                  resetState();
                }}
              >
                Add rows
              </button>
              <button
                type="button"
                className={modeClass("replace")}
                onClick={() => {
                  setMode("replace");
                  resetState();
                }}
              >
                Replace event
              </button>
            </div>
            {mode === "replace" && (
              <p className="text-[11px] text-[#8a7040] bg-[#f5f0e8] border border-[#e8dfc0] rounded-[3px] px-3 py-2 mt-2.5">
                All existing points for this event will be deleted and replaced
                with the imported rows.
              </p>
            )}
          </div>

          {/* Tabs */}
          <div className="flex border-b border-line px-6 mt-4 shrink-0">
            <button
              type="button"
              className={tabClass("file")}
              onClick={() => {
                setTab("file");
                resetState();
              }}
            >
              Upload File
            </button>
            <button
              type="button"
              className={tabClass("paste")}
              onClick={() => {
                setTab("paste");
                resetState();
              }}
            >
              Paste Text
            </button>
          </div>

          <div className="px-6 py-5 space-y-4 flex-1">
            {/* File upload */}
            {tab === "file" && (
              <div>
                <label className="block text-[9px] tracking-[2.5px] uppercase text-mid mb-1.5">
                  CSV File
                </label>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileChange}
                  className="w-full text-[12px] text-ink file:mr-3 file:py-1.5 file:px-3 file:rounded-[2px] file:border-0 file:text-[9.5px] file:font-bold file:tracking-[1.5px] file:uppercase file:font-body file:bg-oat file:text-mid hover:file:text-ink cursor-pointer"
                />
              </div>
            )}

            {/* Paste text */}
            {tab === "paste" && (
              <div>
                <label className="block text-[9px] tracking-[2.5px] uppercase text-mid mb-1.5">
                  Paste CSV Text
                </label>
                <textarea
                  value={pasteText}
                  onChange={(e) => {
                    setPasteText(e.target.value);
                    resetState();
                  }}
                  rows={7}
                  placeholder={
                    "player_id,points,date_added\n3,500,2026-05-16\n7,300"
                  }
                  className="w-full bg-oat border border-line rounded-[3px] px-3 py-2 text-[12px] text-ink font-mono focus:outline-none focus:border-green focus:bg-white transition-colors resize-y"
                />
                <button
                  type="button"
                  onClick={handleParsePaste}
                  className="mt-2 px-4 py-2 text-[9.5px] font-bold tracking-[1.5px] uppercase rounded-[2px] font-body bg-oat text-mid hover:text-ink transition-colors border border-line"
                >
                  Parse
                </button>
              </div>
            )}

            {/* Parse errors */}
            {parseErrors.length > 0 && (
              <div className="bg-[#fceaea] border border-[#f5c6c6] rounded-[3px] px-3 py-2.5 space-y-1">
                <p className="text-[9.5px] font-bold tracking-[1.5px] uppercase text-[#c0392b]">
                  Parse errors ({parseErrors.length})
                </p>
                {parseErrors.map((e, i) => (
                  <p key={i} className="text-[11px] text-[#c0392b]">
                    {e.message}
                  </p>
                ))}
              </div>
            )}

            {/* Conflict errors */}
            {conflicts.length > 0 && (
              <div className="bg-[#fceaea] border border-[#f5c6c6] rounded-[3px] px-3 py-2.5">
                <p className="text-[9.5px] font-bold tracking-[1.5px] uppercase text-[#c0392b] mb-2">
                  Conflicts — no rows were imported ({conflicts.length})
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-[11px]">
                    <thead>
                      <tr className="text-left text-[#c0392b]/70">
                        <th className="pb-1 pr-4 font-semibold">Row #</th>
                        <th className="pb-1 pr-4 font-semibold">Player</th>
                        <th className="pb-1 font-semibold">Existing pts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {conflicts.map((c, i) => (
                        <tr key={i} className="border-t border-[#f5c6c6]">
                          <td className="py-1 pr-4 text-[#c0392b]">
                            {c.rowIndex}
                          </td>
                          <td className="py-1 pr-4 text-[#c0392b]">
                            {playerMap.get(c.player_id) ?? `ID ${c.player_id}`}
                          </td>
                          <td className="py-1 text-[#c0392b] font-semibold font-display">
                            {c.existing_points.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-[11px] text-[#c0392b] mt-2">
                  Switch to <strong>Replace event</strong> mode or remove
                  duplicate rows from your CSV.
                </p>
              </div>
            )}

            {/* Server error */}
            {serverError && (
              <div className="text-[11px] text-[#c0392b] bg-[#fceaea] border border-[#f5c6c6] rounded-[3px] px-3 py-2.5">
                {serverError}
              </div>
            )}

            {/* Preview */}
            {preview && preview.length > 0 && parseErrors.length === 0 && (
              <div>
                <p className="text-[9px] tracking-[2.5px] uppercase text-mid mb-2">
                  Preview — {preview.length} row
                  {preview.length !== 1 ? "s" : ""}
                </p>
                <div className="border border-line rounded-[3px] overflow-hidden">
                  <div className="overflow-x-auto max-h-[160px] overflow-y-auto">
                    <table className="w-full">
                      <thead className="bg-oat sticky top-0">
                        <tr>
                          <th className="text-left text-[8.5px] font-bold tracking-[1.5px] uppercase text-mid px-3 py-2">
                            Player
                          </th>
                          <th className="text-left text-[8.5px] font-bold tracking-[1.5px] uppercase text-mid px-3 py-2">
                            Points
                          </th>
                          <th className="text-left text-[8.5px] font-bold tracking-[1.5px] uppercase text-mid px-3 py-2">
                            Date Added
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {preview.map((row, i) => (
                          <tr
                            key={i}
                            className="border-t border-oat-dark hover:bg-[#f6f8f3]"
                          >
                            <td className="px-3 py-2 text-[12px] text-ink">
                              {playerMap.get(row.player_id) ?? (
                                <span className="text-[#c0392b]">
                                  Unknown ID {row.player_id}
                                </span>
                              )}
                            </td>
                            <td className="px-3 py-2 font-display text-[15px] font-semibold text-green">
                              {row.points.toLocaleString()}
                            </td>
                            <td className="px-3 py-2 text-[12px] text-mid">
                              {row.date_added}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-line shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-[9.5px] font-bold tracking-[1.5px] uppercase rounded-[2px] text-mid hover:text-ink transition-colors font-body"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleImport}
            disabled={
              !preview ||
              preview.length === 0 ||
              loading ||
              parseErrors.length > 0
            }
            className={`px-5 py-2.5 text-[9.5px] font-bold tracking-[1.5px] uppercase rounded-[2px] font-body transition-colors
              ${
                !preview ||
                preview.length === 0 ||
                loading ||
                parseErrors.length > 0
                  ? "bg-oat-dark text-line cursor-not-allowed"
                  : "bg-green text-oat hover:bg-green-dark"
              }`}
          >
            {loading
              ? "Importing…"
              : mode === "replace"
                ? "Replace & Import"
                : `Import ${preview?.length ?? 0} row${preview?.length !== 1 ? "s" : ""}`}
          </button>
        </div>
      </div>
    </div>
  );
}

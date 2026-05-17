import Image from "next/image";
import Link from "next/link";
import type { DbPlayer, PlayerEventEntry } from "@/lib/types";

const FLAGS: Record<string, string> = {
  PH: "🇵🇭",
  PHI: "🇵🇭",
  JPN: "🇯🇵",
  JP: "🇯🇵",
  FRA: "🇫🇷",
  ARG: "🇦🇷",
  AUS: "🇦🇺",
  SWE: "🇸🇪",
  ESP: "🇪🇸",
  DEN: "🇩🇰",
  IRI: "🇮🇷",
  RUS: "🇷🇺",
  US: "🇺🇸",
  USA: "🇺🇸",
  CHN: "🇨🇳",
  TH: "🇹🇭",
  THA: "🇹🇭",
  NL: "🇳🇱",
  ITA: "🇮🇹",
  GER: "🇩🇪",
  CAN: "🇨🇦",
  MEX: "🇲🇽",
  BRA: "🇧🇷",
  KOR: "🇰🇷",
  IND: "🇮🇳",
  IDN: "🇮🇩",
  VIE: "🇻🇳",
  MAS: "🇲🇾",
  SGP: "🇸🇬",
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function getFlag(nat: string | null) {
  return nat ? (FLAGS[nat.toUpperCase()] ?? null) : null;
}

function getInitials(name: string) {
  return name
    .trim()
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function fmtDateRange(startDate: string, endDate: string): string {
  const [sy, sm, sd] = startDate.split("-").map(Number);
  const [, em, ed] = endDate.split("-").map(Number);
  const startMonStr = MONTHS[sm - 1];
  if (sm === em) {
    if (sd === ed) return `${startMonStr} ${sd}`;
    return `${startMonStr} ${sd}–${ed}`;
  }
  return `${startMonStr} ${sd} – ${MONTHS[em - 1]} ${ed}`;
}

function fmtYear(dateStr: string): string {
  return dateStr.split("-")[0];
}

function CategoryBadge({ category }: { category: string }) {
  const lower = category.toLowerCase();
  const isWomens = lower.includes("women");
  const cls = isWomens
    ? "bg-[#f5eaf0] text-[#7b1e5a]"
    : "bg-[#eaf0f5] text-[#1e3a7b]";
  return (
    <span
      className={`text-[9px] tracking-[1px] uppercase font-semibold px-2 py-0.5 rounded-[2px] whitespace-nowrap ${cls}`}
    >
      {category}
    </span>
  );
}

interface PlayerProfileViewProps {
  player: DbPlayer;
  events: PlayerEventEntry[];
  categoryPoints: { category: string; points: number }[];
}

export default function PlayerProfileView({
  player,
  events,
  categoryPoints,
}: PlayerProfileViewProps) {
  const flag = getFlag(player.nationality);
  const initials = getInitials(player.name);

  const today = new Date();
  const cutoffYear = new Date(today);
  cutoffYear.setDate(today.getDate() - 364);
  const periodLabel = `${MONTHS[cutoffYear.getMonth()]} ${cutoffYear.getFullYear()} – ${MONTHS[today.getMonth()]} ${today.getFullYear()}`;

  return (
    <>
      {/* Hero */}
      <div className="bg-green-dark px-4 sm:px-9 pt-9 pb-8 sm:pt-[52px] sm:pb-[48px] overflow-hidden relative">
        <Link
          href="/rankings"
          className="inline-flex items-center gap-1.5 text-[9px] tracking-[2.5px] uppercase text-oat/40 hover:text-oat/70 transition-colors mb-6 font-body font-semibold"
        >
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Rankings
        </Link>

        <div className="text-[9.5px] tracking-[4px] uppercase text-matcha mb-4">
          Player Profile
        </div>

        <div className="flex items-start gap-4 sm:gap-5 mb-6">
          {player.image_link ? (
            <Image
              src={player.image_link}
              alt={player.name}
              width={72}
              height={72}
              unoptimized
              className="w-[72px] h-[72px] rounded-full object-cover shrink-0 border-2 border-white/10"
            />
          ) : (
            <div className="w-[72px] h-[72px] rounded-full bg-green text-oat flex items-center justify-center font-display text-[26px] font-semibold shrink-0">
              {initials}
            </div>
          )}
          <div>
            <h1 className="font-display text-[32px] sm:text-[52px] font-semibold text-oat leading-[.92] tracking-[-1px]">
              {player.name}
            </h1>
            {player.nationality && (
              <div className="flex items-center gap-2 mt-2">
                {flag && <span className="text-[18px]">{flag}</span>}
                <span className="text-[9px] tracking-[2.5px] uppercase text-oat/45 font-body font-semibold">
                  {player.nationality}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-x-8 gap-y-4 sm:gap-10 pt-7 border-t border-oat/10">
          {categoryPoints.map(({ category, points }) => (
            <div key={category}>
              <span className="font-display text-[28px] sm:text-[38px] font-semibold text-oat block leading-none">
                {points.toLocaleString()}
              </span>
              <span className="text-[9px] tracking-[2.5px] uppercase text-oat/35 block mt-1.5">
                {category}
              </span>
            </div>
          ))}
          {categoryPoints.length === 0 && (
            <div>
              <span className="font-display text-[28px] sm:text-[38px] font-semibold text-oat block leading-none">
                0
              </span>
              <span className="text-[9px] tracking-[2.5px] uppercase text-oat/35 block mt-1.5">
                Ranking Points
              </span>
            </div>
          )}
          <div>
            <span className="font-display text-[28px] sm:text-[38px] font-semibold text-oat block leading-none">
              {events.length}
            </span>
            <span className="text-[9px] tracking-[2.5px] uppercase text-oat/35 block mt-1.5">
              Events Attended
            </span>
          </div>
          <div>
            <span className="font-display text-[28px] sm:text-[38px] font-semibold text-oat block leading-none">
              {periodLabel}
            </span>
            <span className="text-[9px] tracking-[2.5px] uppercase text-oat/35 block mt-1.5">
              Current Period
            </span>
          </div>
        </div>
      </div>

      {/* Tournament History */}
      <div className="max-w-content mx-auto px-4 sm:px-9 py-10 pb-[72px]">
        <div className="text-[9.5px] tracking-[3.5px] uppercase text-mid font-semibold mb-5">
          Tournament History
        </div>

        {events.length === 0 ? (
          <div className="bg-white rounded-[3px] border border-line px-6 py-12 text-center text-mid text-[13px]">
            No tournament history found.
          </div>
        ) : (
          <div className="bg-white rounded-[3px] border border-line overflow-hidden">
            <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="px-5 py-[10px] text-left text-[8.5px] font-bold tracking-[2.5px] uppercase text-mid bg-oat border-b border-line w-[110px]">
                    Date
                  </th>
                  <th className="px-5 py-[10px] text-left text-[8.5px] font-bold tracking-[2.5px] uppercase text-mid bg-oat border-b border-line">
                    Tournament
                  </th>
                  <th className="px-5 py-[10px] text-left text-[8.5px] font-bold tracking-[2.5px] uppercase text-mid bg-oat border-b border-line w-[180px]">
                    Category
                  </th>
                  <th className="px-5 py-[10px] text-right text-[8.5px] font-bold tracking-[2.5px] uppercase text-mid bg-oat border-b border-line pr-6 w-[120px]">
                    Points
                  </th>
                </tr>
              </thead>
              <tbody>
                {events.map((entry, i) => (
                  <tr
                    key={`${entry.eventId}-${i}`}
                    className="border-b border-oat-dark last:border-b-0 hover:bg-[#f6f8f3] transition-colors"
                  >
                    <td className="px-5 py-3 text-[12px] text-mid whitespace-nowrap">
                      <div>{fmtDateRange(entry.startDate, entry.endDate)}</div>
                      <div className="text-[10px] text-mid/60">
                        {fmtYear(entry.startDate)}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="font-semibold text-[13.5px] text-ink">
                        {entry.eventName}
                      </div>
                      {entry.venue && (
                        <div className="text-[11px] text-mid mt-0.5 flex items-center gap-1">
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          {entry.venue}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <CategoryBadge category={entry.category} />
                    </td>
                    <td className="px-5 py-3 pr-6 text-right font-display text-2xl font-semibold text-green">
                      {entry.points.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

# Play Padel PH — Product & Architecture Context

## Project Context

- This web app is for **Play Padel PH**, a padel club based in the Philippines.
- Initial scope:
  - Show **player ratings**
  - Show **tournament standings**
  - Show **player profiles**
- Planned future scope:
  - Tournament and match history
  - Additional player and competition features

## Core Product Goals (Current)

1. Make standings and ratings easy to find and understand.
2. Provide clear player profile pages with relevant tournament context.
3. Keep the system extensible for future features without major rewrites.

## Architecture Principles

1. **Reusable components first**
   - Build shared UI primitives (tables, cards, profile stats blocks, badges, filters).
   - Avoid duplicating layout and display logic across standings, ratings, and profiles.
2. **Modular feature structure**
   - Organize by feature domain (e.g., `standings`, `ratings`, `players`) with clear boundaries.
   - Keep data access, business logic, and UI layers separate.
3. **Efficient database pulls**
   - Fetch only required columns/rows from Supabase.
   - Use indexed filters and pagination for standings/history lists.
   - Prefer server-side aggregation/querying over heavy client-side joins when possible.
   - Prevent N+1 query patterns by designing query shapes per screen.
4. **Scalable defaults**
   - Design APIs/components so adding match history and deeper analytics remains straightforward.

## Stack

- **Framework:** Next.js 15 (App Router) — deployed on Vercel
- **Backend:** Supabase (Postgres)
- **Styling:** Tailwind CSS v3 with brand color tokens

## Backend Notes (Supabase)

- Use Supabase Postgres as source of truth for players, tournaments, standings, and ratings.
- Enforce row-level security policies as features/auth expand.
- Add migrations for schema evolution instead of ad-hoc manual table changes.

## Brand Book (Derived from Current Implementation)

> Reflects what is actually in the codebase as of May 2026. Update when design decisions change.

### 1) Brand Foundation

- Brand name: **Play Padel** / **Play Padel Philippines**
- Tour name: **Philippine Islands Padel Tour (PIPT)** / **Padel Pilipinas**
- Positioning: "The home of competitive padel in the Philippines — premium courts, sanctioned tournaments, and the official PIPT player rankings."
- Personality: Premium, official, sport-forward, clean

### 2) Logo Usage

- Wordmark: `Play Padel` in `font-display` (Cormorant Garamond) semibold, rendered on dark green
- Subline: `Philippines` in 9.5px uppercase with 3px letter-spacing, `text-oat/40`
- The `PP` initials are used as a large watermark on the hero (via `.hero-watermark::before`)

### 3) Color System

Defined in `tailwind.config.ts`:

| Token | Hex | Role |
|---|---|---|
| `green` | `#1a5c38` | Primary brand — hero, CTAs, active states, avatars |
| `green-dark` | `#0f3d24` | Header, footer background |
| `oat` | `#f0ede4` | Page background, light surfaces |
| `oat-dark` | `#e4dfd4` | Table row dividers, disabled button bg, progress bar track |
| `butter` | `#e8e4c0` | 1st-place highlight, tournament date numbers |
| `matcha` | `#8eaf5a` | Accent — section overlines, status dot, progress bar gradient start |
| `ink` | `#1a1a1a` | Primary body text |
| `mid` | `#5c5c5c` | Secondary text, muted labels |
| `line` | `#d4cfc6` | Borders, dividers |
| `silver` | `#8a9299` | 2nd-place podium points |
| `bronze` | `#a0673a` | 3rd-place podium points |

Semantic status colors (inline, in `STATUS_CONFIG`):
- Open: `bg-[#e8f5ee] text-green`
- Closed: `bg-[#f5f0e8] text-[#8a7040]`
- Full: `bg-[#fceaea] text-[#c0392b]`
- Upcoming: `bg-[#eaf0f5] text-[#1e3a7b]`
- Past: `bg-oat-dark text-mid`

White with opacity (e.g. `bg-white/[0.08]`, `text-oat/50`) is used for overlays on green backgrounds.

### 4) Typography

- **Display font:** `Cormorant Garamond` — CSS var `--font-display`, weights 500/600/700, normal + italic. Used for all headings, large numbers, the wordmark, and podium ranks.
- **Body font:** `DM Sans` — CSS var `--font-body`, weights 300/400/500/600. Used for nav, labels, buttons, table data, body copy.

Type scale in use:
| Size | Usage |
|---|---|
| 68px display | Hero `h1` |
| 52px display | Month/section headers (Calendar) |
| 42px display | Podium point totals |
| 38px display | Hero stat values |
| 28px display | Footer wordmark, tournament date day |
| 24px display | Rankings table point totals |
| 21px display | Rankings table rank numbers |
| 19px display | Tournament row title |
| 18px display | Podium player names |
| 13.5px body | Rankings table player names |
| 12px (xs) body | Body copy, footer text, search input |
| 10–11px body | Tab labels (uppercase + tracking) |
| 9–9.5px body | Section overlines, table headers, badge labels (uppercase + tracking) |

- Italic `<em>` on the second word of hero headlines (e.g. `Player / Rankings`) uses `text-oat/50`
- Overlines/labels pattern: `text-[9–10px] tracking-[2.5–4px] uppercase`

### 5) UI Components & Styling

**Buttons**
- Primary: `bg-green text-oat hover:bg-green-dark rounded-[2px]`, uppercase 9.5px bold, 1.5px letter-spacing, `font-body`
- Disabled: `bg-oat-dark text-line cursor-not-allowed rounded-[2px]`

**Cards / Containers**
- Standard card: `bg-white border border-line rounded-[3px]`
- Podium 1st card: `bg-green rounded-[3px] shadow-[0_14px_40px_rgba(26,92,56,.26)] -translate-y-2.5`
- Podium 2nd/3rd card: `bg-white border border-line rounded-[3px] shadow-[0_3px_12px_rgba(0,0,0,.06)]`

**Tables**
- Container: `bg-white rounded-[3px] border border-line overflow-hidden`
- Header row: `bg-oat`, 8.5px bold uppercase labels, `text-mid`
- Row hover: `hover:bg-[#f6f8f3]`
- Row divider: `border-b border-oat-dark`
- Top-3 rank numbers: `text-green`; others: `text-mid`

**Tabs (sticky nav)**
- Bar: `bg-white border-b border-line`, sticky at `top-[62px]`, `z-[200]`, 50px height
- Active tab: `text-green border-b-2 border-green -mb-px`
- Inactive tab: `text-mid border-transparent hover:text-green`
- Count badge on tab: active = `bg-green text-oat`, inactive = `bg-oat text-mid`, `rounded-[20px]`

**Form Controls**
- Search input: `bg-oat border border-line rounded-[3px]`, focus = `border-green bg-white`
- Checkbox: `accent-green`

**Progress bar:** `h-[3px] bg-gradient-to-r from-matcha to-green`, track = `bg-oat-dark`

**Avatar / Initials:** 34px circle, `bg-green text-oat font-display text-[13px] font-semibold`

**Spacing & Layout**
- Page horizontal padding: `px-9` (36px)
- Max content width: `max-w-content` = 1060px, centered with `mx-auto`
- Hero section: `pt-[60px] pb-[52px]`

**Border radius:** `rounded-[3px]` for cards/containers/inputs, `rounded-[2px]` for buttons, `rounded-[20px]` for badge pills

**Scrollbar:** 4px, oat track, `line`-colored thumb, 2px radius

### 6) Voice & Tone

- Official and sport-forward; use "sanctioned tournaments", "official rankings"
- Tour referred to as "Philippine Islands Padel Tour" or "PIPT" (not abbreviated on first mention)
- Points expiry note: "Points expire when the same tournament runs again, or after 52 weeks — whichever comes first."
- Dates use em-dash range format (e.g. `Apr 25–27`, `Jul 31 – Aug 2`)

### 7) Imagery & Media

- Avatar: initials-only (first + last initial), green circle, display font — no photo avatars currently
- Hero watermark: large semi-transparent `PP` initials behind hero content via CSS pseudo-element (`opacity 3%`)

### 8) Content Guidelines

**Tournament naming:** `[Tournament Name] [Year]` (e.g. `Philippine Open 2026`, `Padel Pilipinas Masters 2026`)

**Category naming:** `Men’s Open`, `Women’s Open`, `Men’s Amateur`, `Women’s Amateur`, `Men’s Intermediate`, `Women’s Intermediate`

**Status labels:** `Registration Open`, `Registration Closed`, `Full`, `Coming Soon`, `Completed`

**Date format:** `Mon DD–DD` for same-month range (e.g. `Mar 27–29`); `Mon DD – Mon DD` for cross-month (e.g. `Jul 31 – Aug 2`); single day as `Mon DD`

**Venue format:** `[Brand] [Location], [City]` (e.g. `Play Padel Greenfield, Mandaluyong`)

**Points:** integer, formatted with `toLocaleString()` (comma thousands separator)

**Rankings period:** rolling `May YYYY – Apr YYYY` label shown in hero badge

### 9) Social & Marketing Extensions

- Instagram: `@playpadelph`
- Facebook: `facebook.com/playpadelph`
- Contact email: `juancho@playpadelph.com`
- Contact phone: `+63 917 149 6824`

### 10) Locations

- Main: Play Padel Greenfield, Mandaluyong
- Satellite: Play Padel McKinley West, Taguig

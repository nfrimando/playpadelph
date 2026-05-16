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

## Platform Stack Decision (Vercel + Supabase)
### Recommendation: **Next.js**
Given Vercel as the deployment platform and Supabase as backend, **Next.js** is the better default choice over Vite for this product.

Why:
- Native Vercel alignment (routing, deployments, edge/server capabilities).
- Server rendering options for fast first load and SEO-ready public pages.
- Server components/routes can reduce client-side data-fetch overhead.
- Good long-term fit as features expand (auth-protected pages, server actions, mixed rendering strategies).

When Vite would be preferred:
- If this were strictly a small client-only SPA with minimal server concerns.

## Backend Notes (Supabase)
- Use Supabase Postgres as source of truth for players, tournaments, standings, and ratings.
- Enforce row-level security policies as features/auth expand.
- Add migrations for schema evolution instead of ad-hoc manual table changes.

## Brand Book Template (Draft Placeholder)
> Keep this section as a template for now; refine/reduce once official brand guidelines are finalized.

### 1) Brand Foundation
- Mission:
- Vision:
- Brand personality (3–5 adjectives):
- Positioning statement:

### 2) Logo Usage
- Primary logo:
- Secondary logo:
- Minimum size:
- Clear space rules:
- Incorrect usage examples:

### 3) Color System
- Primary palette:
- Secondary palette:
- Accent colors:
- Semantic colors (success/warning/error/info):
- Accessibility contrast requirements:

### 4) Typography
- Primary font family:
- Secondary font family:
- Heading scale:
- Body text scale:
- Usage rules:

### 5) UI Components & Styling
- Button styles (primary/secondary/ghost):
- Form controls:
- Cards and table styling:
- Spacing system (e.g., 4/8pt grid):
- Border radius, shadows, and iconography guidance:

### 6) Voice & Tone
- Brand voice principles:
- Microcopy examples:
- Error/success message tone:

### 7) Imagery & Media
- Photo/illustration style:
- Do/Don’t examples:
- Avatar/profile image rules:

### 8) Content Guidelines
- Naming conventions for tournaments/divisions:
- Standings/rating terminology:
- Date/time/location formatting standards:

### 9) Social & Marketing Extensions
- Social profile usage:
- Campaign templates:
- Co-branding rules:

### 10) Governance
- Owner of brand decisions:
- Review/approval workflow:
- Versioning and update cadence:

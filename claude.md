<!-- Project memory and architecture notes for ChessMind development. -->
# ChessMind — Project Memory

## What This Project Is
Chess platform with AI coach, play vs Stockfish, and multiplayer via link.
Target: Russian-speaking chess learners who want to understand their mistakes.

## Architecture
- Frontend + Backend: Next.js 14 App Router on Vercel
- Backend = serverless functions in app/api/ (no separate server)
- Database: Supabase Postgres
- Auth: Supabase Auth (email + Google OAuth)  
- Realtime: Supabase Broadcast for multiplayer move sync
- Chess logic: chess.js (validation + PGN generation)
- AI Engine: Stockfish WASM in Web Worker (no server needed)
- AI Coach: Gemini 2.5 Flash (primary) → OpenRouter Llama 3.3 70B (fallback)

## Key Design Decisions
- PGN format used for storing games (chess.js native, ideal for AI analysis)
- No separate backend server — Next.js API routes handle everything
- Multiplayer without auth for guest (second player joins via link, no signup)
- AI analysis cached in `analyses` table — never re-analyze same game
- JSONB columns (`preferences`, `metadata`) for future features without migrations

## Database Tables
- profiles — extends auth.users, has rating/stats/preferences
- games — stores PGN + result + mode, snapshots usernames
- analyses — AI coach output per game (JSONB array of move comments)
- rooms — multiplayer room state with expiry

## File Conventions
- lib/supabase/ — all Supabase clients and helpers
- lib/ai/ — all AI provider logic (never import in client components)
- lib/chess/ — chess.js and Stockfish helpers
- app/api/ — server-only routes, API keys live here
- hooks/ — React hooks only, no direct DB calls

## Environment Variables
- NEXT_PUBLIC_* — safe for browser
- GEMINI_API_KEY — server only (app/api routes)
- OPENROUTER_API_KEY — server only
- SUPABASE_SERVICE_ROLE_KEY — server only, never expose

## Changes Log
### [DATE] Initial scaffold
- Created full project skeleton
- Defined all TypeScript interfaces
- Set up Supabase client (browser + server)
- SQL migrations ready to apply

### [2026-04-25] Core structure updates
- Added strict Supabase typing in `types/supabase.ts` with Row/Insert/Update models for `profiles`, `games`, `analyses`, `rooms`
- Added domain aliases in `lib/supabase/types.ts` (`Profile`, `Game`, `Analysis`, `Room`)
- Hardened Supabase clients in `lib/supabase/client.ts` and `lib/supabase/server.ts` with env checks and cookie adapters
- Expanded `types/game.ts` with documented interfaces (`GameState`, `Player`, `GameMove`, `GamePlayers`) and game enums
- Updated `app/layout.tsx` to use `next-themes` `ThemeProvider`, `Toaster`, and new `AuthProvider` path
- Added `components/AuthProvider.tsx` placeholder and updated `tsconfig.json` with `jsxImportSource: "react"`

### [2026-04-25] Build fix (`JSX` namespace)
- Fixed `next build` failure (`Cannot find namespace 'JSX'`) by adding `types/jsx.d.ts` global compatibility shim.
- Kept existing component return types (`: JSX.Element`) unchanged by mapping them to `React.JSX.Element` centrally.
- Added `types/styles.d.ts` (`declare module '*.css'`) to fix side-effect CSS import type error in `app/layout.tsx`.
- Updated `lib/supabase/client.ts` to read required env vars through a typed helper inside `createClient()` so strict TypeScript no longer sees `string | undefined`.
- Updated `lib/supabase/server.ts` with the same typed env helper pattern for `createServerClient()` arguments.
- Added `"ignoreDeprecations": "6.0"` in `tsconfig.json` to handle TS6 `baseUrl` deprecation error during `next build`.

## What's Not Done Yet
- [ ] Stockfish WASM file (download separately)
- [ ] Apply SQL migrations in Supabase Dashboard
- [ ] Fill .env.local with real keys
- [ ] shadcn components (run: npx shadcn@latest add button card ... )

<!-- Project memory and architecture notes for ChessMind development. -->
# ChessMind — Project Memory

## What This Project Is
Chess platform with AI coach, play vs AI, and multiplayer via link.
Target: Russian-speaking chess learners who want to understand their mistakes.

## Architecture
- Frontend + Backend: Next.js 14 App Router on Vercel
- Backend = serverless functions in app/api/ (no separate server)
- Database: Supabase Postgres
- Auth: Supabase Auth (email + Google OAuth)  
- Realtime: Supabase Broadcast for multiplayer move sync
- Chess logic: chess.js (validation + PGN generation)
- Chess Engine: Stockfish 11 asm.js (local, runs in Web Worker, no WASM/SharedArrayBuffer needed)
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
- lib/chess/ — chess.js utilities (PGN helpers, etc.)
- app/api/ — server-only routes, API keys live here
- hooks/ — React hooks only, no direct DB calls
- hooks/useStockfish.ts — Stockfish Web Worker hook (init, getBestMove)
- hooks/useChessGame.ts — main game state hook (local + AI modes)
- public/stockfish.js — Stockfish 11 asm.js engine (served as static file)

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

### [2026-04-28] Stockfish AI engine integration
- Removed Lichess Cloud Eval API (was just a cache, returned 404 on non-standard positions)
- Removed `hooks/useChessEngine.ts` and `lib/chess/lichess-engine.ts`
- Added Stockfish 11 asm.js (nmrugg/stockfish.js) — pure JS, single-threaded, no WASM/SharedArrayBuffer
- Created `hooks/useStockfish.ts` — Web Worker with 5s init timeout, UCI protocol (uci → uciok → position fen → go depth → bestmove)
- Fixed race condition in `app/play/ai/page.tsx` — `isAIThinking` in useEffect deps was killing setTimeout via cleanup
- Fixed stale closure in `makeAIMove` — switched to `gameRef.current` for latest game state
- Fixed `ChessBoard` creating duplicate Stockfish Worker — now uses 'local' mode internally
- Difficulty levels: Easy (depth 8), Medium (depth 12), Hard (depth 18)

### [2026-04-29] Profile, Pricing, and Storage
- **Pricing Section**: Implemented a responsive two-column layout (Free vs Pro) on the landing page (`app/page.tsx`) with a premium glassmorphic theme.
- **Profile Management**: Created a dedicated `/profile` route with statistics (ELO, wins/losses/draws), personal info editing, and JSONB-based preferences (board/pieces).
- **Avatar System**: 
  - Created `avatars` storage bucket via migration `004_avatars_bucket.sql`.
  - Implemented file upload to Supabase Storage with automatic URL syncing.
  - Added cache-busting logic (`?t=timestamp`) to bypass browser image caching.
- **Dynamic Navbar**: 
  - Updated `Navbar.tsx` to fetch `username`, `rating`, and `avatar_url` from the `profiles` table.
  - Implemented **Supabase Realtime** subscription in the Navbar for instant UI updates when profile changes occur.
  - Removed old user dropdown for a cleaner, clickable profile header.
- **Build Stability**: 
  - Expanded `useChessGame` and `ChessBoard` types to support `multiplayer` mode.
  - Fixed TypeScript `never` inference issues in `app/profile/page.tsx` and `app/play/multiplayer/[roomId]/game/page.tsx`.
- **UI/UX**: Moved the Logout button to a dedicated profile header to prevent layout overlap on mobile.
### [2026-04-29] Performance, ELO, and PWA Finalization
- **Dynamic ELO System**:
    - Implemented `updatePlayerRatings` server action to automate rating adjustments (+20 Win, -20 Loss, 0 Draw) in the `profiles` table.
    - Integrated rating updates into the multiplayer game finalization flow.
    - Added real-time ELO updates in the UI through Supabase profile subscriptions.
- **Advanced Performance Architecture**:
    - **Custom Caching**: Implemented a SWR-inspired caching layer (`hooks/useCache.ts`) to minimize database hits for history and leaderboard data.
    - **UI Optimization**: Applied React `memo` and `useCallback` strategically to eliminate redundant re-renders of the ChessBoard and analysis components.
    - **Resource Management**: Fixed memory leaks by ensuring robust cleanup of Supabase Realtime channels and Web Worker instances.
- **Real-time Analysis (EvalBar)**:
    - Added a vertical `EvalBar` component in `components/analysis/eval-bar.tsx`.
    - Integrated the local Stockfish worker to provide live numerical evaluation (centipawns/mate) during both AI play and post-game analysis.
- **PWA Implementation**:
    - Configured `manifest.json` and added high-resolution PWA icons for mobile "Add to Home Screen" support.
    - Updated `next.config.js` and `app/layout.tsx` for standalone app behavior and theme coloring.
- **Leaderboard & History**:
    - Built a dedicated Leaderboard page (`app/leaderboard/page.tsx`) with real-time ranking.
    - Refactored `HistoryPage` to handle complex error states and display formatted game results.
- **Stability**:
    - Fixed "piece jitter" during drag-and-drop by disabling conflicting CSS transitions on active pieces.
    - Standardized error handling across all Server Actions.
### [2026-05-01] UX Refinement and Board Logic
- **Interaction Model**:
    - Implemented **Click-to-move** support in the `ChessBoard` component, allowing users to move pieces by clicking source and target squares instead of just dragging.
    - Added **Visual Move Hints**: Valid destination squares are now highlighted with dots (empty squares) or rings (capture targets) when a piece is selected.
- **Board Refactoring**:
    - Decoupled board interaction logic from move execution by introducing a dedicated `Chess` instance for validation and visual state synchronization.
    - Fixed a critical race condition where rapid piece movement could cause the board to get stuck or desynchronize from the internal state.
- **Local Play Enhancements**:
    - Implemented **Automatic Board Rotation** in 1vs1 local mode. The board now automatically flips orientation based on the active player's turn to facilitate face-to-face play on a single device.
- **Board Theme Customization**:
    - Introduced a robust theme system for the `ChessBoard` component.
    - Added new high-quality themes: **Classic** (Staunton), **Warm Wood**, and **Metallic** (Steel).
    - Created `useProfile` hook to globally sync board preferences across AI, Local, Multiplayer, and Analysis modes.
- **Documentation**:
    - Finalized `README.md` with personal insights and updated technical stack details.
    - Synchronized `claude.md` with the latest architecture and feature milestones.

## What's Not Done Yet
- [x] Brain Fitness Tracker (Cognitive Endurance Analytics) logic. (Implemented basic move-time tracking)
- [ ] Web3 Tournament integration (placeholder in landing page).
- [ ] Actual payment integration (Pricing page is currently UI-only).
- [x] AI Coach feedback persistence/history view for pro users. (Fully implemented via analysis caching and history page)
- [x] Local board rotation for face-to-face play.

### [2026-05-02] Customization System & UI Stability
- **`useProfile` Refactoring**:
    - Implemented SSR-safe `localStorage` hydration using `useEffect` to prevent hydration mismatches.
    - Added comprehensive "Guest Mode" support, allowing non-authenticated users to persist board themes via local storage.
    - Integrated **Supabase Realtime** into the theme system; board changes now sync instantly across all open tabs/sessions for authenticated users.
- **`ChessBoard` Enhancements**:
    - Connected the component directly to `useProfile` to eliminate redundant prop drilling.
    - Implemented dynamic **CSS Variable Injection** (`--board-light`, `--board-dark`) into the document root, allowing for future-proof theme expansion.
- **Landing Page & Asset Stability**:
    - Fixed the missing `/grid.svg` background regression on the homepage.
    - Resolved the `max-wxl` Tailwind typo (`max-w-xl`) and verified layout responsiveness.
    - Applied global CSS overrides to exclude chessboard squares from general transitions, successfully eliminating "piece jitter" during move animations.
- **Cleanup**:
    - Standardized `BoardSettings` across AI, Local, and Multiplayer modes.
    - Added `updatePieceStyle` to the profile hook to prepare for upcoming piece set customization.

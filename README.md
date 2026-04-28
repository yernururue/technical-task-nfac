# ChessMind — Learn Chess with AI Coach

An interactive chess platform with AI-powered coaching, play-vs-AI mode, and real-time multiplayer.

## Features

- **Play vs AI** — local Stockfish engine (runs in browser via Web Worker, no server needed)
  - Three difficulty levels: Easy / Medium / Hard
- **Play Local** — two players on the same board
- **Multiplayer** — share a link and play in real-time via Supabase Broadcast
- **AI Coach** — post-game analysis powered by Gemini 2.5 Flash / OpenRouter fallback
- **Auth** — email + Google OAuth via Supabase

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Chess Logic | chess.js + react-chessboard |
| Chess Engine | Stockfish 11 asm.js (Web Worker, single-threaded) |
| Database | Supabase Postgres |
| Auth | Supabase Auth |
| Realtime | Supabase Broadcast |
| AI Analysis | Gemini 2.5 Flash / OpenRouter Llama 3.3 70B |

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
git clone <repo-url>
cd technical-task-nfac
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```bash
cp .env.example .env.local
```

Required keys:
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key
- `GEMINI_API_KEY` — Google AI Studio key (server-only)
- `OPENROUTER_API_KEY` — OpenRouter key (server-only, fallback)

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
├── page.tsx              # Landing page
├── play/
│   ├── ai/page.tsx       # Play vs Stockfish AI
│   └── local/page.tsx    # Local two-player
├── auth/                 # Login / signup pages
├── api/                  # Server-only API routes
│   ├── analyze/          # AI coach analysis
│   └── room/             # Multiplayer rooms
├── analysis/             # Game analysis view
├── history/              # Game history
└── room/                 # Multiplayer game room

components/
├── board/                # ChessBoard, MoveHistory, GameControls
└── ui/                   # shadcn/ui components

hooks/
├── useStockfish.ts       # Stockfish Web Worker (UCI protocol)
├── useChessGame.ts       # Game state management (local + AI)
└── useMultiplayer.ts     # Multiplayer hook

lib/
├── ai/                   # AI provider config + coach prompts
├── chess/                # PGN utilities
└── supabase/             # Supabase clients (browser + server)

public/
└── stockfish.js          # Stockfish 11 asm.js engine
```

## AI Engine Details

The chess AI uses **Stockfish 11** compiled to asm.js by [nmrugg/stockfish.js](https://github.com/nmrugg/stockfish.js). It runs entirely in the browser as a Web Worker — no server, no external API, no WASM, no SharedArrayBuffer required.

| Difficulty | Stockfish Depth |
|-----------|----------------|
| Easy | 8 |
| Medium | 12 |
| Hard | 18 |

## License

MIT
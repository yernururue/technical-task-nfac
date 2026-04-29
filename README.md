# ChessMind — Learn Chess with AI Coach

An interactive chess platform with AI-powered coaching, play-vs-AI mode, and real-time multiplayer.

## Features

- **Play vs AI** — local Stockfish engine (runs in browser via Web Worker, no server needed)
  - Three difficulty levels: Easy / Medium / Hard
- **Play Local** — two players on the same board
- **Multiplayer** — share a link and play in real-time via Supabase Broadcast
- **AI Coach** — post-game analysis powered by Gemini 2.5 Flash / OpenRouter fallback
- **Auth** — email + Google OAuth via Supabase
- **Profile Management** — track ELO, stats, and personalize board/piece themes
- **Avatar System** — upload and sync user avatars via Supabase Storage
- **Pricing Section** — professional two-column landing page section for monetization demo
- **Premium UI/UX** — startup-grade aesthetics with live status indicators, glassmorphism, and smooth animations
- **AI-Powered Analysis** — Magnus Carlsen level insights dissected by LLMs

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
├── room/                 # Multiplayer game room
└── profile/              # User profile and settings

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

---

## Personal Insight from Ernur

Я Ернур, студент Astana IT University, и этот проект — результат моего 12-часового марафона кодинга.

Я не хотел делать «просто очередные шахматы». Моя идея была в том, чтобы создать ChessMind — платформу, где технологии реально помогают тебе играть лучше, а не просто висят для красоты.

Почему это было сложно и круто делать:

- **Движок в браузере**: Я заморочился и засунул Stockfish 11 прямо в Web Workers. Это значит, что он считает ходы на твоем компе, а не на сервере. Ноль лагов, и можно играть хоть в самолете без интернета.
- **ИИ-Тренер**: Я настроил связку с Gemini 2.5 Flash, чтобы он не просто кидался цифрами, а объяснял ошибки человеческим языком. Это как будто рядом сидит сильный игрок и подсказывает.
- **Никакой бюрократии**: Я сделал так, чтобы в мультиплеер можно было залететь по одной ссылке. Другу не нужно регаться или подтверждать почту — просто скинул ссылку и играете.
- **Перформанс**: Я выжал максимум из React (memoization, custom caching), чтобы всё летало на 60 FPS, и упаковал это в PWA. Теперь сайт можно установить на телефон как полноценное приложение.

Для меня ChessMind — это не просто курсовой проект или задание. Это был вызов самому себе: смогу ли я за ночь собрать продукт уровня полноценного стартапа, где всё — от авторизации и базы данных до вебсокетов и ИИ — работает как единый механизм.

Надеюсь, вам зайдет результат так же сильно, как мне зашло это кодить!
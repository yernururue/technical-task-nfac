# ChessMind — Product & Dev Plan v2

## 1. Обзор продукта

**Что это:** Шахматная платформа с AI-коучем на русском, игрой против движка и мультиплеером по ссылке.

**Чем отличается:**
- AI-разбор партии на русском — бесплатно, не за paywall
- Игра по ссылке без регистрации второго игрока
- Фокус: "понять почему проиграл", а не просто рейтинг

**Аудитория:** Русскоязычные любители, которые хотят учиться.

---

## 2. Стек и почему

| Слой | Технология | Почему |
|------|-----------|--------|
| Frontend | Next.js 14 (App Router) | SSR + serverless API в одном репо |
| Шахматная логика | chess.js | Стандарт, валидация + PGN из коробки |
| Доска | react-chessboard | Лучший React-компонент доски |
| AI движок | Lichess API (Cloud Eval) | Бесплатно, лучшие ходы, нужен интернет |
| AI коуч (primary) | Gemini 2.5 Flash (Google AI Studio) | **Бесплатно**: 1500 req/day, без кредитки |
| AI коуч (fallback) | OpenRouter (Llama 3.3 70B) | **Бесплатно**: ~200 req/day, без кредитки |
| БД + Auth + Realtime | Supabase | Бесплатный tier, всё в одном |
| Деплой | Vercel | Один push = деплой фронта + API |

**Формат хранения партии:** PGN — это и есть текст ходов (`1. e4 e5 2. Nf3 Nc6...`). chess.js генерирует через `game.pgn()`. Идеально для AI анализа, никаких преобразований.

---

## 3. Архитектура

```
┌─────────────────────────────────────────────────────┐
│                    Vercel                           │
│                                                     │
│  FRONTEND (React)          BACKEND (Serverless)     │
│  ─────────────────         ────────────────────     │
│  /              Landing    /api/analyze   route.ts  │
│  /play          Выбор      /api/room      route.ts  │
│  /play/ai       vs AI                               │
│  /play/local    2 игрока                            │
│  /room/[id]     Мультиплеер                         │
│  /history       История                             │
│  /analysis/[id] AI разбор                           │
└──────────────┬──────────────────────┬───────────────┘
               │                      │
      ┌────────▼──────┐      ┌────────▼────────────┐
      │   Supabase    │      │   AI APIs (free)    │
      │               │      │                     │
      │  Auth         │      │  Primary:           │
      │  Postgres     │      │  Gemini 2.5 Flash   │
      │  Realtime ────┼──────┼─ (1500 req/day)     │
      │  (мультиплеер)│      │                     │
      └───────────────┘      │  Fallback:          │
                             │  OpenRouter         │
                             │  (Llama 3.3 70B)    │
                             └─────────────────────┘

Stockfish WASM — только в браузере, Web Worker, серверу не нужен
```

**Как работает "бэкенд" без отдельного сервера:**
```
Фронт: fetch('/api/analyze', { body: pgn })
         ↓
Next.js serverless function (app/api/analyze/route.ts)
  - здесь живёт GEMINI_API_KEY (серверная сторона, не утекает)
  - вызывает Gemini/OpenRouter API
  - возвращает JSON анализ
         ↓
Фронт получает и рендерит
```
Vercel деплоит `app/api/**` как Lambda автоматически. Никакого FastAPI, никакого отдельного сервера.

**Мультиплеер:**
```
Player A  ──── Supabase Broadcast("room:xK3mN8pQ") ────►  Player B
Player A  ◄─── Supabase Broadcast("room:xK3mN8pQ") ────   Player B
```

---

## 4. Структура проекта

```
chessmind/
├── app/
│   ├── page.tsx                    # Landing
│   ├── play/
│   │   ├── page.tsx                # Выбор режима
│   │   ├── ai/page.tsx             # vs Stockfish
│   │   └── local/page.tsx          # 2 игрока, 1 экран
│   ├── room/[id]/page.tsx          # Мультиплеер по ссылке
│   ├── history/page.tsx            # История партий
│   ├── analysis/[id]/page.tsx      # AI-разбор
│   ├── auth/page.tsx               # Login / Register
│   └── api/                        # ← БЭКЕНД (serverless)
│       ├── analyze/route.ts        # POST: pgn → AI анализ
│       └── room/route.ts           # POST: создать комнату
│
├── components/
│   ├── board/
│   │   ├── ChessBoard.tsx          # Обёртка react-chessboard
│   │   ├── MoveHistory.tsx         # Список ходов
│   │   └── GameControls.tsx        # Resign, Draw, New Game
│   ├── analysis/
│   │   ├── CoachPanel.tsx          # AI комментарии
│   │   └── MoveAnnotation.tsx      # Один ход + оценка + текст
│   └── ui/                         # shadcn/ui компоненты
│
├── lib/
│   ├── chess/
│   │   ├── stockfish.ts            # Web Worker wrapper
│   │   └── pgn-utils.ts            # PGN helpers
│   ├── supabase/
│   │   ├── client.ts               # браузерный клиент
│   │   ├── server.ts               # серверный клиент
│   │   └── realtime.ts             # broadcast helpers
│   └── ai/
│       ├── coach.ts                # промпт + парсинг ответа
│       └── provider.ts             # Gemini → OpenRouter fallback
│
├── hooks/
│   ├── useChessGame.ts             # игровая логика + состояние
│   ├── useStockfish.ts             # движок хуки
│   └── useMultiplayer.ts           # Supabase Realtime хуки
│
├── public/
│   └── stockfish.js                # WASM файл (~4MB)
│
└── supabase/
    └── migrations/
        ├── 001_initial_schema.sql
        └── 002_add_indexes.sql
```

---

## 5. Модель данных (масштабируемая)

**Главное правило:** никогда не удаляй колонки — только добавляй. Все изменения через `supabase migration new`. Тогда не будет ситуации "сломал всё при 10-й правке".

```sql
-- ─────────────────────────────────────────────
-- 001_initial_schema.sql
-- ─────────────────────────────────────────────

-- Профили (расширяет Supabase auth.users)
CREATE TABLE profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username      TEXT UNIQUE NOT NULL,
  avatar_url    TEXT,
  rating        INT NOT NULL DEFAULT 1200,
  games_played  INT NOT NULL DEFAULT 0,
  wins          INT NOT NULL DEFAULT 0,
  losses        INT NOT NULL DEFAULT 0,
  draws         INT NOT NULL DEFAULT 0,
  -- запас для будущих фич (лидерборд, локации):
  country       TEXT,
  city          TEXT,
  is_pro        BOOLEAN NOT NULL DEFAULT false,
  preferences   JSONB NOT NULL DEFAULT '{}',   -- theme, board_style, etc.
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Партии
CREATE TABLE games (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  white_id        UUID REFERENCES profiles(id),   -- null = гость
  black_id        UUID REFERENCES profiles(id),   -- null = гость / AI
  white_username  TEXT NOT NULL,                  -- snapshot имени, не JOIN
  black_username  TEXT NOT NULL,
  pgn             TEXT NOT NULL,                  -- "1. e4 e5 2. Nf3..."
  result          TEXT CHECK (result IN ('white','black','draw','abandoned','in_progress')),
  mode            TEXT NOT NULL CHECK (mode IN ('local','ai','multiplayer')),
  ai_level        INT CHECK (ai_level BETWEEN 1 AND 3),
  room_id         TEXT,
  total_moves     INT NOT NULL DEFAULT 0,
  duration_seconds INT,
  -- запас:
  time_control    TEXT,                           -- '5+0', '10+5'
  opening_name    TEXT,
  metadata        JSONB NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at     TIMESTAMPTZ
);

-- AI анализы
CREATE TABLE analyses (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id     UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  -- [{move_number, color, pgn_move, mistake_type, comment, better_move}]
  moves       JSONB NOT NULL DEFAULT '[]',
  summary     TEXT,
  accuracy    JSONB,                              -- {white: 82, black: 74}
  model_used  TEXT,                               -- 'gemini-2.5-flash'
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Мультиплеер комнаты
CREATE TABLE rooms (
  id          TEXT PRIMARY KEY,                   -- nanoid 8 chars
  host_id     UUID REFERENCES profiles(id),
  guest_id    UUID REFERENCES profiles(id),
  game_id     UUID REFERENCES games(id),
  status      TEXT NOT NULL DEFAULT 'waiting'
                CHECK (status IN ('waiting','active','finished','abandoned')),
  host_color  TEXT NOT NULL DEFAULT 'white'
                CHECK (host_color IN ('white','black')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at  TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '24 hours')
);

-- ─────────────────────────────────────────────
-- Индексы
-- ─────────────────────────────────────────────
CREATE INDEX idx_games_white_id   ON games(white_id);
CREATE INDEX idx_games_black_id   ON games(black_id);
CREATE INDEX idx_games_created_at ON games(created_at DESC);
CREATE INDEX idx_analyses_game_id ON analyses(game_id);
CREATE INDEX idx_rooms_status     ON rooms(status);

-- ─────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────
ALTER TABLE profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE games     ENABLE ROW LEVEL SECURITY;
ALTER TABLE analyses  ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms     ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_read_all"  ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_write_own" ON profiles FOR ALL    USING (auth.uid() = id);

CREATE POLICY "games_read_own"    ON games FOR SELECT
  USING (auth.uid() = white_id OR auth.uid() = black_id);
CREATE POLICY "games_insert_auth" ON games FOR INSERT
  WITH CHECK (auth.uid() = white_id OR auth.uid() = black_id);
CREATE POLICY "games_update_own"  ON games FOR UPDATE
  USING (auth.uid() = white_id OR auth.uid() = black_id);

CREATE POLICY "analyses_read_own"    ON analyses FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM games g WHERE g.id = game_id
    AND (g.white_id = auth.uid() OR g.black_id = auth.uid())
  ));
CREATE POLICY "analyses_insert_auth" ON analyses FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "rooms_read_all"           ON rooms FOR SELECT USING (true);
CREATE POLICY "rooms_insert_auth"        ON rooms FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "rooms_update_participants" ON rooms FOR UPDATE
  USING (auth.uid() = host_id OR guest_id IS NULL);
```

**Как добавлять фичи без боли:**
- Новый тип статистики → добавь колонку в `profiles`
- Лидерборд → `SELECT ... ORDER BY rating` уже работает (city/country есть)
- Монетизация → `is_pro = true` уже в схеме
- Новые настройки → пиши в `preferences JSONB`, не создавай колонки

---

## 6. AI Coach — реализация

**`lib/ai/provider.ts` — автоматический fallback:**
```typescript
const providers = [
  {
    url: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
    model: 'gemini-2.5-flash-preview-04-17',
    key: process.env.GEMINI_API_KEY,
  },
  {
    url: 'https://openrouter.ai/api/v1/chat/completions',
    model: 'meta-llama/llama-3.3-70b-instruct:free',
    key: process.env.OPENROUTER_API_KEY,
  },
]

export async function callAI(prompt: string): Promise<string> {
  for (const p of providers) {
    try {
      const res = await fetch(p.url, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${p.key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: p.model, messages: [{ role: 'user', content: prompt }], max_tokens: 1000 }),
      })
      if (res.ok) return (await res.json()).choices[0].message.content
    } catch { continue }
  }
  throw new Error('All AI providers failed')
}
```

**`lib/ai/coach.ts` — промпт:**
```typescript
export function buildCoachPrompt(pgn: string): string {
  return `Ты шахматный тренер. Проанализируй партию, найди 3-5 ключевых ошибок.
PGN: ${pgn}

Ответь ТОЛЬКО валидным JSON без markdown:
{
  "summary": "2-3 предложения об общем качестве игры на русском",
  "accuracy": { "white": 75, "black": 68 },
  "mistakes": [
    {
      "move_number": 15,
      "color": "white",
      "pgn_move": "Nd2",
      "mistake_type": "blunder",
      "comment": "Конь уходит, теряется контроль центра",
      "better_move": "Ne5"
    }
  ]
}`
}
```

---

## 7. Env Variables

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Только server-side (app/api/ routes — не утекают в браузер):
SUPABASE_SERVICE_ROLE_KEY=eyJ...
GEMINI_API_KEY=AIza...        # aistudio.google.com/app/apikey — email, без карты
OPENROUTER_API_KEY=sk-or-...  # openrouter.ai/keys — email, без карты
```

---

## 8. Roadmap

### Day 1 — Фундамент (цель: рабочая игра vs AI на Vercel)
```
□ npx create-next-app@latest + shadcn init
□ Supabase: создать проект, применить миграцию, включить Google OAuth
□ npm i chess.js react-chessboard @supabase/supabase-js @supabase/ssr nanoid
□ ChessBoard.tsx + chess.js: игра с валидацией ходов
□ Stockfish Web Worker: 3 уровня (depth 5 / 10 / 18)
□ /play/ai — работает игра против движка
□ Auth middleware + /auth страница
□ Деплой на Vercel (env vars через dashboard)
□ ПРОВЕРИТЬ на телефоне
```

### Day 2 — Persistence (цель: история партий работает)
```
□ Сохранение партии в games после game over
□ /history — список партий
□ /play/local — игра 2 игроков на одном экране
□ Тёмная/светлая тема (shadcn ThemeProvider — 20 мин)
□ Деплой + проверка
```

### Day 3 — Killer фичи (цель: AI Coach + мультиплеер)
```
□ /api/analyze/route.ts + lib/ai/provider.ts + lib/ai/coach.ts
□ CoachPanel.tsx — рендер анализа рядом с историей ходов
□ /analysis/[id] — страница разбора
□ Мультиплеер:
  □ /api/room/route.ts — создать комнату (nanoid ID)
  □ lib/supabase/realtime.ts — broadcast helpers
  □ useMultiplayer.ts — sub/pub ходов
  □ /room/[id] — ожидание + игра + гостевой режим
□ Тест в двух вкладках браузера
□ Деплой
```

### Day 4 — Polish (цель: готово к сдаче)
```
□ Landing page: что это, 3 фичи, 2 CTA
□ Error states: AI недоступен, соединение потеряно
□ Loading skeletons
□ "Upgrade to Pro" кнопка-заглушка
□ README.md с описанием, стеком, ссылками
□ Smoke test: регистрация → игра → анализ → мультиплеер
□ Финальный деплой
```

---

## 9. Риски и упрощения

**Проблема: AI вернул не-JSON**
Всегда `try/catch` при парсинге. Если упало — "Анализ временно недоступен".

**Проблема: Stockfish грузится 3-5 сек**
Lazy load + spinner "Загружаем движок...". UI не блокируется.

**Проблема: Realtime теряет соединение**
Не делать reconnect в MVP. Баннер "Соединение потеряно — обновите страницу".

**Если не успеваешь — режь в этом порядке:**
1. ~~Мультиплеер~~ → только local + vs AI
2. ~~Полная история~~ → последние 10 партий
3. ~~Профиль~~ → только email в navbar
4. ~~Landing~~ → редирект с `/` на `/play`

**Не делать:**
- Своя Elo система — слишком сложно
- Кастомные анимации — react-chessboard делает сам
- Reconnect для мультиплеера — MVP обходится без него

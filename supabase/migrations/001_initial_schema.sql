-- 001_initial_schema.sql
-- Run in Supabase Dashboard > SQL Editor

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username      TEXT UNIQUE NOT NULL,
  avatar_url    TEXT,
  rating        INT NOT NULL DEFAULT 1200,
  games_played  INT NOT NULL DEFAULT 0,
  wins          INT NOT NULL DEFAULT 0,
  losses        INT NOT NULL DEFAULT 0,
  draws         INT NOT NULL DEFAULT 0,
  country       TEXT,
  city          TEXT,
  is_pro        BOOLEAN NOT NULL DEFAULT false,
  preferences   JSONB NOT NULL DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Games table
CREATE TABLE games (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  white_id         UUID REFERENCES profiles(id),
  black_id         UUID REFERENCES profiles(id),
  white_username   TEXT NOT NULL,
  black_username   TEXT NOT NULL,
  pgn              TEXT NOT NULL DEFAULT '',
  result           TEXT CHECK (result IN ('white','black','draw','abandoned','in_progress')),
  mode             TEXT NOT NULL CHECK (mode IN ('local','ai','multiplayer')),
  ai_level         INT CHECK (ai_level BETWEEN 1 AND 3),
  room_id          TEXT,
  total_moves      INT NOT NULL DEFAULT 0,
  duration_seconds INT,
  time_control     TEXT,
  opening_name     TEXT,
  metadata         JSONB NOT NULL DEFAULT '{}',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at      TIMESTAMPTZ
);

-- Analyses table
CREATE TABLE analyses (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id     UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  moves       JSONB NOT NULL DEFAULT '[]',
  summary     TEXT,
  accuracy    JSONB DEFAULT '{"white": 0, "black": 0}',
  model_used  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Rooms table (multiplayer)
CREATE TABLE rooms (
  id          TEXT PRIMARY KEY,
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

-- Indexes
CREATE INDEX idx_games_white_id    ON games(white_id);
CREATE INDEX idx_games_black_id    ON games(black_id);
CREATE INDEX idx_games_created_at  ON games(created_at DESC);
CREATE INDEX idx_games_mode        ON games(mode);
CREATE INDEX idx_analyses_game_id  ON analyses(game_id);
CREATE INDEX idx_rooms_status      ON rooms(status);
CREATE INDEX idx_rooms_expires_at  ON rooms(expires_at);
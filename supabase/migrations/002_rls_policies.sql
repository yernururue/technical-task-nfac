-- 002_rls_policies.sql

-- Enable RLS
ALTER TABLE profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE games     ENABLE ROW LEVEL SECURITY;
ALTER TABLE analyses  ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms     ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "profiles_select_all"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "profiles_insert_own"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Games
CREATE POLICY "games_select_own"
  ON games FOR SELECT
  USING (auth.uid() = white_id OR auth.uid() = black_id);

CREATE POLICY "games_insert_auth"
  ON games FOR INSERT
  WITH CHECK (auth.uid() = white_id OR auth.uid() = black_id);

CREATE POLICY "games_update_own"
  ON games FOR UPDATE
  USING (auth.uid() = white_id OR auth.uid() = black_id);

-- Analyses
CREATE POLICY "analyses_select_own"
  ON analyses FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM games g
    WHERE g.id = game_id
    AND (g.white_id = auth.uid() OR g.black_id = auth.uid())
  ));

CREATE POLICY "analyses_insert_auth"
  ON analyses FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Rooms
CREATE POLICY "rooms_select_all"
  ON rooms FOR SELECT USING (true);

CREATE POLICY "rooms_insert_auth"
  ON rooms FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "rooms_update_participants"
  ON rooms FOR UPDATE
  USING (auth.uid() = host_id OR guest_id IS NULL);
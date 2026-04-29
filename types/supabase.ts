// Supabase database table typing used by typed clients.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type GameModeDb = 'local' | 'ai' | 'multiplayer'
export type GameResultDb = 'white' | 'black' | 'draw' | 'abandoned' | 'in_progress'
export type RoomStatusDb = 'waiting' | 'active' | 'finished'

export interface ProfileRow {
  id: string
  username: string
  avatar_url: string | null
  rating: number
  games_played: number
  wins: number
  losses: number
  draws: number
  country: string | null
  city: string | null
  is_pro: boolean
  preferences: Json | null
  created_at: string
  updated_at: string
}

export interface GameRow {
  id: string
  white_id: string | null
  black_id: string | null
  white_username: string
  black_username: string
  pgn: string
  result: GameResultDb | null
  mode: GameModeDb
  ai_level: number | null
  room_id: string | null
  total_moves: number
  duration_seconds: number | null
  time_control: string | null
  opening_name: string | null
  metadata: Json | null
  created_at: string
  finished_at: string | null
}

export interface AnalysisRow {
  id: string
  game_id: string
  moves: Json
  summary: string | null
  accuracy: Json | null
  model_used: string | null
  created_at: string
}

export interface RoomRow {
  id: string
  host_id: string | null
  guest_id: string | null
  game_id: string | null
  status: RoomStatusDb
  host_color: string
  created_at: string
  expires_at: string
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow
        Insert: Omit<ProfileRow, 'created_at' | 'updated_at'>
        Update: Partial<Omit<ProfileRow, 'id' | 'created_at' | 'updated_at'>>
      }
      games: {
        Row: GameRow
        Insert: Omit<GameRow, 'id' | 'created_at'>
        Update: Partial<Omit<GameRow, 'id' | 'created_at'>>
      }
      analyses: {
        Row: AnalysisRow
        Insert: Omit<AnalysisRow, 'id' | 'created_at'>
        Update: Partial<Omit<AnalysisRow, 'id' | 'created_at'>>
      }
      rooms: {
        Row: RoomRow
        Insert: Omit<RoomRow, 'created_at' | 'expires_at'>
        Update: Partial<Omit<RoomRow, 'id' | 'created_at' | 'expires_at'>>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

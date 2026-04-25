// Supabase database table typing used by typed clients.
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type GameModeDb = 'local' | 'ai' | 'multiplayer'
export type GameResultDb = 'white' | 'black' | 'draw' | 'abandoned' | 'in_progress'
export type RoomStatusDb = 'waiting' | 'active' | 'finished'

export interface ProfileRow {
  id: string
  username: string
  rating: number
  preferences: Json | null
  created_at: string
  updated_at: string
}

export interface GameRow {
  id: string
  white_player_id: string | null
  black_player_id: string | null
  pgn: string
  mode: GameModeDb
  result: GameResultDb | null
  metadata: Json | null
  created_at: string
  updated_at: string
}

export interface AnalysisRow {
  id: string
  game_id: string
  summary: string
  accuracy_white: number
  accuracy_black: number
  mistakes: Json
  created_at: string
  updated_at: string
}

export interface RoomRow {
  id: string
  host_id: string | null
  guest_id: string | null
  status: RoomStatusDb
  fen: string
  pgn: string
  created_at: string
  updated_at: string
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
        Insert: Omit<GameRow, 'created_at' | 'updated_at'>
        Update: Partial<Omit<GameRow, 'id' | 'created_at' | 'updated_at'>>
      }
      analyses: {
        Row: AnalysisRow
        Insert: Omit<AnalysisRow, 'created_at' | 'updated_at'>
        Update: Partial<Omit<AnalysisRow, 'id' | 'created_at' | 'updated_at'>>
      }
      rooms: {
        Row: RoomRow
        Insert: Omit<RoomRow, 'created_at' | 'updated_at'>
        Update: Partial<Omit<RoomRow, 'id' | 'created_at' | 'updated_at'>>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

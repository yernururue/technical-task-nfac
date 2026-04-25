// Domain-friendly types projected from Supabase tables.
import type {
  AnalysisRow,
  Database,
  GameRow,
  ProfileRow,
  RoomRow,
} from '@/types/supabase'

export type JsonValue = Database['public']['Tables']['profiles']['Row']['preferences']

export type Profile = ProfileRow
export type Game = GameRow
export type Analysis = AnalysisRow
export type Room = RoomRow

// AI analysis and move feedback types shared across coach features.
import type { PieceColor } from '@/types/game'

export type MistakeType = 'blunder' | 'mistake' | 'inaccuracy' | 'good' | 'brilliant'

export interface MoveFeedback {
  move_number: number
  color: PieceColor
  pgn_move: string
  mistake_type: MistakeType
  comment: string
  better_move: string | null
}

export interface CoachResponse {
  summary: string
  accuracy: { white: number; black: number }
  mistakes: MoveFeedback[]
}

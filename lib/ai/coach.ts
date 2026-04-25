// Chess coach prompt and response parser placeholders for AI analysis endpoints.
import type { CoachResponse } from '@/types/analysis'

export function buildCoachPrompt(pgn: string): string {
  return `Analyze this PGN: ${pgn}`
}

export function parseCoachResponse(raw: string): CoachResponse {
  return {
    summary: raw,
    accuracy: { white: 0, black: 0 },
    mistakes: [],
  }
}

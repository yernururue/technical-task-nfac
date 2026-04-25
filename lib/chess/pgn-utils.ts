import { Chess } from 'chess.js'

// Helper functions for PGN operations.
export function generatePGNString(game: Chess): string {
  // TODO(day-2): customize PGN metadata/export formatting if needed.
  return game.pgn()
}

export function isPGNValid(pgn: string): boolean {
  // TODO(day-2): add stricter validation rules if product requires them.
  void pgn
  return false
}

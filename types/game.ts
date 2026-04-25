/**
 * Supported game modes.
 */
export type GameMode = 'local' | 'ai' | 'multiplayer'

/**
 * Supported game lifecycle statuses.
 */
export type GameStatus = 'idle' | 'active' | 'finished'

/**
 * Supported game results.
 */
export type GameResult = 'white' | 'black' | 'draw' | 'abandoned' | 'in_progress'

/**
 * Chess piece side.
 */
export type PieceColor = 'white' | 'black'

/**
 * Minimal player representation in a game session.
 */
export interface Player {
  /** User id, nullable for anonymous/local players. */
  id: string | null
  /** Displayed username in UI. */
  username: string
  /** Side currently assigned to player. */
  color: PieceColor
  /** Optional ELO or platform rating. */
  rating?: number
  /** Whether this seat is controlled by AI. */
  isAi?: boolean
}

/**
 * Side-based player map.
 */
export interface GamePlayers {
  /** White side player data. */
  white: Player
  /** Black side player data. */
  black: Player
}

/**
 * Metadata for a move in history.
 */
export interface GameMove {
  /** UCI move notation, e.g. "e2e4". */
  uci: string
  /** SAN move notation, e.g. "Nf3". */
  san: string
  /** Position FEN after the move is applied. */
  fen: string
  /** Side that played the move. */
  color: PieceColor
  /** Full move number in PGN terms. */
  moveNumber: number
  /** Epoch timestamp in milliseconds. */
  timestamp: number
}

/**
 * Core game state returned by `useChessGame`.
 */
export interface GameState {
  /** Persisted game id when available. */
  id: string | null
  /** Current game mode. */
  mode: GameMode
  /** Current game status. */
  status: GameStatus
  /** Current PGN string representation. */
  pgn: string
  /** Current FEN position. */
  fen: string
  /** Final game result, if finished. */
  result: GameResult | null
  /** Current players by side. */
  players: GamePlayers
  /** Side to move. */
  currentTurn: PieceColor
  /** Current move history. */
  moves: GameMove[]
  /** Whether current side is in check. */
  isCheck: boolean
  /** Whether current position is checkmate. */
  isCheckmate: boolean
  /** Whether current position is stalemate. */
  isStalemate: boolean
  /** Whether draw conditions currently apply. */
  isDraw: boolean
  /** Number of plies played. */
  moveCount: number
  /** Session creation date. */
  startedAt: Date
  /** Session update date. */
  updatedAt: Date
}

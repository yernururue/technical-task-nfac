'use client'

import { Chess, type Move } from 'chess.js'
import { useCallback, useEffect, useRef, useState } from 'react'

import { useStockfish } from '@/hooks/useStockfish'
import type { GameResult, GameState } from '@/types/game'

export type ChessLevel = 1 | 2 | 3

type PromotionPiece = 'q' | 'r' | 'b' | 'n'

interface MoveResult {
  success: boolean
  newState: GameState | null
  error: string | null
}

interface GameOverState {
  isOver: boolean
  reason: 'checkmate' | 'stalemate' | 'threefold_repetition' | 'insufficient_material' | 'fifty_moves' | 'draw' | null
}

interface UseChessGameResult {
  game: Chess
  gameHistory: string[]
  gameState: GameState
  makeMove: (fromSquare: string, toSquare: string, promotion?: PromotionPiece) => MoveResult
  makeAIMove: () => Promise<boolean>
  getPossibleMoves: (square?: string) => Move[]
  getCurrentFen: () => string
  resetGame: () => void
  undoMove: () => MoveResult
  getPGN: () => string
  isGameOver: () => GameOverState
  resignGame: (color: 'white' | 'black') => void
  isEngineLoading: boolean
  aiLevel: ChessLevel
  setAiLevel: (level: ChessLevel) => void
}

function createInitialGameState(mode: 'local' | 'ai' = 'local'): GameState {
  const chess = new Chess()
  const now = new Date()

  return {
    id: null,
    mode,
    status: 'idle',
    pgn: chess.pgn(),
    fen: chess.fen(),
    result: null,
    players: {
      white: { id: null, username: 'White', color: 'white' },
      black: { id: null, username: 'Black', color: 'black' },
    },
    currentTurn: 'white',
    moves: [],
    isCheck: false,
    isCheckmate: false,
    isStalemate: false,
    isDraw: false,
    moveCount: 0,
    startedAt: now,
    updatedAt: now,
  }
}

function deriveResult(game: Chess): GameResult | null {
  if (!game.isGameOver()) {
    return null
  }

  if (game.isCheckmate()) {
    return game.turn() === 'w' ? 'black' : 'white'
  }

  return 'draw'
}

function getMoveColor(move: Move): 'white' | 'black' {
  return move.color === 'w' ? 'white' : 'black'
}

function cloneGame(source: Chess): Chess {
  const clone = new Chess()
  const pgn = source.pgn()
  if (pgn.trim().length > 0) {
    clone.loadPgn(pgn)
  }
  return clone
}

function buildGameState(game: Chess, mode: 'local' | 'ai', previousState: GameState): GameState {
  const now = new Date()
  const history = game.history({ verbose: true })
  const replay = new Chess()
  const moves = history.map((move, index) => {
    replay.move({ from: move.from, to: move.to, promotion: move.promotion })
    return {
      uci: `${move.from}${move.to}${move.promotion ?? ''}`,
      san: move.san,
      fen: replay.fen(),
      color: getMoveColor(move),
      moveNumber: Math.floor(index / 2) + 1,
      timestamp: now.getTime(),
    }
  })

  return {
    ...previousState,
    mode,
    status: game.isGameOver() ? 'finished' : history.length > 0 ? 'active' : 'idle',
    pgn: game.pgn(),
    fen: game.fen(),
    currentTurn: game.turn() === 'w' ? 'white' : 'black',
    moves,
    isCheck: game.isCheck(),
    isCheckmate: game.isCheckmate(),
    isStalemate: game.isStalemate(),
    isDraw: game.isDraw(),
    moveCount: history.length,
    result: deriveResult(game),
    updatedAt: now,
  }
}

export function useChessGame(mode: 'local' | 'ai' = 'local', aiLevel: ChessLevel = 2): UseChessGameResult {
  const [currentAiLevel, setCurrentAiLevel] = useState<ChessLevel>(aiLevel)
  const { getBestMove, isReady: isEngineReady, error: engineError } = useStockfish(mode === 'ai')
  const isEngineLoading = mode === 'ai' && !isEngineReady
  const [game, setGame] = useState<Chess>(() => new Chess())
  const gameRef = useRef<Chess>(game)
  const [gameHistory, setGameHistory] = useState<string[]>([])
  const [gameState, setGameState] = useState<GameState>(() => createInitialGameState(mode))

  // Keep ref in sync so async callbacks always see the latest game
  useEffect(() => {
    gameRef.current = game
  }, [game])

  useEffect(() => {
    setCurrentAiLevel(aiLevel)
  }, [aiLevel])

  const syncState = useCallback(
    (nextGame: Chess) => {
      setGame(nextGame)
      setGameHistory(nextGame.history())
      setGameState((previous) => buildGameState(nextGame, mode, previous))
    },
    [mode],
  )

  const makeMove = useCallback(
    (fromSquare: string, toSquare: string, promotion: PromotionPiece = 'q'): MoveResult => {
      try {
        const nextGame = cloneGame(game)
        const move = nextGame.move({ from: fromSquare, to: toSquare, promotion })
        if (!move) {
          return {
            success: false,
            newState: null,
            error: `Illegal move: ${fromSquare} -> ${toSquare}`,
          }
        }

        syncState(nextGame)
        const newState = buildGameState(nextGame, mode, gameState)
        return { success: true, newState, error: null }
      } catch (error) {
        return {
          success: false,
          newState: null,
          error: error instanceof Error ? error.message : 'Unexpected move validation error',
        }
      }
    },
    [game, gameState, mode, syncState],
  )

  const getPossibleMoves = useCallback(
    (square?: string): Move[] => {
      try {
        const options = square ? { square, verbose: true as const } : { verbose: true as const }
        return game.moves(options)
      } catch {
        return []
      }
    },
    [game],
  )

  const getCurrentFen = useCallback((): string => game.fen(), [game])

  const makeAIMove = useCallback(async (): Promise<boolean> => {
    const currentGame = gameRef.current
    if (!currentGame || mode !== 'ai') return false

    try {
      const fen = currentGame.fen()
      // Map level to Stockfish search depth
      const depthMap: Record<ChessLevel, number> = { 1: 8, 2: 12, 3: 18 }
      const depth = depthMap[currentAiLevel] ?? 12

      console.log('[makeAIMove] Requesting move for FEN:', fen, 'depth:', depth)
      const uciMove = await getBestMove(fen, depth)

      if (!uciMove) {
        console.warn('[Chess] No AI move returned')
        return false
      }

      // UCI format: e2e4 or e7e8q (with promotion)
      const from = uciMove.substring(0, 2)
      const to = uciMove.substring(2, 4)
      const promotion = uciMove.length > 4 ? (uciMove[4] as PromotionPiece) : undefined

      console.log(`[Chess] AI move: ${from} → ${to}${promotion ? ` (=${promotion})` : ''}`)

      // Apply AI move to the LATEST game state via ref
      const latestGame = gameRef.current
      const nextGame = cloneGame(latestGame)
      const move = nextGame.move({ from, to, promotion })
      if (!move) {
        console.error('[Chess] AI move rejected by chess.js:', from, to)
        return false
      }
      syncState(nextGame)
      return true
    } catch (err) {
      console.error('[Chess] AI move error:', err)
      return false
    }
  }, [currentAiLevel, getBestMove, mode, syncState])

  const resetGame = useCallback((): void => {
    const nextGame = new Chess()
    setGameHistory([])
    setGame(nextGame)
    setGameState(createInitialGameState(mode))
  }, [mode])

  const undoMove = useCallback((): MoveResult => {
    try {
      const nextGame = cloneGame(game)
      const undone = nextGame.undo()
      if (!undone) {
        return { success: false, newState: null, error: 'No moves to undo' }
      }

      syncState(nextGame)
      const newState = buildGameState(nextGame, mode, gameState)
      return { success: true, newState, error: null }
    } catch (error) {
      return {
        success: false,
        newState: null,
        error: error instanceof Error ? error.message : 'Failed to undo move',
      }
    }
  }, [game, gameState, mode, syncState])

  const getPGN = useCallback((): string => game.pgn(), [game])

  const isGameOver = useCallback((): GameOverState => {
    if (!game.isGameOver()) {
      return { isOver: false, reason: null }
    }

    if (game.isCheckmate()) return { isOver: true, reason: 'checkmate' }
    if (game.isStalemate()) return { isOver: true, reason: 'stalemate' }
    if (game.isThreefoldRepetition()) return { isOver: true, reason: 'threefold_repetition' }
    if (game.isInsufficientMaterial()) return { isOver: true, reason: 'insufficient_material' }
    if (game.isDrawByFiftyMoves()) return { isOver: true, reason: 'fifty_moves' }
    return { isOver: true, reason: 'draw' }
  }, [game])

  const resignGame = useCallback((color: 'white' | 'black'): void => {
    setGameState((previous) => ({
      ...previous,
      status: 'finished',
      result: color === 'white' ? 'black' : 'white',
      updatedAt: new Date(),
    }))
  }, [])

  return {
    game,
    gameHistory,
    gameState,
    makeMove,
    getPossibleMoves,
    getCurrentFen,
    resetGame,
    undoMove,
    getPGN,
    isGameOver,
    resignGame,
    makeAIMove,
    isEngineLoading,
    aiLevel: currentAiLevel,
    setAiLevel: setCurrentAiLevel,
  }
}

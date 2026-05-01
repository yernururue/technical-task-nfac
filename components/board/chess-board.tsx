'use client'

import { useEffect, memo, useMemo, useState } from 'react'
import { Chessboard } from 'react-chessboard'
import { toast } from 'sonner'
import { Chess, Square, type Move } from 'chess.js'

import { useChessGame } from '@/hooks/useChessGame'
import type { GameResult, GameState } from '@/types/game'

export type BoardTheme = 'classic' | 'wood' | 'metallic' | 'dark' | 'neon' | 'default'

export const BOARD_THEMES: Record<BoardTheme, { light: string; dark: string }> = {
  default: { light: '#f0ede5', dark: '#b6b3aa' },
  classic: { light: '#f0d9b5', dark: '#b58863' }, // Standard Staunton
  wood: { light: '#dcb35c', dark: '#926139' },    // Warm Wood
  metallic: { light: '#d1d5db', dark: '#4b5563' }, // Slate/Gray
  dark: { light: '#dee3e6', dark: '#8ca2ad' },    // Blue/Gray
  neon: { light: '#1a1a1a', dark: '#0ea5e9' },    // Cyber/Neon
}

interface ChessBoardProps {
  gameMode?: 'local' | 'ai' | 'multiplayer'
  onGameEnd?: (pgn: string, result: GameResult) => void
  gameStateOverride?: GameState
  makeMoveOverride?: (fromSquare: string, toSquare: string, promotion?: 'q' | 'r' | 'b' | 'n') => {
    success: boolean
    error: string | null
  }
  boardWidth?: number
  disabled?: boolean
  boardOrientation?: 'white' | 'black'
  theme?: BoardTheme
}

// Optimization: Memoize the Square component to prevent 64 re-renders on every move
const CustomSquare = memo(({ children, style }: any) => (
  <div style={style}>{children}</div>
))
CustomSquare.displayName = 'CustomSquare'

export function ChessBoard({
  gameMode = 'local',
  onGameEnd,
  gameStateOverride,
  makeMoveOverride,
  boardWidth = 560,
  disabled = false,
  boardOrientation = 'white',
  theme = 'default',
}: ChessBoardProps): JSX.Element {
  // We use the internal hook for 'local' mode, but if overrides are provided (AI/Multiplayer),
  // we prioritize them. We also maintain a dedicated Chess instance for visual hints.
  const { game: localGame, gameState: localState, makeMove: localMakeMove } = useChessGame('local')
  
  const currentState = gameStateOverride ?? localState
  const moveExecutor = makeMoveOverride ?? localMakeMove
  
  const colors = BOARD_THEMES[theme] || BOARD_THEMES.default

  // Dedicated chess instance for calculating legal moves (dots) and turn validation.
  // This instance ALWAYS stays in sync with the current FEN.
  const boardGame = useMemo(() => new Chess(), [])
  
  useEffect(() => {
    if (currentState.fen && boardGame.fen() !== currentState.fen) {
      try {
        boardGame.load(currentState.fen)
      } catch (e) {
        console.error('Failed to sync board game state:', e)
      }
    }
  }, [currentState.fen, boardGame])

  // --- Click-to-move State ---
  const [moveFrom, setMoveFrom] = useState<Square | null>(null)
  const [optionSquares, setOptionSquares] = useState<Record<string, any>>({})

  useEffect(() => {
    const isFinished = currentState.status === 'finished'
    if (!isFinished || !onGameEnd || !currentState.result) {
      return
    }

    onGameEnd(currentState.pgn, currentState.result)
  }, [currentState.pgn, currentState.result, currentState.status, onGameEnd])

  // Optimization: Memoize pieces functions to prevent recreation on every render
  const customPieces = useMemo(() => ({}), [])

  // --- Move Hints Logic ---
  function getMoveOptions(square: Square) {
    const moves = boardGame.moves({
      square,
      verbose: true,
    })
    if (moves.length === 0) {
      setOptionSquares({})
      return false
    }

    const newSquares: Record<string, any> = {}
    moves.forEach((move: Move) => {
      newSquares[move.to] = {
        background:
          boardGame.get(move.to as Square) && boardGame.get(move.to as Square)?.color !== boardGame.get(square)?.color
            ? 'radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)'
            : 'radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)',
        borderRadius: '50%',
      }
    })
    
    // Highlight the selected square
    newSquares[square] = {
      background: 'rgba(16, 185, 129, 0.2)', // Subtle emerald highlight
    }
    
    setOptionSquares(newSquares)
    return true
  }

  function onSquareClick(square: Square) {
    if (disabled) return

    const piece = boardGame.get(square)
    const isOurPiece = piece && (piece.color === (boardGame.turn() === 'w' ? 'w' : 'b'))

    // --- 2nd Click: Try to execute move or switch selection ---
    if (moveFrom) {
      // If clicking same square, deselect
      if (moveFrom === square) {
        setMoveFrom(null)
        setOptionSquares({})
        return
      }

      // Check if the clicked square is a legal move
      const moves = boardGame.moves({ square: moveFrom, verbose: true })
      const isLegalMove = moves.some((m: Move) => m.to === square)

      if (isLegalMove) {
        const result = moveExecutor(moveFrom, square, 'q')
        if (result.success) {
          setMoveFrom(null)
          setOptionSquares({})
          return
        }
      }

      // If it wasn't a legal move, check if we clicked another of our own pieces to switch
      if (isOurPiece) {
        setMoveFrom(square)
        getMoveOptions(square)
        return
      }

      // Otherwise, clear selection
      setMoveFrom(null)
      setOptionSquares({})
      return
    }

    // --- 1st Click: Select piece if it belongs to current side ---
    if (isOurPiece) {
      setMoveFrom(square)
      getMoveOptions(square)
    }
  }

  return (
    <div className="w-full max-w-[560px]">
      <div className="relative w-full aspect-square">
        <Chessboard
          id="chessmind-board"
          position={currentState.fen || boardGame.fen()}
          boardWidth={boardWidth}
          boardOrientation={boardOrientation}
          customBoardStyle={{
            borderRadius: '0.75rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          }}
          customDarkSquareStyle={{ backgroundColor: colors.dark }}
          customLightSquareStyle={{ backgroundColor: colors.light }}
          arePiecesDraggable={!disabled}
          customSquare={CustomSquare}
          customPieces={customPieces}
          customSquareStyles={optionSquares}
          onSquareClick={onSquareClick}
          onPieceDrop={(sourceSquare, targetSquare) => {
            if (disabled) {
              return false
            }
            const result = moveExecutor(sourceSquare, targetSquare, 'q')
            if (!result.success && result.error) {
              toast.error(result.error)
            } else {
              // Clear hints after successful drag-and-drop
              setMoveFrom(null)
              setOptionSquares({})
            }
            return result.success
          }}
        />
      </div>
    </div>
  )
}

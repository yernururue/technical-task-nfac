'use client'

import { useEffect, memo, useMemo, useState } from 'react'
import { Chessboard } from 'react-chessboard'
import { toast } from 'sonner'
import { Square } from 'chess.js'

import { useChessGame } from '@/hooks/useChessGame'
import type { GameResult, GameState } from '@/types/game'

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
}: ChessBoardProps): JSX.Element {
  // Always use 'local' internally — AI page provides its own state/moves via overrides.
  // This prevents creating a duplicate Stockfish worker.
  const { game, gameState, makeMove } = useChessGame('local')
  const currentState = gameStateOverride ?? gameState
  const moveExecutor = makeMoveOverride ?? makeMove

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
  const customPieces = useMemo(() => ({
    // If we had custom SVG components for pieces, we would memoize them here.
    }), [])

  // --- Move Hints Logic ---
  function getMoveOptions(square: Square) {
    const moves = game.moves({
      square,
      verbose: true,
    })
    if (moves.length === 0) {
      setOptionSquares({})
      return false
    }

    const newSquares: Record<string, any> = {}
    moves.forEach((move) => {
      newSquares[move.to] = {
        background:
          game.get(move.to as Square) && game.get(move.to as Square)?.color !== game.get(square)?.color
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

    // 2nd Click: Try to move or switch selection
    if (moveFrom) {
      // If clicking same square, deselect
      if (moveFrom === square) {
        setMoveFrom(null)
        setOptionSquares({})
        return
      }

      // Try execution
      const result = moveExecutor(moveFrom, square, 'q')
      if (result.success) {
        setMoveFrom(null)
        setOptionSquares({})
        return
      }

      // If move failed, check if we clicked another of our own pieces to switch
      const piece = game.get(square)
      const currentTurn = game.turn() === 'w' ? 'white' : 'black'
      
      if (piece && (piece.color === 'w' ? 'white' : 'black') === currentTurn) {
        setMoveFrom(square)
        getMoveOptions(square)
        return
      }

      // Otherwise, clear selection
      setMoveFrom(null)
      setOptionSquares({})
      return
    }

    // 1st Click: Select piece if it's the current player's turn
    const piece = game.get(square)
    const currentTurn = game.turn() === 'w' ? 'white' : 'black'
    
    if (piece && (piece.color === 'w' ? 'white' : 'black') === currentTurn) {
      setMoveFrom(square)
      getMoveOptions(square)
    }
  }

  return (
    <div className="w-full max-w-[560px]">
      <div className="relative w-full aspect-square">
        <Chessboard
          id="chessmind-board"
          position={currentState.fen || game.fen()}
          boardWidth={boardWidth}
          boardOrientation={boardOrientation}
          customBoardStyle={{
            borderRadius: '0.75rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          }}
          customDarkSquareStyle={{ backgroundColor: '#b6b3aa' }}
          customLightSquareStyle={{ backgroundColor: '#f0ede5' }}
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

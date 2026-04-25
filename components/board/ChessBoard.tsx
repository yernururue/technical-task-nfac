'use client'

import { useEffect } from 'react'
import { Chessboard } from 'react-chessboard'
import { toast } from 'sonner'

import { useChessGame } from '@/hooks/useChessGame'
import type { GameResult, GameState } from '@/types/game'

interface ChessBoardProps {
  gameMode?: 'local' | 'ai'
  onGameEnd?: (pgn: string, result: GameResult) => void
  gameStateOverride?: GameState
  makeMoveOverride?: (fromSquare: string, toSquare: string, promotion?: 'q' | 'r' | 'b' | 'n') => {
    success: boolean
    error: string | null
  }
  boardWidth?: number
}

export function ChessBoard({
  gameMode = 'local',
  onGameEnd,
  gameStateOverride,
  makeMoveOverride,
  boardWidth = 560,
}: ChessBoardProps): JSX.Element {
  const { game, gameState, makeMove } = useChessGame(gameMode)
  const currentState = gameStateOverride ?? gameState
  const moveExecutor = makeMoveOverride ?? makeMove

  useEffect(() => {
    const isFinished = currentState.status === 'finished'
    if (!isFinished || !onGameEnd || !currentState.result) {
      return
    }

    onGameEnd(currentState.pgn, currentState.result)
  }, [currentState.pgn, currentState.result, currentState.status, onGameEnd])

  return (
    <section className="w-full max-w-[560px]">
      <Chessboard
        id="chessmind-board"
        position={currentState.fen || game.fen()}
        boardWidth={boardWidth}
        customBoardStyle={{
          borderRadius: '0.75rem',
          boxShadow: '0 6px 24px rgba(0, 0, 0, 0.2)',
        }}
        onPieceDrop={(sourceSquare, targetSquare) => {
          const result = moveExecutor(sourceSquare, targetSquare, 'q')
          if (!result.success && result.error) {
            toast.error(result.error)
          }
          return result.success
        }}
      />
    </section>
  )
}

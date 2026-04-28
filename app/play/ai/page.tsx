'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChessBoard } from '@/components/board/chess-board'
import { MoveHistory } from '@/components/board/move-history'
import { GameControls } from '@/components/board/game-controls'
import { useChessGame } from '@/hooks/useChessGame'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AlertCircle, Loader2 } from 'lucide-react'
import type { ChessLevel } from '@/hooks/useChessGame'

export default function AIPlayPage() {
  const router = useRouter()
  const [aiLevel, setAiLevel] = useState<ChessLevel>(2)
  const [isAIThinking, setIsAIThinking] = useState(false)

  const {
    game,
    gameState,
    makeMove,
    makeAIMove,
    isEngineLoading,
    isGameOver,
  } = useChessGame('ai', aiLevel)

  // Stable refs so the effect doesn't re-fire when function identities change
  const makeAIMoveRef = useRef(makeAIMove)
  useEffect(() => { makeAIMoveRef.current = makeAIMove }, [makeAIMove])

  const isGameOverRef = useRef(isGameOver)
  useEffect(() => { isGameOverRef.current = isGameOver }, [isGameOver])

  // Ref to guard against double-triggers without causing re-renders
  const isThinkingRef = useRef(false)

  // Auto-make AI move when it's black's turn
  useEffect(() => {
    if (
      !isEngineLoading &&
      gameState.currentTurn === 'black' &&
      !isThinkingRef.current &&
      !isGameOverRef.current().isOver
    ) {
      isThinkingRef.current = true
      setIsAIThinking(true)

      const timer = setTimeout(async () => {
        try {
          const success = await makeAIMoveRef.current()
          if (!success) {
            console.warn('[AI Play] AI move failed')
          }
        } catch (err) {
          console.error('[AI Play] Error:', err)
        } finally {
          isThinkingRef.current = false
          setIsAIThinking(false)
        }
      }, 500)

      return () => {
        clearTimeout(timer)
        isThinkingRef.current = false
        setIsAIThinking(false)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.currentTurn, isEngineLoading])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Play vs AI</h1>
          <p className="text-slate-400">You are White</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Board */}
          <div className="lg:col-span-2">
            {/* Status alerts */}
            {isEngineLoading && (
              <div className="mb-4 p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg flex gap-3">
                <Loader2 className="w-5 h-5 text-yellow-500 animate-spin flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-yellow-200">Initializing chess engine...</p>
                  <p className="text-xs text-yellow-300 mt-1">Ready to play in a moment</p>
                </div>
              </div>
            )}

            {isAIThinking && (
              <div className="mb-4 p-4 bg-blue-900/20 border border-blue-700 rounded-lg flex gap-3">
                <Loader2 className="w-5 h-5 text-blue-500 animate-spin flex-shrink-0" />
                <p className="text-sm font-medium text-blue-200">AI is thinking...</p>
              </div>
            )}

            {isGameOver().isOver && (
              <div className="mb-4 p-4 bg-green-900/20 border border-green-700 rounded-lg flex gap-3">
                <AlertCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-200">Game Over</p>
                  <p className="text-xs text-green-300 mt-1">
                    {isGameOver().reason === 'checkmate' ? 'Checkmate' : 'Game Finished'}
                  </p>
                </div>
              </div>
            )}

            {/* Chess board */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-2xl">
              <ChessBoard
                gameMode="ai"
                gameStateOverride={gameState}
                makeMoveOverride={makeMove}
                disabled={isAIThinking || gameState.currentTurn === 'black' || isEngineLoading}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Difficulty selector */}
            <Card className="bg-slate-800 border-slate-700 p-4">
              <h3 className="text-sm font-semibold text-white mb-3">Difficulty</h3>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((level) => (
                  <Button
                    key={level}
                    onClick={() => setAiLevel(level as ChessLevel)}
                    disabled={isAIThinking || isEngineLoading}
                    variant={aiLevel === level ? 'default' : 'outline'}
                    className={
                      aiLevel === level
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'border-slate-600 text-slate-300'
                    }
                  >
                    {level === 1 ? 'Easy' : level === 2 ? 'Med' : 'Hard'}
                  </Button>
                ))}
              </div>
            </Card>

            {/* Game info */}
            <Card className="bg-slate-800 border-slate-700 p-4">
              <h3 className="text-sm font-semibold text-white mb-3">Game Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Turn:</span>
                  <span className="text-white font-medium">
                    {gameState.currentTurn === 'white' ? '♔ White' : '♚ Black'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Moves:</span>
                  <span className="text-white font-medium">{gameState.moveCount}</span>
                </div>
                {isGameOver().isOver && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status:</span>
                    <span className="text-green-400 font-medium">Finished</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Move history */}
            <Card className="bg-slate-800 border-slate-700 p-4 flex-1">
              <h3 className="text-sm font-semibold text-white mb-3">Moves</h3>
              <div className="bg-slate-900 rounded p-3 max-h-64 overflow-y-auto">
                <p className="text-xs text-slate-400 font-mono break-words">
                  {game?.pgn() || 'No moves yet'}
                </p>
              </div>
            </Card>

            {/* Controls */}
            <div className="space-y-2">
              <Button
                onClick={() => router.push('/play')}
                variant="outline"
                className="w-full border-slate-600 text-slate-300"
              >
                Back to Menu
              </Button>
              {isGameOver().isOver && (
                <Button
                  onClick={() => window.location.reload()}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  New Game
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

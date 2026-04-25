'use client'

import { useEffect, useState } from 'react'
import { Bot, Brain, Cpu, Zap, User, Loader2, AlertCircle } from 'lucide-react'

import { ChessBoard } from '@/components/board/ChessBoard'
import { GameControls } from '@/components/board/GameControls'
import { MoveHistory } from '@/components/board/MoveHistory'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useChessGame } from '@/hooks/useChessGame'
import type { StockfishLevel } from '@/lib/chess/stockfish'

export default function AIPlayPage(): JSX.Element {
  const [aiLevel, setAiLevel] = useState<StockfishLevel>(2)
  const { game, gameState, makeMove, makeAIMove, resetGame, isStockfishLoading, isGameOver } = useChessGame('ai', aiLevel)
  const [isAIThinking, setIsAIThinking] = useState(false)

  useEffect(() => {
    if (!isStockfishLoading && !isAIThinking && gameState.currentTurn === 'black' && !isGameOver().isOver) {
      setIsAIThinking(true)
      const timer = window.setTimeout(async () => {
        const success = await makeAIMove()
        console.log('AI move result:', success)
        setIsAIThinking(false)
      }, 600)

      return () => window.clearTimeout(timer)
    }

    if (isGameOver().isOver && isAIThinking) {
      setIsAIThinking(false)
    }

    return
  }, [gameState.currentTurn, isStockfishLoading, isAIThinking, makeAIMove, isGameOver])

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 relative">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <div className="container relative mx-auto flex flex-col gap-8 px-4 py-8 lg:flex-row lg:items-start max-w-7xl z-10 animate-slide-up">
        <div className="flex-1 flex flex-col items-center lg:items-end justify-center w-full">
          <div className="w-full max-w-[640px] flex flex-col gap-4">
            
            {/* Player Info Bars */}
            <div className="flex items-center justify-between bg-black/20 rounded-xl p-3 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center bg-purple-500/20 rounded-lg text-purple-400">
                  <Bot className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 flex items-center gap-2">
                    Stockfish AI
                    {isStockfishLoading && <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Level {aiLevel} • 
                    {isAIThinking ? <span className="text-purple-400 ml-1">Thinking...</span> : <span className="ml-1">Ready</span>}
                  </p>
                </div>
              </div>
              <Badge variant={gameState.currentTurn === 'black' ? 'default' : 'secondary'} className={gameState.currentTurn === 'black' ? 'bg-purple-600 hover:bg-purple-600' : ''}>
                {gameState.currentTurn === 'black' ? 'To Move' : 'Waiting'}
              </Badge>
            </div>

            <div className="mx-auto w-full flex justify-center">
              <ChessBoard
                gameMode="ai"
                gameStateOverride={gameState}
                makeMoveOverride={makeMove}
                disabled={isStockfishLoading || isAIThinking || gameState.currentTurn === 'black'}
              />
            </div>

            <div className="flex items-center justify-between bg-black/20 rounded-xl p-3 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center bg-blue-500/20 rounded-lg text-blue-400">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100">You</h3>
                  <p className="text-xs text-slate-400">Playing White</p>
                </div>
              </div>
              <Badge variant={gameState.currentTurn === 'white' ? 'default' : 'secondary'} className={gameState.currentTurn === 'white' ? 'bg-blue-600 hover:bg-blue-600' : ''}>
                {gameState.currentTurn === 'white' ? 'Your Turn' : 'Waiting'}
              </Badge>
            </div>
            
          </div>
        </div>

        <aside className="w-full lg:w-80 flex flex-col gap-4">
          <Card className="glass-card border-border/50 bg-background/60 shadow-xl backdrop-blur-xl">
            <CardHeader className="pb-3 pt-4 text-foreground">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Brain className="h-5 w-5 text-purple-400" />
                AI Difficulty
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { level: 1, label: 'Easy', icon: Zap },
                  { level: 2, label: 'Medium', icon: Cpu },
                  { level: 3, label: 'Hard', icon: AlertCircle },
                ].map(({ level, label, icon: Icon }) => (
                  <Button
                    key={level}
                    onClick={() => setAiLevel(level as StockfishLevel)}
                    variant={aiLevel === level ? 'default' : 'outline'}
                    className={aiLevel === level ? 'bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-900/20' : 'bg-background/50 hover:bg-background/80'}
                    type="button"
                    disabled={isStockfishLoading || isAIThinking || gameState.moveCount > 0}
                    title={gameState.moveCount > 0 ? "Cannot change difficulty mid-game" : ""}
                  >
                    <Icon className="h-4 w-4 mb-1" />
                    <span className="text-xs">{label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <MoveHistory pgn={game?.pgn() || ''} />

          <GameControls
            onResign={() => {
              // TODO
            }}
            onNewGame={() => {
              setIsAIThinking(false)
              resetGame()
            }}
            onOfferDraw={() => {
              // TODO
            }}
            disabled={isAIThinking || isStockfishLoading}
          />
        </aside>
      </div>
    </main>
  )
}

'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Users, User, Share, Crown, BarChart3, Loader2 } from 'lucide-react'

import { ChessBoard } from '@/components/board/chess-board'
import { GameControls } from '@/components/board/game-controls'
import { MoveHistory } from '@/components/board/move-history'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useChessGame } from '@/hooks/useChessGame'
import { useProfile } from '@/hooks/useProfile'
import type { GameResult } from '@/types/game'

function getResultLabel(result: GameResult | null): string {
  if (!result || result === 'in_progress') return 'In progress'
  if (result === 'white') return 'White won'
  if (result === 'black') return 'Black won'
  if (result === 'draw') return 'Draw'
  return 'Abandoned'
}

export default function LocalPlayPage(): JSX.Element {
  const { game, gameState, makeMove, resetGame, resignGame, getPGN, isGameOver } = useChessGame('local')
  const { boardTheme } = useProfile()

  const [savedGameId, setSavedGameId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const hasSavedRef = useRef(false)

  // Save game to DB when it finishes
  const saveGame = useCallback(async () => {
    if (hasSavedRef.current) return
    hasSavedRef.current = true
    setIsSaving(true)

    try {
      const pgn = game.pgn()
      const result = gameState.result || 'draw'

      const res = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pgn,
          result,
          mode: 'local',
          white_username: gameState.players.white.username,
          black_username: gameState.players.black.username,
          total_moves: gameState.moveCount,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setSavedGameId(data.id)
        toast.success('Game saved!')
        console.log('[Local Play] Game saved with id:', data.id)
      } else {
        const err = await res.json().catch(() => ({}))
        console.error('[Local Play] Failed to save game:', err)
        toast.error('Failed to save game')
        hasSavedRef.current = false
      }
    } catch (err) {
      console.error('[Local Play] Save error:', err)
      toast.error('Failed to save game')
      hasSavedRef.current = false
    } finally {
      setIsSaving(false)
    }
  }, [game, gameState.result, gameState.moveCount, gameState.players])

  const handleGameEnd = useCallback((pgn: string, result: GameResult): void => {
    console.log('[Local Play] handleGameEnd triggered', { result, pgnLength: pgn.length })
    toast.success(`Game ended: ${getResultLabel(result)}`)
    
    if (!hasSavedRef.current) {
      console.log('[Local Play] Triggering saveGame from handleGameEnd')
      saveGame()
    }
  }, [saveGame])

  // Also trigger save if status changes to finished (backup for resignation)
  useEffect(() => {
    if (gameState.status === 'finished' && !hasSavedRef.current) {
      console.log('[Local Play] Triggering saveGame from status Effect')
      saveGame()
    }
  }, [gameState.status, saveGame])

  const handleResign = (): void => {
    resignGame(gameState.currentTurn)
    toast.info(`${gameState.currentTurn === 'white' ? 'White' : 'Black'} resigned.`)
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 relative">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <div className="container relative mx-auto flex flex-col gap-8 px-4 py-8 lg:flex-row lg:items-start max-w-7xl z-10">
        
        <div className="flex-1 flex flex-col items-center lg:items-end justify-center w-full">
          <div className="w-full max-w-[640px] flex flex-col gap-4">
            
            {/* Player Info Bars */}
            <div className="flex items-center justify-between bg-black/20 rounded-xl p-3 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center bg-slate-500/20 rounded-lg text-slate-300">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 flex items-center gap-2">
                    {gameState.players.black.username}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Playing Black
                  </p>
                </div>
              </div>
              <Badge variant={gameState.currentTurn === 'black' ? 'default' : 'secondary'} className={gameState.currentTurn === 'black' ? 'bg-amber-600 hover:bg-amber-600' : ''}>
                {gameState.currentTurn === 'black' ? 'To Move' : 'Waiting'}
              </Badge>
            </div>

            <div className="mx-auto w-full flex justify-center">
              <ChessBoard
                gameMode="local"
                onGameEnd={handleGameEnd}
                gameStateOverride={gameState}
                makeMoveOverride={makeMove}
                boardOrientation={gameState.currentTurn}
                theme={boardTheme}
              />
            </div>

            <div className="flex items-center justify-between bg-black/20 rounded-xl p-3 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center bg-slate-500/20 rounded-lg text-slate-300">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 flex items-center gap-2">
                    {gameState.players.white.username}
                  </h3>
                  <p className="text-xs text-slate-400">Playing White</p>
                </div>
              </div>
              <Badge variant={gameState.currentTurn === 'white' ? 'default' : 'secondary'} className={gameState.currentTurn === 'white' ? 'bg-amber-600 hover:bg-amber-600' : ''}>
                {gameState.currentTurn === 'white' ? 'Your Turn' : 'Waiting'}
              </Badge>
            </div>

          </div>
        </div>

        <aside className="w-full lg:w-80 flex flex-col gap-4">
          <Card className="glass-card border-border/50 bg-background/60 shadow-xl backdrop-blur-xl">
            <CardHeader className="pb-3 pt-4 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-lg flex items-center gap-2">
                <Crown className="h-5 w-5 text-amber-500" />
                Status
              </CardTitle>
              <Badge variant="outline" className="border-border bg-background/50">
                {getResultLabel(gameState.result)}
              </Badge>
            </CardHeader>
          </Card>

          <MoveHistory pgn={game.pgn()} currentMove={gameState.moveCount} />

          <GameControls
            onNewGame={resetGame}
            onOfferDraw={() => toast.info('Draw offer feature is coming soon.')}
            onResign={handleResign}
            disabled={gameState.result !== 'in_progress'}
          />

          {/* Analyze Replay button — shown after game is saved */}
          {gameState.status === 'finished' && (
            <Card className="glass-card border-border/50 bg-background/60 shadow-xl backdrop-blur-xl">
              <CardContent className="pt-4 space-y-2">
                {savedGameId && (
                  <Link href={`/analysis/${savedGameId}`} className="block">
                    <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold shadow-lg shadow-cyan-500/20">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Analyze Replay
                    </Button>
                  </Link>
                )}
                {isSaving && (
                  <Button disabled className="w-full">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving game...
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          <Card className="glass-card border-border/50 bg-background/60 shadow-xl backdrop-blur-xl">
            <CardHeader className="pb-3 pt-4 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Portable Game Notation</CardTitle>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => {
                navigator.clipboard.writeText(getPGN())
                toast.success('PGN copied to clipboard')
              }}>
                <Share className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </Button>
            </CardHeader>
            <CardContent>
              <p className="max-h-24 overflow-y-auto rounded bg-black/40 p-3 text-xs font-mono text-slate-300 leading-relaxed break-all border border-white/5">
                {getPGN() || 'No moves played yet.'}
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  )
}

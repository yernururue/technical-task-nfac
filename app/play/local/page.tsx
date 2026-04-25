'use client'

import { toast } from 'sonner'

import { ChessBoard } from '@/components/board/ChessBoard'
import { GameControls } from '@/components/board/GameControls'
import { MoveHistory } from '@/components/board/MoveHistory'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useChessGame } from '@/hooks/useChessGame'
import type { GameResult } from '@/types/game'

function getResultLabel(result: GameResult | null): string {
  if (!result || result === 'in_progress') return 'In progress'
  if (result === 'white') return 'White won'
  if (result === 'black') return 'Black won'
  if (result === 'draw') return 'Draw'
  return 'Abandoned'
}

export default function LocalPlayPage(): JSX.Element {
  const { game, gameState, makeMove, resetGame, resignGame, getPGN } = useChessGame('local')

  const handleGameEnd = (pgn: string, result: GameResult): void => {
    toast.success(`Game ended: ${getResultLabel(result)}`)
    if (pgn.trim().length > 0) {
      toast.message('PGN saved in session')
    }
  }

  const handleResign = (): void => {
    resignGame(gameState.currentTurn)
    toast.info(`${gameState.currentTurn === 'white' ? 'White' : 'Black'} resigned.`)
  }

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <ChessBoard
          gameMode="local"
          onGameEnd={handleGameEnd}
          gameStateOverride={gameState}
          makeMoveOverride={makeMove}
        />
        <aside className="flex w-full max-w-md flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Players</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>White: {gameState.players.white.username}</span>
                <Badge variant={gameState.currentTurn === 'white' ? 'default' : 'outline'}>To move</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Black: {gameState.players.black.username}</span>
                <Badge variant={gameState.currentTurn === 'black' ? 'default' : 'outline'}>To move</Badge>
              </div>
              <p className="text-muted-foreground">Status: {getResultLabel(gameState.result)}</p>
            </CardContent>
          </Card>

          <MoveHistory pgn={game.pgn()} />

          <GameControls
            onNewGame={resetGame}
            onOfferDraw={() => toast.info('Draw offer feature is coming soon.')}
            onResign={handleResign}
          />

          <Card>
            <CardHeader>
              <CardTitle>Current PGN</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="max-h-32 overflow-auto rounded bg-muted p-2 text-xs leading-relaxed">{getPGN() || '-'}</p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  )
}

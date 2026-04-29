'use client'

import { useEffect, useState, use, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { User, Share, Crown, BarChart3, Loader2 } from 'lucide-react'

import { ChessBoard } from '@/components/board/chess-board'
import { MoveHistory } from '@/components/board/move-history'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useChessGame } from '@/hooks/useChessGame'
import { createClient } from '@/lib/supabase/client'
import { updateGamePgnAction, finalizeGameAction } from '../../game-actions'
import { getPlayerIdAction } from '../../actions'
import type { GameResult } from '@/types/game'

function getResultLabel(result: GameResult | null): string {
  if (!result || result === 'in_progress') return 'In progress'
  if (result === 'white') return 'White won'
  if (result === 'black') return 'Black won'
  if (result === 'draw') return 'Draw'
  return 'Abandoned'
}

export default function MultiplayerGamePage({ params }: { params: { roomId: string } }) {
  const router = useRouter()
  const roomId = params.roomId
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [localPlayerColor, setLocalPlayerColor] = useState<'white' | 'black' | null>(null)
  const [opponentName, setOpponentName] = useState<string>('Opponent')
  const [localPlayerName, setLocalPlayerName] = useState<string>('You')
  const [gameId, setGameId] = useState<string | null>(null)
  const [isGameFinalized, setIsGameFinalized] = useState(false)

  const { game, gameState, makeMove, getPGN } = useChessGame('multiplayer')
  
  const supabase = createClient()
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)
  const isSyncingPgnRef = useRef(false)

  useEffect(() => {
    let active = true

    const initializeGame = async () => {
      try {
        const player = await getPlayerIdAction()
        const playerId = player.id

        // Fetch room
        const { data: room, error: roomError } = await supabase
          .from('rooms')
          .select('*')
          .eq('id', roomId)
          .single()

        if (roomError || !room) {
          throw new Error('Room not found.')
        }

        if (room.status !== 'active' && room.status !== 'finished') {
          throw new Error('Game is not active yet.')
        }

        if (!room.game_id) {
          throw new Error('Game ID is missing.')
        }

        setGameId(room.game_id)

        // Determine player colors
        if (playerId === room.host_id) {
          setLocalPlayerColor(room.host_color as 'white' | 'black')
        } else if (playerId === room.guest_id) {
          setLocalPlayerColor(room.host_color === 'white' ? 'black' : 'white')
        } else {
          throw new Error('You are not a participant in this room.')
        }

        if (!active) return

        // Setup real-time channel for moves
        const channel = supabase.channel(`game:${room.game_id}`)
        
        channel
          .on('broadcast', { event: 'move' }, (payload) => {
            if (!active) return
            
            const { from, to, promotion } = payload.payload
            console.log('Received move:', from, to, promotion)
            
            // Execute move locally without re-broadcasting
            makeMove(from, to, promotion)
          })
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
              console.log('Successfully connected to game channel.')
            }
          })
          
        channelRef.current = channel

        setLoading(false)
      } catch (err: any) {
        if (active) {
          console.error(err)
          setError(err.message)
          setLoading(false)
        }
      }
    }

    initializeGame()

    return () => {
      active = false
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
      }
    }
  }, [roomId, router, makeMove, supabase])

  // Custom make move function that broadcasts to the opponent
  const handleMakeMove = useCallback((from: string, to: string, promotion?: 'q' | 'r' | 'b' | 'n') => {
    // Cannot move if it's not our turn
    if (gameState.currentTurn !== localPlayerColor) {
      return { success: false, error: 'Not your turn' }
    }

    // Apply move locally
    const result = makeMove(from, to, promotion)
    
    if (result.success) {
      // Broadcast the move
      if (channelRef.current) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'move',
          payload: { from, to, promotion }
        })
      }

      // Save PGN to DB asynchronously
      if (gameId && !isSyncingPgnRef.current) {
        isSyncingPgnRef.current = true
        updateGamePgnAction(gameId, game.pgn()).finally(() => {
          isSyncingPgnRef.current = false
        })
      }
    }
    
    return result
  }, [gameState.currentTurn, localPlayerColor, makeMove, gameId, game])

  // Handle Game End
  const handleGameEnd = useCallback(async (pgn: string, result: GameResult) => {
    if (isGameFinalized || !gameId) return
    setIsGameFinalized(true)
    
    toast.success(`Game Over: ${getResultLabel(result)}`)
    
    // Save final state
    await finalizeGameAction(gameId, pgn, result)
  }, [gameId, isGameFinalized])


  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <h2 className="text-xl font-bold">Connecting to Game...</h2>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-bold text-destructive">Connection Error</h2>
        <p className="text-muted-foreground">{error}</p>
        <Link href="/play/multiplayer">
          <Button className="rounded-full">Back to Lobby</Button>
        </Link>
      </div>
    )
  }

  const isPlayerTurn = gameState.currentTurn === localPlayerColor
  const opponentColor = localPlayerColor === 'white' ? 'black' : 'white'

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 relative">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <div className="container relative mx-auto flex flex-col gap-8 px-4 py-8 lg:flex-row lg:items-start max-w-7xl z-10">
        
        <div className="flex-1 flex flex-col items-center lg:items-end justify-center w-full">
          <div className="w-full max-w-[640px] flex flex-col gap-4">
            
            {/* Opponent Info */}
            <div className="flex items-center justify-between bg-black/20 rounded-xl p-3 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center bg-slate-500/20 rounded-lg text-slate-300">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 flex items-center gap-2">
                    {opponentName}
                  </h3>
                  <p className="text-xs text-slate-400 capitalize">
                    Playing {opponentColor}
                  </p>
                </div>
              </div>
              <Badge variant={!isPlayerTurn ? 'default' : 'secondary'} className={!isPlayerTurn ? 'bg-amber-600 hover:bg-amber-600' : ''}>
                {!isPlayerTurn ? 'To Move' : 'Waiting'}
              </Badge>
            </div>

            <div className="mx-auto w-full flex justify-center">
              <ChessBoard
                gameMode="multiplayer"
                boardOrientation={localPlayerColor || 'white'}
                onGameEnd={handleGameEnd}
                gameStateOverride={gameState}
                makeMoveOverride={handleMakeMove}
                disabled={!isPlayerTurn}
              />
            </div>

            {/* Local Player Info */}
            <div className="flex items-center justify-between bg-black/20 rounded-xl p-3 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 flex items-center justify-center bg-slate-500/20 rounded-lg text-slate-300">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 flex items-center gap-2">
                    {localPlayerName}
                  </h3>
                  <p className="text-xs text-slate-400 capitalize">Playing {localPlayerColor}</p>
                </div>
              </div>
              <Badge variant={isPlayerTurn ? 'default' : 'secondary'} className={isPlayerTurn ? 'bg-amber-600 hover:bg-amber-600' : ''}>
                {isPlayerTurn ? 'Your Turn' : 'Waiting'}
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

          {isGameFinalized && (
            <Card className="glass-card border-border/50 bg-background/60 shadow-xl backdrop-blur-xl">
              <CardContent className="pt-4 space-y-2">
                <Link href={`/analysis/${gameId}`} className="block">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-lg shadow-purple-500/20">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Analyze Replay
                  </Button>
                </Link>
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

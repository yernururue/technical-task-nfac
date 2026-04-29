'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, BarChart3, Clock, Swords, ChevronRight } from 'lucide-react'

interface GameItem {
  id: string
  white_username: string
  black_username: string
  result: string
  mode: string
  total_moves: number
  ai_level: number | null
  created_at: string
}

function getResultLabel(result: string): string {
  if (result === 'white') return 'White won'
  if (result === 'black') return 'Black won'
  if (result === 'draw') return 'Draw'
  if (result === 'abandoned') return 'Abandoned'
  return result
}

function getResultColor(result: string): string {
  if (result === 'white') return 'text-white'
  if (result === 'black') return 'text-slate-400'
  if (result === 'draw') return 'text-amber-400'
  return 'text-slate-500'
}

function getModeLabel(mode: string, aiLevel: number | null): string {
  if (mode === 'ai') return `vs AI (Level ${aiLevel || '?'})`
  if (mode === 'local') return 'Local Game'
  if (mode === 'multiplayer') return 'Online'
  return mode
}

import { useCache } from '@/hooks/useCache'

export default function HistoryPage() {
  const { data: games, loading, error } = useCache<GameItem[]>(
    'game-history',
    async () => {
      const res = await fetch('/api/games?limit=30')
      if (!res.ok) throw new Error('Failed to load games')
      const data = await res.json()
      return data.games || []
    },
    { ttl: 120_000 } // 2 minutes cache
  )

  const gamesList = games || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Clock className="w-8 h-8 text-cyan-400" />
            Game History
          </h1>
          <p className="text-slate-400">Your recent games and replays</p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20 gap-3 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-lg">Loading games...</span>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <Card className="bg-slate-800 border-slate-700 p-8 text-center">
            <p className="text-red-400 mb-4">{error.message}</p>
            <Button onClick={() => window.location.reload()} variant="outline" className="border-slate-600 text-slate-300">
              Retry
            </Button>
          </Card>
        )}

        {/* Empty */}
        {!loading && !error && gamesList.length === 0 && (
          <Card className="bg-slate-800 border-slate-700 p-12 text-center">
            <Swords className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">No games yet</h2>
            <p className="text-slate-400 mb-6">Play a game to see it here!</p>
            <Link href="/play">
              <Button className="bg-cyan-600 hover:bg-cyan-700">Start Playing</Button>
            </Link>
          </Card>
        )}

        {/* Games list */}
        {!loading && !error && gamesList.length > 0 && (
          <div className="space-y-3">
            {gamesList.map((game) => (
              <Link key={game.id} href={`/analysis/${game.id}`} className="block">
                <Card className="bg-slate-800/80 border-slate-700 hover:border-cyan-600/50 hover:bg-slate-800 transition-all p-4 cursor-pointer group">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-white font-bold">{game.white_username}</span>
                        <span className="text-slate-500 text-sm">vs</span>
                        <span className="text-slate-300 font-bold">{game.black_username}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <Badge variant="outline" className="border-slate-600 text-slate-400 text-[10px]">
                          {getModeLabel(game.mode, game.ai_level)}
                        </Badge>
                        <span className={`font-bold ${getResultColor(game.result)}`}>
                          {getResultLabel(game.result)}
                        </span>
                        <span className="text-slate-500">{game.total_moves} moves</span>
                        <span className="text-slate-600">
                          {new Date(game.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 group-hover:text-cyan-400 transition-colors">
                      <BarChart3 className="w-4 h-4" />
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

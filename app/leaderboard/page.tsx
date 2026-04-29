'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Trophy, Medal, User } from 'lucide-react'
import { useCache } from '@/hooks/useCache'

interface LeaderboardEntry {
  username: string
  rating: number
  games_played: number
  wins: number
}

export default function LeaderboardPage() {
  const { data: entries, loading, error } = useCache<LeaderboardEntry[]>(
    'leaderboard',
    async () => {
      // Fetching from profiles table sorted by rating
      const res = await fetch('/api/leaderboard')
      if (!res.ok) throw new Error('Failed to load leaderboard')
      const data = await res.json()
      return data.entries || []
    },
    { ttl: 300_000 } // 5 minutes cache
  )

  const entriesList = entries || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Trophy className="w-8 h-8 text-amber-400" />
            Global Leaderboard
          </h1>
          <p className="text-slate-400">Top players by rating</p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20 gap-3 text-slate-400">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-lg">Calculating rankings...</span>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <Card className="bg-slate-800 border-slate-700 p-8 text-center">
            <p className="text-red-400 mb-4">{error.message}</p>
          </Card>
        )}

        {/* List */}
        {!loading && !error && entriesList.length > 0 && (
          <div className="space-y-3">
            {entriesList.map((entry, idx) => (
              <Card key={entry.username} className="bg-slate-800/80 border-slate-700 hover:border-amber-500/30 transition-all p-5 flex items-center gap-6">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-900 font-black text-lg">
                  {idx === 0 ? <Medal className="text-amber-400 w-6 h-6" /> : 
                   idx === 1 ? <Medal className="text-slate-300 w-6 h-6" /> :
                   idx === 2 ? <Medal className="text-amber-700 w-6 h-6" /> :
                   idx + 1}
                </div>
                
                <div className="flex-1 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center text-slate-400">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{entry.username}</h3>
                    <p className="text-xs text-slate-500">{entry.games_played} games played</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-black text-amber-400">{entry.rating}</div>
                  <Badge variant="outline" className="border-emerald-500/20 text-emerald-400 text-[10px]">
                    {Math.round((entry.wins / (entry.games_played || 1)) * 100)}% Win Rate
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

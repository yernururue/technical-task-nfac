'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Chessboard } from 'react-chessboard'
import { Chess } from 'chess.js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ArrowLeft,
  ArrowRight,
  SkipBack,
  SkipForward,
  Loader2,
  AlertCircle,
  BarChart3,
  ChevronLeft,
} from 'lucide-react'

interface AnalysisData {
  summary: string
  mistakes: Array<{
    move: string
    comment: string
    better_move: string
  }>
  cached?: boolean
}

interface GameData {
  id: string
  pgn: string
  result: string
  mode: string
  white_username: string
  black_username: string
  total_moves: number
  created_at: string
}

export default function AnalysisPage() {
  const params = useParams()
  const router = useRouter()
  const gameId = params.id as string

  const [gameData, setGameData] = useState<GameData | null>(null)
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null)
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Replay state
  const [moveIndex, setMoveIndex] = useState(-1)
  const [positions, setPositions] = useState<string[]>([])
  const [moveList, setMoveList] = useState<string[]>([])

  // Fetch game data
  useEffect(() => {
    async function fetchGame() {
      try {
        const res = await fetch(`/api/games?game_id=${gameId}`)
        if (!res.ok) {
          setError('Game not found')
          setLoading(false)
          return
        }
        const data = await res.json()
        const game = data.games?.[0] || data.game
        if (!game) {
          setError('Game not found')
          setLoading(false)
          return
        }

        setGameData(game)

        // Parse PGN into positions for replay
        if (game.pgn) {
          const chess = new Chess()
          const tempChess = new Chess()
          tempChess.loadPgn(game.pgn)
          const history = tempChess.history()

          const positionList = [chess.fen()]
          for (const move of history) {
            chess.move(move)
            positionList.push(chess.fen())
          }
          setPositions(positionList)
          setMoveList(history)
          setMoveIndex(positionList.length - 1) // start at final position
        }

        setLoading(false)
      } catch (err) {
        console.error('[Analysis] Fetch error:', err)
        setError('Failed to load game')
        setLoading(false)
      }
    }

    if (gameId) fetchGame()
  }, [gameId])

  // Run AI analysis
  const runAnalysis = async () => {
    if (!gameData?.pgn || analyzing) return
    setAnalyzing(true)

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          pgn: gameData.pgn,
          gameId: gameId
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setAnalysis(data)
      } else {
        console.error('[Analysis] API error')
      }
    } catch (err) {
      console.error('[Analysis] Error:', err)
    } finally {
      setAnalyzing(false)
    }
  }

  // Auto-analyze when game data loads
  useEffect(() => {
    if (gameData?.pgn && !analysis && !analyzing) {
      runAnalysis()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameData])

  const currentFen = positions[moveIndex] || 'start'

  function getResultLabel(result: string): string {
    if (result === 'white') return 'White won'
    if (result === 'black') return 'Black won'
    if (result === 'draw') return 'Draw'
    return result
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-300">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="text-lg font-medium">Loading game...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center">
        <Card className="bg-slate-800 border-slate-700 p-8 max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Error</h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <Button onClick={() => router.push('/play')} variant="outline" className="border-slate-600 text-slate-300">
            Back to Play
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/history" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-sm mb-2">
              <ChevronLeft className="w-4 h-4" /> Back to history
            </Link>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-cyan-400" />
              Game Analysis
            </h1>
          </div>
          {gameData && (
            <div className="text-right">
              <p className="text-sm text-slate-400">
                {gameData.white_username} vs {gameData.black_username}
              </p>
              <p className="text-sm font-bold text-white">{getResultLabel(gameData.result || '')}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Board + controls */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-2xl">
              <div className="w-full max-w-[560px] mx-auto">
                <div className="relative w-full aspect-square">
                  <Chessboard
                    id="analysis-board"
                    position={currentFen}
                    boardWidth={560}
                    arePiecesDraggable={false}
                    customBoardStyle={{
                      borderRadius: '0.75rem',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                    }}
                    customDarkSquareStyle={{ backgroundColor: '#b6b3aa' }}
                    customLightSquareStyle={{ backgroundColor: '#f0ede5' }}
                  />
                </div>
              </div>
            </div>

            {/* Replay controls */}
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="border-slate-600 text-slate-300 hover:text-white"
                onClick={() => setMoveIndex(0)}
                disabled={moveIndex <= 0}
              >
                <SkipBack className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="border-slate-600 text-slate-300 hover:text-white"
                onClick={() => setMoveIndex((i) => Math.max(0, i - 1))}
                disabled={moveIndex <= 0}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-slate-400 px-4 font-mono min-w-[80px] text-center">
                {moveIndex <= 0 ? 'Start' : `Move ${moveIndex}`}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="border-slate-600 text-slate-300 hover:text-white"
                onClick={() => setMoveIndex((i) => Math.min(positions.length - 1, i + 1))}
                disabled={moveIndex >= positions.length - 1}
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="border-slate-600 text-slate-300 hover:text-white"
                onClick={() => setMoveIndex(positions.length - 1)}
                disabled={moveIndex >= positions.length - 1}
              >
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>

            {/* Move list */}
            <Card className="bg-slate-800 border-slate-700 p-4">
              <h3 className="text-sm font-semibold text-white mb-3">Moves</h3>
              <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
                {moveList.map((move, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMoveIndex(idx + 1)}
                    className={`px-2 py-1 text-xs rounded font-mono transition-colors ${
                      moveIndex === idx + 1
                        ? 'bg-cyan-600 text-white'
                        : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    {idx % 2 === 0 ? `${Math.floor(idx / 2) + 1}. ` : ''}
                    {move}
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Analysis sidebar */}
          <div className="space-y-4">
            {/* AI Analysis */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-white flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-cyan-400" />
                    AI Coach Analysis
                  </div>
                  {analysis?.cached && (
                    <span className="text-[10px] bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded border border-slate-600 uppercase tracking-tighter">
                      Cached
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="min-h-[480px] flex flex-col justify-start">
                {analyzing ? (
                  <div className="flex flex-col items-center justify-center flex-1 space-y-4">
                    <div className="relative">
                      <div className="w-12 h-12 border-4 border-slate-700 border-t-cyan-500 rounded-full animate-spin"></div>
                      <BarChart3 className="w-5 h-5 text-cyan-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-white">Analyzing your game</p>
                      <p className="text-xs text-slate-500 mt-1">Bot is calculating best moves...</p>
                    </div>
                  </div>
                ) : analysis ? (
                  <div className="space-y-6 flex-1 animate-in fade-in duration-500">
                    {/* Summary */}
                    <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                      <h4 className="text-[10px] font-bold text-cyan-400 uppercase tracking-[0.2em] mb-2 opacity-80">Overview</h4>
                      <p className="text-sm text-slate-300 leading-relaxed italic">"{analysis.summary}"</p>
                    </div>

                    {/* Mistakes */}
                    <div className="flex flex-col flex-1">
                      <h4 className="text-[10px] font-bold text-amber-400 uppercase tracking-[0.2em] mb-3 opacity-80">
                        Critical Moments ({analysis.mistakes?.length || 0})
                      </h4>
                      {analysis.mistakes && analysis.mistakes.length > 0 ? (
                        <div className="space-y-3 overflow-y-auto pr-1 custom-scrollbar max-h-[300px]">
                          {analysis.mistakes.map((mistake, idx) => (
                            <div key={idx} className="p-3 bg-slate-900/40 rounded-lg border border-slate-700/30 hover:border-slate-600/50 transition-colors">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-white bg-slate-700 px-2 py-0.5 rounded">{mistake.move}</span>
                                {mistake.better_move && (
                                  <span className="text-[10px] text-emerald-400 font-mono font-bold">
                                    → {mistake.better_move}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-400 leading-relaxed">{mistake.comment}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex-1 flex items-center justify-center border border-dashed border-slate-700 rounded-lg py-8">
                          <p className="text-sm text-emerald-400">Great game! No major mistakes found.</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center border border-slate-700">
                      <BarChart3 className="w-6 h-6 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 mb-4">No analysis available for this game yet.</p>
                      <Button onClick={runAnalysis} className="w-full bg-cyan-600 hover:bg-cyan-700 shadow-lg shadow-cyan-900/20">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Run AI Analysis
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Game Details */}
            {gameData && (
              <Card className="bg-slate-800 border-slate-700 p-4">
                <h3 className="text-sm font-semibold text-white mb-3">Game Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">White:</span>
                    <span className="text-white font-medium">{gameData.white_username}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Black:</span>
                    <span className="text-white font-medium">{gameData.black_username}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Result:</span>
                    <span className="text-white font-medium">{getResultLabel(gameData.result)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Mode:</span>
                    <span className="text-white font-medium capitalize">{gameData.mode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Moves:</span>
                    <span className="text-white font-medium">{gameData.total_moves}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Played:</span>
                    <span className="text-white font-medium">
                      {new Date(gameData.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

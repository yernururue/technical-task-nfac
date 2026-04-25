'use client'

import { useEffect, useRef, useState } from 'react'

import { StockfishEngine, type StockfishLevel } from '@/lib/chess/stockfish'

interface UseStockfishResult {
  getAIMove: (fen: string, level: StockfishLevel) => Promise<string | null>
  isLoading: boolean
  error: string | null
}

export function useStockfish(enabled = true): UseStockfishResult {
  const engineRef = useRef<StockfishEngine | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled) {
      setIsLoading(false)
      setError(null)
      return
    }

    let isMounted = true
    const engine = new StockfishEngine()

    async function init(): Promise<void> {
      try {
        await engine.init()
        if (isMounted) {
          engineRef.current = engine
          setIsLoading(false)
          console.log('✓ Stockfish engine initialized')
        }
      } catch (err) {
        if (isMounted) {
          const msg = err instanceof Error ? err.message : 'Failed to init engine'
          console.error('✗ Stockfish init failed:', msg)
          setError(msg)
          setIsLoading(false)
        }
      }
    }

    void init()

    return () => {
      isMounted = false
      engine.terminate()
      engineRef.current = null
    }
  }, [enabled])

  const getAIMove = async (fen: string, level: StockfishLevel): Promise<string | null> => {
    if (!engineRef.current) {
      console.warn('Engine not ready')
      return null
    }

    try {
      const move = await engineRef.current.getBestMove(fen, level)
      console.log('AI move calculated:', move)
      return move
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Calculation failed'
      console.error('AI move error:', msg)
      setError(msg)
      return null
    }
  }

  return { getAIMove, isLoading, error }
}

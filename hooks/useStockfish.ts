// Stockfish hook placeholder for lifecycle and engine communication.
'use client'

import { useMemo } from 'react'

import { StockfishEngine } from '@/lib/chess/stockfish'

export function useStockfish(): { engine: StockfishEngine } {
  const engine = useMemo(() => new StockfishEngine(), [])

  return { engine }
}

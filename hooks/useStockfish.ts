'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

interface UseStockfishResult {
  getBestMove: (fen: string, depth?: number) => Promise<string | null>
  isReady: boolean
  error: string | null
}

const INIT_TIMEOUT_MS = 5_000
const MOVE_TIMEOUT_MS = 10_000

export function useStockfish(enabled: boolean = true): UseStockfishResult {
  const workerRef = useRef<Worker | null>(null)
  const isReadyRef = useRef(false)
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled) return

    let initTimer: ReturnType<typeof setTimeout> | null = null
    let disposed = false

    try {
      const worker = new Worker('/stockfish.js')
      workerRef.current = worker

      // Hard timeout: if uciok doesn't arrive in 5s, give up
      initTimer = setTimeout(() => {
        if (!isReadyRef.current && !disposed) {
          const msg = 'Stockfish init timeout: uciok not received within 5s'
          console.error('[Stockfish]', msg)
          setError(msg)
          // Don't leave loading state hanging
          setIsReady(false)
        }
      }, INIT_TIMEOUT_MS)

      const onMessage = (e: MessageEvent) => {
        const line: string = typeof e.data === 'string' ? e.data : ''

        if (line === 'uciok') {
          if (initTimer) clearTimeout(initTimer)
          isReadyRef.current = true
          setIsReady(true)
          setError(null)
          console.log('[Stockfish] Engine ready (uciok received)')
        }
      }

      const onError = (e: ErrorEvent) => {
        if (disposed) return
        const msg = `Worker error: ${e.message || 'unknown'}`
        console.error('[Stockfish]', msg)
        setError(msg)
        if (initTimer) clearTimeout(initTimer)
      }

      worker.addEventListener('message', onMessage)
      worker.addEventListener('error', onError)
      worker.postMessage('uci')

      return () => {
        disposed = true
        if (initTimer) clearTimeout(initTimer)
        worker.removeEventListener('message', onMessage)
        worker.removeEventListener('error', onError)
        worker.postMessage('quit')
        worker.terminate()
        workerRef.current = null
        isReadyRef.current = false
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to create Stockfish Worker'
      console.error('[Stockfish] Init error:', msg)
      setError(msg)
    }
  }, [enabled])

  const getBestMove = useCallback(
    (fen: string, depth: number = 10): Promise<string | null> => {
      return new Promise((resolve) => {
        const worker = workerRef.current
        if (!worker || !isReadyRef.current) {
          console.warn('[Stockfish] getBestMove called but worker not ready')
          resolve(null)
          return
        }

        let settled = false

        const onMessage = (e: MessageEvent) => {
          const line: string = typeof e.data === 'string' ? e.data : ''

          if (line.startsWith('bestmove')) {
            if (settled) return
            settled = true
            worker.removeEventListener('message', onMessage)
            // "bestmove e7e5 ponder d2d4" → extract "e7e5"
            const move = line.split(' ')[1] ?? null
            console.log('[Stockfish] Best move:', move)
            resolve(move === '(none)' ? null : move)
          }
        }

        worker.addEventListener('message', onMessage)
        worker.postMessage(`position fen ${fen}`)
        worker.postMessage(`go depth ${depth}`)

        // Safety timeout
        setTimeout(() => {
          if (settled) return
          settled = true
          worker.removeEventListener('message', onMessage)
          console.warn('[Stockfish] Move timeout, no bestmove in', MOVE_TIMEOUT_MS, 'ms')
          resolve(null)
        }, MOVE_TIMEOUT_MS)
      })
    },
    [],
  )

  return { getBestMove, isReady, error }
}

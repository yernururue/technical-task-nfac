'use client'

import { useMemo } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface MoveHistoryProps {
  pgn: string
  currentMove?: number
}

interface MovePair {
  moveNumber: number
  white?: string
  black?: string
}

const TAG_REGEX = /\[[^\]]*]/g
const COMMENT_REGEX = /\{[^}]*}/g
const RESULT_TOKENS = new Set(['1-0', '0-1', '1/2-1/2', '*'])

function parsePgnMoves(pgn: string): string[] {
  if (!pgn.trim()) {
    return []
  }

  return pgn
    .replace(TAG_REGEX, ' ')
    .replace(COMMENT_REGEX, ' ')
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 0)
    .filter((token) => !token.includes('.'))
    .filter((token) => !RESULT_TOKENS.has(token))
}

export function MoveHistory({ pgn, currentMove }: MoveHistoryProps): JSX.Element {
  const groupedMoves = useMemo<MovePair[]>(() => {
    const moves = parsePgnMoves(pgn)
    const pairs: MovePair[] = []
    for (let index = 0; index < moves.length; index += 2) {
      pairs.push({
        moveNumber: Math.floor(index / 2) + 1,
        white: moves[index],
        black: moves[index + 1],
      })
    }
    return pairs
  }, [pgn])

  return (
    <Card className="max-h-[420px]">
      <CardHeader>
        <CardTitle>Move History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 text-sm">
        {groupedMoves.length === 0 ? (
          <p className="text-muted-foreground">No moves yet.</p>
        ) : (
          groupedMoves.map((pair) => {
            const whiteIndex = (pair.moveNumber - 1) * 2
            const blackIndex = whiteIndex + 1
            return (
              <div key={pair.moveNumber} className="grid grid-cols-[2rem_1fr_1fr] items-center gap-2 rounded px-1 py-0.5">
                <span className="text-muted-foreground">{pair.moveNumber}.</span>
                <span className={currentMove === whiteIndex ? 'rounded bg-accent px-1 py-0.5 font-medium' : ''}>
                  {pair.white ?? '-'}
                </span>
                <span className={currentMove === blackIndex ? 'rounded bg-accent px-1 py-0.5 font-medium' : ''}>
                  {pair.black ?? '-'}
                </span>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}

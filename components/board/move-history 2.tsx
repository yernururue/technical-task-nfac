'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ListOrdered } from 'lucide-react'

interface MoveHistoryProps {
  pgn: string
  currentMove?: number
}

export function MoveHistory({ pgn, currentMove }: MoveHistoryProps) {
  return (
    <Card className="glass border-border bg-card/60 shadow-xl backdrop-blur-xl">
      <CardHeader className="pb-3 pt-4 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-semibold flex items-center gap-2 text-foreground">
          <ListOrdered className="h-4 w-4 text-primary" />
          Move History
        </CardTitle>
        {currentMove !== undefined && (
          <span className="text-xs text-muted-foreground">
            Move {currentMove}
          </span>
        )}
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-48 rounded-lg bg-secondary/50 border border-border">
          <div className="p-3">
            {pgn ? (
              <p className="text-xs font-mono text-muted-foreground leading-relaxed break-all">
                {pgn}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground italic">No moves yet</p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

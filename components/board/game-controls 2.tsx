'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RotateCcw, Flag, Handshake, Settings2 } from 'lucide-react'

interface GameControlsProps {
  onNewGame: () => void
  onOfferDraw?: () => void
  onResign?: () => void
  disabled?: boolean
}

export function GameControls({
  onNewGame,
  onOfferDraw,
  onResign,
  disabled = false,
}: GameControlsProps) {
  return (
    <Card className="glass border-border bg-card/60 shadow-xl backdrop-blur-xl">
      <CardHeader className="pb-3 pt-4 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-semibold flex items-center gap-2 text-foreground">
          <Settings2 className="h-4 w-4 text-primary" />
          Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button
          variant="outline"
          className="w-full justify-start gap-2 border-border text-foreground hover:bg-secondary"
          onClick={onNewGame}
        >
          <RotateCcw className="h-4 w-4" />
          New Game
        </Button>
        {onOfferDraw && (
          <Button
            variant="outline"
            className="w-full justify-start gap-2 border-border text-foreground hover:bg-secondary"
            onClick={onOfferDraw}
            disabled={disabled}
          >
            <Handshake className="h-4 w-4" />
            Offer Draw
          </Button>
        )}
        {onResign && (
          <Button
            variant="outline"
            className="w-full justify-start gap-2 border-destructive/50 text-destructive hover:bg-destructive/10"
            onClick={onResign}
            disabled={disabled}
          >
            <Flag className="h-4 w-4" />
            Resign
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

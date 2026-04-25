'use client'

import { Handshake, Flag, RotateCcw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface GameControlsProps {
  onNewGame: () => void
  onResign: () => void
  onOfferDraw: () => void
  disabled?: boolean
}

export function GameControls({
  onNewGame,
  onResign,
  onOfferDraw,
  disabled = false,
}: GameControlsProps): JSX.Element {
  return (
    <Card className="glass-card border-border/50 bg-background/60 shadow-xl backdrop-blur-xl">
      <CardHeader className="pb-3 pt-4">
        <CardTitle className="text-lg tracking-tight">Game Controls</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2">
        <Button onClick={onNewGame} type="button" variant="default" disabled={disabled} className="col-span-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow">
          <RotateCcw className="mr-2 h-4 w-4" />
          New Game
        </Button>
        <Button onClick={onResign} type="button" variant="destructive" disabled={disabled} className="shadow-lg shadow-destructive/20 hover:shadow-destructive/40 transition-shadow">
          <Flag className="mr-2 h-4 w-4" />
          Resign
        </Button>
        <Button onClick={onOfferDraw} type="button" variant="outline" disabled={disabled} className="border-border/50 bg-background/50 hover:bg-background/80 shadow-sm">
          <Handshake className="mr-2 h-4 w-4 text-amber-500" />
          Draw
        </Button>
      </CardContent>
    </Card>
  )
}

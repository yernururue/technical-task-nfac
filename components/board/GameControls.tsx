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
    <Card>
      <CardHeader>
        <CardTitle>Game Controls</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        <Button onClick={onNewGame} type="button" variant="default" disabled={disabled}>
          <RotateCcw className="size-4" />
          New Game
        </Button>
        <Button onClick={onResign} type="button" variant="destructive" disabled={disabled}>
          <Flag className="size-4" />
          Resign
        </Button>
        <Button onClick={onOfferDraw} type="button" variant="outline" disabled={disabled}>
          <Handshake className="size-4" />
          Offer Draw
        </Button>
      </CardContent>
    </Card>
  )
}

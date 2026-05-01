'use client'

import { Settings, Palette } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { BoardTheme, BOARD_THEMES } from './chess-board'
import { useProfile } from '@/hooks/useProfile'

export function BoardSettings() {
  const { boardTheme, updateBoardTheme } = useProfile()

  return (
    <Card className="glass-card border-border/50 bg-background/60 shadow-xl backdrop-blur-xl">
      <CardHeader className="pb-3 pt-4 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg flex items-center gap-2">
          <Settings className="h-5 w-5 text-slate-400" />
          Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Palette className="w-3 h-3" /> Board Theme
          </Label>
          <Select value={boardTheme} onValueChange={(v) => updateBoardTheme(v as BoardTheme)}>
            <SelectTrigger className="bg-black/40 border-white/10 h-10 rounded-xl text-xs">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border bg-slate-900/95 backdrop-blur-xl">
              <SelectItem value="default">Slate (Default)</SelectItem>
              <SelectItem value="classic">Staunton (Green)</SelectItem>
              <SelectItem value="wood">Warm Wood</SelectItem>
              <SelectItem value="metallic">Metallic Steel</SelectItem>
              <SelectItem value="dark">Lichess Blue</SelectItem>
              <SelectItem value="neon">Cyber Neon</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}

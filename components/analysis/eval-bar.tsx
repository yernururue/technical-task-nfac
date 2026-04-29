'use client'

import { memo } from 'react'
import { cn } from '@/lib/utils'

interface EvalBarProps {
  score: number // Normalized score (-10 to +10)
  mate?: number | null
  orientation?: 'white' | 'black'
  className?: string
}

export const EvalBar = memo(({ score, mate, orientation = 'white', className }: EvalBarProps) => {
  // Clamp score for visualization
  const displayScore = Math.max(-10, Math.min(10, score))
  
  // Calculate percentage (0% is black advantage, 100% is white advantage)
  // 50% is equal
  let percentage = ((displayScore + 10) / 20) * 100
  
  // If black orientation, flip the bar
  if (orientation === 'black') {
    percentage = 100 - percentage
  }

  // Format label
  let label = score.toFixed(1)
  if (mate !== null && mate !== undefined) {
    label = `M${Math.abs(mate)}`
  } else {
    label = score > 0 ? `+${label}` : label
  }

  return (
    <div className={cn("relative w-4 h-full bg-slate-900 rounded-full overflow-hidden border border-white/5 shadow-inner flex flex-col-reverse", className)}>
      {/* White bar */}
      <div 
        className="bg-slate-200 w-full transition-all duration-500 ease-out"
        style={{ height: `${percentage}%` }}
      />
      
      {/* Center line */}
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/20 z-10" />
      
      {/* Label */}
      <div className={cn(
        "absolute left-0 w-full text-[8px] font-bold text-center z-20 pointer-events-none drop-shadow-md transition-all duration-500",
        percentage > 50 ? "bottom-2 text-slate-900" : "top-2 text-slate-100"
      )}>
        {label}
      </div>
    </div>
  )
})

EvalBar.displayName = 'EvalBar'

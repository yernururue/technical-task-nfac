// Coach panel component placeholder for AI commentary output.
'use client'

import type { CoachResponse } from '@/types/analysis'

interface CoachPanelProps {
  data: CoachResponse | null
}

export function CoachPanel({ data }: CoachPanelProps): JSX.Element {
  return <aside>Coach panel placeholder: {data ? 'loaded' : 'empty'}.</aside>
}

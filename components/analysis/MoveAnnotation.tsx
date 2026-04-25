// Move annotation component placeholder showing move quality and comment.
'use client'

import type { MoveFeedback } from '@/types/analysis'

interface MoveAnnotationProps {
  feedback: MoveFeedback
}

export function MoveAnnotation({ feedback }: MoveAnnotationProps): JSX.Element {
  return (
    <article>
      {feedback.move_number}. {feedback.pgn_move} - {feedback.mistake_type}
    </article>
  )
}

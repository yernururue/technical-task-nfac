'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import type { GameResultDb } from '@/types/supabase'

export async function updateGamePgnAction(gameId: string, pgn: string) {
  const supabase = await createServerSupabaseClient()
  
  const { error } = await supabase
    .from('games')
    .update({ pgn })
    .eq('id', gameId)

  if (error) {
    console.error('Failed to update PGN:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

export async function finalizeGameAction(gameId: string, pgn: string, result: string) {
  const supabase = await createServerSupabaseClient()
  
  const { error } = await supabase
    .from('games')
    .update({ 
      pgn,
      result: result as GameResultDb,
      finished_at: new Date().toISOString()
    })
    .eq('id', gameId)

  if (error) {
    console.error('Failed to finalize game:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}

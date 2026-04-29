'use server'

import { createClient } from '@supabase/supabase-js'
import type { GameResultDb } from '@/types/supabase'

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('Missing Supabase env vars (URL or SERVICE_ROLE_KEY)')
  }
  return createClient(url, key)
}

export async function updateGamePgnAction(gameId: string, pgn: string) {
  const supabaseAdmin = getServiceClient()
  
  const { error } = await supabaseAdmin
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
  const supabaseAdmin = getServiceClient()
  
  const { error } = await supabaseAdmin
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

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
  
  // 1. Fetch game details to get player IDs and mode
  const { data: game, error: fetchError } = await supabaseAdmin
    .from('games')
    .select('white_id, black_id, mode')
    .eq('id', gameId)
    .single()

  if (fetchError || !game) {
    console.error('Failed to fetch game for finalization:', fetchError)
    return { success: false, error: fetchError?.message || 'Game not found' }
  }

  // 2. Update the game record
  const { error: updateError } = await supabaseAdmin
    .from('games')
    .update({ 
      pgn,
      result: result as GameResultDb,
      finished_at: new Date().toISOString()
    })
    .eq('id', gameId)

  if (updateError) {
    console.error('Failed to finalize game:', updateError)
    return { success: false, error: updateError.message }
  }

  // 3. Update ratings if it's a multiplayer match
  if (game.mode === 'multiplayer') {
    const { white_id, black_id } = game
    const ratingChange = 20

    // Helper to update player profile
    const updateProfile = async (playerId: string, isWinner: boolean, isDraw: boolean) => {
      // Fetch current profile stats
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('rating, games_played, wins, losses, draws')
        .eq('id', playerId)
        .single()
      
      if (profileError || !profile) {
        console.error(`Failed to fetch profile for player ${playerId}:`, profileError)
        return
      }

      let newRating = profile.rating
      if (!isDraw) {
        newRating = isWinner ? profile.rating + ratingChange : Math.max(0, profile.rating - ratingChange)
      }

      const { error: profileUpdateError } = await supabaseAdmin
        .from('profiles')
        .update({
          rating: newRating,
          games_played: profile.games_played + 1,
          wins: isWinner ? profile.wins + 1 : profile.wins,
          losses: (!isWinner && !isDraw) ? profile.losses + 1 : profile.losses,
          draws: isDraw ? profile.draws + 1 : profile.draws,
          updated_at: new Date().toISOString()
        })
        .eq('id', playerId)

      if (profileUpdateError) {
        console.error(`Failed to update profile for player ${playerId}:`, profileUpdateError)
      }
    }

    if (white_id) {
      await updateProfile(white_id, result === 'white', result === 'draw')
    }
    if (black_id) {
      await updateProfile(black_id, result === 'black', result === 'draw')
    }
  }

  return { success: true }
}

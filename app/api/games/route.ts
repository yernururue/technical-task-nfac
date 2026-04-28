import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

import type { GameResultDb, GameModeDb } from '@/types/supabase'

// Use service role client to bypass RLS — games can be saved by anonymous players
function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error('Missing Supabase env vars (URL or SERVICE_ROLE_KEY)')
  }

  return createClient(url, key)
}

interface SaveGameBody {
  pgn: string
  result: string
  mode: 'local' | 'ai' | 'multiplayer'
  white_username: string
  black_username: string
  total_moves: number
  ai_level?: number | null
  white_id?: string | null
  black_id?: string | null
}

/** POST — save a finished game */
export async function POST(request: Request): Promise<Response> {
  try {
    const body = (await request.json()) as SaveGameBody
    const { pgn, result, mode, white_username, black_username, total_moves, ai_level, white_id, black_id } = body

    if (!pgn && total_moves > 0) {
      return NextResponse.json({ error: 'PGN is required for games with moves' }, { status: 400 })
    }

    if (!result || !mode) {
      return NextResponse.json({ error: 'result and mode are required' }, { status: 400 })
    }

    const supabase = getServiceClient()

    const insertData = {
      pgn: pgn || '',
      result: result as GameResultDb,
      mode: mode as GameModeDb,
      white_username: white_username || 'White',
      black_username: black_username || 'Black',
      total_moves: total_moves || 0,
      ai_level: ai_level ?? null,
      white_id: white_id ?? null,
      black_id: black_id ?? null,
      room_id: null,
      duration_seconds: null,
      time_control: null,
      opening_name: null,
      metadata: {},
      finished_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('games')
      .insert(insertData)
      .select('id')
      .single()

    if (error) {
      console.error('[API /games POST] Supabase insert error:', error)
      return NextResponse.json({ error: 'Failed to save game', details: error.message }, { status: 500 })
    }

    return NextResponse.json({ id: data.id })
  } catch (err) {
    console.error('[API /games POST] Unexpected error:', err)
    return NextResponse.json(
      { error: 'Internal server error', details: err instanceof Error ? err.message : 'Unknown' },
      { status: 500 },
    )
  }
}

/** GET — list recent games (optionally filtered by user) */
export async function GET(request: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Math.min(Number(searchParams.get('limit') || '20'), 50)
    const userId = searchParams.get('user_id')
    const gameId = searchParams.get('game_id')

    const supabase = getServiceClient()

    // Single game fetch by ID
    if (gameId) {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('id', gameId)
        .limit(1)

      if (error) {
        console.error('[API /games GET] Single game error:', error)
        return NextResponse.json({ error: 'Game not found', details: error.message }, { status: 404 })
      }

      return NextResponse.json({ games: data ?? [] })
    }

    let query = supabase
      .from('games')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (userId) {
      query = query.or(`white_id.eq.${userId},black_id.eq.${userId}`)
    }

    const { data, error } = await query

    if (error) {
      console.error('[API /games GET] Supabase query error:', error)
      return NextResponse.json({ error: 'Failed to fetch games', details: error.message }, { status: 500 })
    }

    return NextResponse.json({ games: data ?? [] })
  } catch (err) {
    console.error('[API /games GET] Unexpected error:', err)
    return NextResponse.json(
      { error: 'Internal server error', details: err instanceof Error ? err.message : 'Unknown' },
      { status: 500 },
    )
  }
}

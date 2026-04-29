import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient()
    
    const { data, error } = await supabase
      .from('profiles')
      .select('username, rating, games_played, wins')
      .order('rating', { ascending: false })
      .limit(50)

    if (error) throw error

    return NextResponse.json({ entries: data })
  } catch (err: any) {
    console.error('[API Leaderboard] Error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

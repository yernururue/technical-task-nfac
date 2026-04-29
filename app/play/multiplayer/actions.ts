'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('Missing Supabase env vars (URL or SERVICE_ROLE_KEY)')
  }
  return createClient(url, key)
}

export async function getPlayerIdAction() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    return { id: user.id, isAnon: false }
  }

  const cookieStore = await cookies()
  const anonCookie = cookieStore.get('anon_player_id')

  if (anonCookie) {
    return { id: anonCookie.value, isAnon: true }
  }

  const newAnonId = crypto.randomUUID()
  cookieStore.set('anon_player_id', newAnonId, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7 })
  return { id: newAnonId, isAnon: true }
}

export async function createRoomAction() {
  const player = await getPlayerIdAction()
  const playerId = player.id
  const supabaseAdmin = getServiceClient()
  const roomId = crypto.randomUUID()

  const { error } = await supabaseAdmin
    .from('rooms')
    .insert({
      id: roomId,
      host_id: playerId,
      status: 'waiting',
      host_color: 'white',
    })

  if (error) {
    console.error('Error creating room:', error)
    throw new Error('Failed to create room.')
  }

  redirect(`/play/multiplayer/${roomId}`)
}

export async function joinRoomAction(roomId: string) {
  const player = await getPlayerIdAction()
  const playerId = player.id
  const supabaseAdmin = getServiceClient()

  // Fetch the room
  const { data: room, error: fetchError } = await supabaseAdmin
    .from('rooms')
    .select('*')
    .eq('id', roomId)
    .single()

  if (fetchError || !room) {
    throw new Error('Room not found.')
  }

  // If already active or finished, or if user is the host
  if (room.host_id === playerId) {
    // Host is just viewing their own room
    return { success: true, room }
  }

  if (room.status !== 'waiting') {
    if (room.guest_id === playerId) {
       // Guest is already in the room
       return { success: true, room }
    }
    throw new Error('Room is no longer available.')
  }

  // Check if host is valid authenticated user
  let validHostId: string | null = null
  if (room.host_id) {
    const { data: hostProfile } = await supabaseAdmin.from('profiles').select('id').eq('id', room.host_id).single()
    if (hostProfile) validHostId = room.host_id
  }

  // Check if guest is valid authenticated user
  let validGuestId: string | null = null
  const { data: guestProfile } = await supabaseAdmin.from('profiles').select('id').eq('id', playerId).single()
  if (guestProfile) validGuestId = playerId

  const finalWhiteId = room.host_color === 'white' ? validHostId : validGuestId
  const finalBlackId = room.host_color === 'black' ? validHostId : validGuestId

  // Generate names
  const whiteUsername = room.host_color === 'white' ? 'Player 1' : 'Guest-' + playerId.substring(0,4)
  const blackUsername = room.host_color === 'black' ? 'Player 1' : 'Guest-' + playerId.substring(0,4)

  // 1. Create a game record
  const { data: game, error: gameError } = await supabaseAdmin
    .from('games')
    .insert({
      white_id: finalWhiteId,
      black_id: finalBlackId,
      white_username: validHostId === finalWhiteId ? 'Player 1' : whiteUsername,
      black_username: validHostId === finalBlackId ? 'Player 1' : blackUsername,
      mode: 'multiplayer',
      room_id: roomId,
      pgn: '',
    })
    .select('id')
    .single()

  if (gameError || !game) {
    console.error('Error creating game:', gameError)
    throw new Error('Failed to create game.')
  }

  // 2. Update room status to active
  const { error: updateError } = await supabaseAdmin
    .from('rooms')
    .update({
      guest_id: playerId,
      game_id: game.id,
      status: 'active'
    })
    .eq('id', roomId)

  if (updateError) {
    console.error('Error updating room:', updateError)
    throw new Error('Failed to join room.')
  }

  return { success: true, room: { ...room, status: 'active', guest_id: playerId, game_id: game.id } }
}

'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import crypto from 'crypto'

export async function createRoomAction() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('You must be logged in to create a room.')
  }

  const roomId = crypto.randomUUID()

  const { error } = await supabase
    .from('rooms')
    .insert({
      id: roomId,
      host_id: user.id,
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
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('You must be logged in to join a room.')
  }

  // Fetch the room
  const { data: room, error: fetchError } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', roomId)
    .single()

  if (fetchError || !room) {
    throw new Error('Room not found.')
  }

  // If already active or finished, or if user is the host
  if (room.host_id === user.id) {
    // Host is just viewing their own room
    return { success: true, room }
  }

  if (room.status !== 'waiting') {
    if (room.guest_id === user.id) {
       // Guest is already in the room
       return { success: true, room }
    }
    throw new Error('Room is no longer available.')
  }

  // We are a guest joining a waiting room
  // 1. Create a game record
  const { data: game, error: gameError } = await supabase
    .from('games')
    .insert({
      white_id: room.host_color === 'white' ? room.host_id : user.id,
      black_id: room.host_color === 'black' ? room.host_id : user.id,
      white_username: 'Player 1', // We should ideally fetch usernames, but we can set defaults or trigger them
      black_username: 'Player 2',
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
  const { error: updateError } = await supabase
    .from('rooms')
    .update({
      guest_id: user.id,
      game_id: game.id,
      status: 'active'
    })
    .eq('id', roomId)

  if (updateError) {
    console.error('Error updating room:', updateError)
    throw new Error('Failed to join room.')
  }

  return { success: true, room: { ...room, status: 'active', guest_id: user.id, game_id: game.id } }
}

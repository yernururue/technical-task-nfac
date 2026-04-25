// Supabase Realtime helper placeholders for multiplayer event broadcasting.
import type { RealtimeChannel } from '@supabase/supabase-js'

interface BroadcastPayload {
  event: string
  roomId: string
  payload: Record<string, unknown>
}

export async function broadcastRoomEvent(
  channel: RealtimeChannel,
  data: BroadcastPayload,
): Promise<'ok' | 'timed out' | 'error'> {
  return channel.send({ type: 'broadcast', event: data.event, payload: data })
}

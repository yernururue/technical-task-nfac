// Multiplayer hook placeholder for Supabase Realtime room synchronization.
'use client'

interface MultiplayerState {
  roomId: string | null
  isConnected: boolean
}

export function useMultiplayer(roomId: string | null): MultiplayerState {
  return {
    roomId,
    isConnected: false,
  }
}

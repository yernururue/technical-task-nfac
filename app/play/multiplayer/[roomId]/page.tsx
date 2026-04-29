'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { joinRoomAction, getPlayerIdAction } from '../actions'
import { Button } from '@/components/ui/button'
import { Copy, Loader2, CheckCircle2, Swords } from 'lucide-react'
import { toast } from 'sonner'
import type { RoomRow } from '@/types/supabase'

export default function RoomPage({ params }: { params: { roomId: string } }) {
  const router = useRouter()
  const roomId = params.roomId
  
  const [room, setRoom] = useState<RoomRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  useEffect(() => {
    let active = true;
    const supabase = createClient()
    let channel: ReturnType<typeof supabase.channel> | null = null;

    const initializeRoom = async () => {
      try {
        const player = await getPlayerIdAction()
        setCurrentUserId(player.id)

        // Try to join the room
        const result = await joinRoomAction(roomId)
        if (result.success && result.room) {
          setRoom(result.room as RoomRow)
        }
        
        if (!active) return

        // Setup realtime subscription
        channel = supabase.channel(`room:${roomId}`)
        channel
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'rooms',
              filter: `id=eq.${roomId}`
            },
            (payload) => {
              const updatedRoom = payload.new as RoomRow
              setRoom(updatedRoom)
            }
          )
          .subscribe()

      } catch (err: any) {
        console.error('Room initialization error:', err)
        if (active) {
          setError(err.message || 'Failed to load room')
          toast.error(err.message || 'Failed to load room')
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    initializeRoom()

    return () => {
      active = false;
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [roomId, router])

  // Redirect to game if active
  useEffect(() => {
    if (room?.status === 'active' && room?.game_id) {
      // Small delay to let the UI show "Game starting..."
      const timer = setTimeout(() => {
        router.push(`/play/multiplayer/${roomId}/game`)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [room?.status, room?.game_id, roomId, router])

  const copyInviteLink = () => {
    const url = `${window.location.origin}/play/multiplayer/${roomId}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    toast.success('Invite link copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <h2 className="text-xl font-bold">Loading Room...</h2>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-destructive/20 text-destructive flex items-center justify-center mb-4">
          <Swords className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-destructive">Error</h2>
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={() => router.push('/play')} className="rounded-full">
          Back to Play
        </Button>
      </div>
    )
  }

  const isHost = room?.host_id === currentUserId
  const isGameStarting = room?.status === 'active'

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full glass rounded-[2rem] p-8 border border-white/5 relative z-10 text-center space-y-8">
        
        {isGameStarting ? (
          <div className="space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center text-emerald-400 animate-pulse">
              <Swords className="w-12 h-12" />
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tight mb-2">Game Starting!</h2>
              <p className="text-muted-foreground font-medium">Preparing the board...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 relative">
                <Loader2 className="absolute inset-0 m-auto w-12 h-12 animate-spin opacity-20" />
                <Swords className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-2">Waiting for Opponent</h2>
                <p className="text-sm text-muted-foreground">
                  {isHost 
                    ? "Share the link below with a friend to start playing." 
                    : "Waiting for the host to be ready..."}
                </p>
              </div>
            </div>

            {isHost && (
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground text-left ml-2">
                  Invite Link
                </div>
                <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-full p-2 pl-6">
                  <div className="flex-1 truncate text-sm font-medium text-muted-foreground select-all">
                    {typeof window !== 'undefined' ? `${window.location.origin}/play/multiplayer/${roomId}` : ''}
                  </div>
                  <Button 
                    size="sm"
                    className={`rounded-full shrink-0 transition-all ${
                      copied ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-white hover:bg-gray-200 text-black'
                    }`}
                    onClick={copyInviteLink}
                  >
                    {copied ? <CheckCircle2 className="w-4 h-4 mr-1.5" /> : <Copy className="w-4 h-4 mr-1.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}

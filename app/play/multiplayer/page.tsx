'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Globe, Plus, Loader2 } from 'lucide-react'
import { createRoomAction } from './actions'
import { toast } from 'sonner'

export default function MultiplayerLobby() {
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateRoom = async () => {
    try {
      setIsCreating(true)
      await createRoomAction()
    } catch (error: any) {
      toast.error(error.message || 'Failed to create room')
      setIsCreating(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 flex items-center justify-center p-6 pt-24">
      <div className="max-w-md w-full glass rounded-[2rem] p-8 border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 opacity-5">
          <Globe className="w-48 h-48" />
        </div>
        
        <div className="relative z-10 text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-6 shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)]">
            <Globe className="w-10 h-10" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tight">Online Arena</h1>
            <p className="text-muted-foreground font-medium">
              Create a room and share the invite link to play with a friend.
            </p>
          </div>

          <div className="pt-8">
            <Button 
              onClick={handleCreateRoom} 
              disabled={isCreating}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-full py-6 font-bold text-lg shadow-lg shadow-purple-500/20 transition-all hover:scale-105"
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 w-5 h-5 animate-spin" /> Creating...
                </>
              ) : (
                <>
                  Create Room <Plus className="ml-2 w-5 h-5" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

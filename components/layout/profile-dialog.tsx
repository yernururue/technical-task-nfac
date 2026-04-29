'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { createClient } from '@/lib/supabase/client'
import { User, Trophy, SwatchBook, Target, Calendar, ShieldCheck, Edit2, Check, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import type { Database } from '@/types/supabase'

interface Profile {
  username: string
  avatar_url: string | null
  rating: number
  games_played: number
  wins: number
  losses: number
  draws: number
  is_pro: boolean
  created_at: string
}

interface ProfileDialogProps {
  userId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProfileDialog({ userId, open, onOpenChange }: ProfileDialogProps) {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editedUsername, setEditedUsername] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  
  const supabase = createClient() as any

  useEffect(() => {
    if (!open || !userId) return

    const fetchProfile = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (data) {
        setProfile(data)
        setEditedUsername(data.username)
      }
      setLoading(false)
    }

    fetchProfile()
  }, [userId, open, supabase])

  const handleSave = async () => {
    if (!profile || !userId) return
    const newUsername = editedUsername.trim()
    
    if (newUsername === '') {
      toast.error('Username cannot be empty')
      return
    }

    if (newUsername === profile.username) {
      setIsEditing(false)
      return
    }

    // Capture previous state for rollback
    const previousUsername = profile.username

    // 1. Optimistic Update: Update UI instantly
    setProfile({ ...profile, username: newUsername })
    setIsEditing(false)
    toast.info('Updating profile...')

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ username: newUsername })
        .eq('id', userId)

      if (error) throw error

      toast.success('Profile updated successfully')
      router.refresh()
    } catch (err) {
      console.error('[Profile] Save error:', err)
      
      // 2. Rollback: If DB sync fails, revert UI state
      setProfile({ ...profile, username: previousUsername })
      setEditedUsername(previousUsername)
      toast.error('Failed to sync profile change. Reverting...')
    }
  }

  if (!profile && !loading) return null

  const winRate = profile ? Math.round((profile.wins / (profile.games_played || 1)) * 100) : 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-card border-border p-0 overflow-hidden rounded-[2rem]">
        <div className="relative h-32 bg-gradient-to-r from-emerald-500 to-cyan-500">
          <div className="absolute -bottom-12 left-8 p-1 rounded-[2rem] bg-card">
            <div className="w-24 h-24 rounded-[1.8rem] bg-secondary flex items-center justify-center border-4 border-card">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.username} className="w-full h-full rounded-[1.8rem] object-cover" />
              ) : (
                <User className="w-12 h-12 text-muted-foreground" />
              )}
            </div>
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
            {profile?.is_pro && (
              <Badge className="bg-white/20 hover:bg-white/30 backdrop-blur-md border-white/20 text-white gap-1 px-3 py-1">
                <ShieldCheck className="w-3 h-3" /> PRO
              </Badge>
            )}
            <Button
              size="icon"
              variant="ghost"
              className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white border border-white/10"
              onClick={() => {
                if (isEditing) {
                  setIsEditing(false)
                  setEditedUsername(profile?.username || '')
                } else {
                  setIsEditing(true)
                }
              }}
            >
              {isEditing ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <div className="pt-16 px-8 pb-8 space-y-6">
          <div className="space-y-3">
            {isEditing ? (
              <div className="flex gap-2">
                <Input
                  value={editedUsername}
                  onChange={(e) => setEditedUsername(e.target.value)}
                  className="bg-secondary/50 border-border h-12 px-4 rounded-xl font-bold text-xl"
                  placeholder="Enter username"
                  autoFocus
                />
                <Button
                  size="icon"
                  className="h-12 w-12 rounded-xl bg-primary text-primary-foreground"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  <Check className="w-6 h-6" />
                </Button>
              </div>
            ) : (
              <h2 className="text-3xl font-black text-foreground tracking-tight">
                {profile?.username || 'Chess Player'}
              </h2>
            )}
            <div className="flex items-center gap-2 text-muted-foreground font-medium">
              <Calendar className="w-4 h-4" />
              <span>Joined {profile ? new Date(profile.created_at).toLocaleDateString() : '...'}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="glass p-5 rounded-2xl border-emerald-500/10 space-y-1">
              <div className="text-xs font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                <Trophy className="w-3 h-3" /> Rating
              </div>
              <div className="text-3xl font-black text-foreground">{profile?.rating || 1200}</div>
            </div>
            <div className="glass p-5 rounded-2xl border-cyan-500/10 space-y-1">
              <div className="text-xs font-bold text-cyan-500 uppercase tracking-widest flex items-center gap-2">
                <Target className="w-3 h-3" /> Win Rate
              </div>
              <div className="text-3xl font-black text-foreground">{winRate}%</div>
            </div>
          </div>

          <Separator className="bg-border/50" />

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-black text-foreground">{profile?.wins || 0}</div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Wins</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-black text-foreground">{profile?.draws || 0}</div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Draws</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-black text-foreground">{profile?.losses || 0}</div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Losses</div>
            </div>
          </div>

          <div className="glass p-6 rounded-3xl border-primary/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <SwatchBook className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm font-bold text-foreground">Total Games</div>
                <div className="text-xs text-muted-foreground font-medium">Lifetime statistics</div>
              </div>
            </div>
            <div className="text-2xl font-black text-foreground">{profile?.games_played || 0}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { createClient } from '@/lib/supabase/client'
import { User, Trophy, SwatchBook, Target, Calendar, ShieldCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

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
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

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
      }
      setLoading(false)
    }

    fetchProfile()
  }, [userId, open, supabase])

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
          {profile?.is_pro && (
            <div className="absolute top-4 right-4">
              <Badge className="bg-white/20 hover:bg-white/30 backdrop-blur-md border-white/20 text-white gap-1 px-3 py-1">
                <ShieldCheck className="w-3 h-3" /> PRO
              </Badge>
            </div>
          )}
        </div>

        <div className="pt-16 px-8 pb-8 space-y-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-foreground tracking-tight">
              {profile?.username || 'Chess Player'}
            </h2>
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

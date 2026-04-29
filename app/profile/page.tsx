'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { User, Trophy, Target, Calendar, Edit2, Save, SwatchBook, MapPin, Map, Image as ImageIcon, BarChart3, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { Database } from '@/types/supabase'

interface Profile {
  id: string
  username: string
  avatar_url: string | null
  rating: number
  games_played: number
  wins: number
  losses: number
  draws: number
  country: string | null
  city: string | null
  is_pro: boolean
  preferences: {
    boardTheme?: string
    pieceStyle?: string
  } | null
  created_at: string
}

export default function ProfilePage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  // Form state
  const [username, setUsername] = useState('')
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [boardTheme, setBoardTheme] = useState('default')
  const [pieceStyle, setPieceStyle] = useState('default')

  useEffect(() => {
    const initProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/auth/login')
        return
      }

      setUserId(session.user.id)

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (data) {
        const typedData = data as any // cast safely below
        setProfile(typedData)
        setUsername(typedData.username || '')
        setCountry(typedData.country || '')
        setCity(typedData.city || '')
        setAvatarUrl(typedData.avatar_url || '')
        
        const prefs = typedData.preferences || {}
        setBoardTheme(prefs.boardTheme || 'default')
        setPieceStyle(prefs.pieceStyle || 'default')
      }
      setLoading(false)
    }

    initProfile()
  }, [supabase, router])

  const handleSave = async () => {
    if (!profile || !userId) return
    if (username.trim() === '') {
      toast.error('Username cannot be empty')
      return
    }

    setIsSaving(true)
    try {
      const updatedPreferences = {
        ...(profile.preferences as Record<string, any> || {}),
        boardTheme,
        pieceStyle,
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          username: username.trim(),
          country: country.trim() || null,
          city: city.trim() || null,
          avatar_url: avatarUrl.trim() || null,
          preferences: updatedPreferences as any,
        })
        .eq('id', userId)

      if (error) throw error

      setProfile({
        ...profile,
        username: username.trim(),
        country: country.trim() || null,
        city: city.trim() || null,
        avatar_url: avatarUrl.trim() || null,
        preferences: updatedPreferences,
      })
      
      toast.success('Profile updated successfully')
      router.refresh()
    } catch (err) {
      console.error('[Profile] Save error:', err)
      toast.error('Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="pt-28 pb-12 px-6 max-w-7xl mx-auto flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-24 h-24 bg-card rounded-full"></div>
          <div className="h-8 w-48 bg-card rounded-xl"></div>
          <div className="h-4 w-32 bg-card rounded-xl"></div>
        </div>
      </div>
    )
  }

  if (!profile) return null

  const winRate = profile.games_played > 0 
    ? Math.round((profile.wins / profile.games_played) * 100) 
    : 0

  return (
    <div className="pt-28 pb-12 px-6 max-w-7xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start bg-card/50 backdrop-blur-xl p-8 rounded-3xl border border-border">
        <div className="w-32 h-32 rounded-[2rem] bg-secondary flex items-center justify-center border-4 border-card overflow-hidden shrink-0">
          {avatarUrl ? (
            <img src={avatarUrl} alt={username} className="w-full h-full object-cover" />
          ) : (
            <User className="w-16 h-16 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 text-center md:text-left space-y-3">
          <h1 className="text-4xl font-black text-foreground tracking-tight">{username || 'Player'}</h1>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-muted-foreground font-medium">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Joined {new Date(profile.created_at).toLocaleDateString()}</span>
            </div>
            {(city || country) && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{[city, country].filter(Boolean).join(', ')}</span>
              </div>
            )}
          </div>
        </div>
        <div className="shrink-0 flex gap-4">
          <div className="text-center bg-card p-4 rounded-2xl border border-border shadow-sm">
            <div className="text-xs font-bold text-emerald-500 uppercase tracking-widest flex items-center justify-center gap-2 mb-1">
              <Trophy className="w-3 h-3" /> Rating
            </div>
            <div className="text-3xl font-black text-foreground">{profile.rating}</div>
          </div>
          <div className="text-center bg-card p-4 rounded-2xl border border-border shadow-sm">
            <div className="text-xs font-bold text-cyan-500 uppercase tracking-widest flex items-center justify-center gap-2 mb-1">
              <Target className="w-3 h-3" /> Win Rate
            </div>
            <div className="text-3xl font-black text-foreground">{winRate}%</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Stats */}
        <div className="space-y-8">
          <Card className="bg-card/50 backdrop-blur-xl border-border rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Match Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-1 bg-secondary/50 p-4 rounded-2xl">
                  <div className="text-2xl font-black text-emerald-500">{profile.wins}</div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Wins</div>
                </div>
                <div className="space-y-1 bg-secondary/50 p-4 rounded-2xl">
                  <div className="text-2xl font-black text-foreground">{profile.draws}</div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Draws</div>
                </div>
                <div className="space-y-1 bg-secondary/50 p-4 rounded-2xl">
                  <div className="text-2xl font-black text-destructive">{profile.losses}</div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Losses</div>
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <SwatchBook className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-foreground">Total Games</div>
                    <div className="text-xs text-muted-foreground font-medium">Lifetime statistics</div>
                  </div>
                </div>
                <div className="text-2xl font-black text-foreground">{profile.games_played}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Forms */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-card/50 backdrop-blur-xl border-border rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-primary" />
                Edit Profile
              </CardTitle>
              <CardDescription>Update your personal information and avatar.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-secondary/50 h-12 rounded-xl"
                  placeholder="Enter your username"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <Map className="w-3 h-3" /> Country
                  </Label>
                  <Input
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="bg-secondary/50 h-12 rounded-xl"
                    placeholder="E.g. United States"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <MapPin className="w-3 h-3" /> City
                  </Label>
                  <Input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="bg-secondary/50 h-12 rounded-xl"
                    placeholder="E.g. New York"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="avatarUrl" className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <ImageIcon className="w-3 h-3" /> Avatar URL
                </Label>
                <Input
                  id="avatarUrl"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="bg-secondary/50 h-12 rounded-xl"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-xl border-border rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                Preferences
              </CardTitle>
              <CardDescription>Customize your gameplay experience.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Board Theme</Label>
                  <Select value={boardTheme} onValueChange={setBoardTheme}>
                    <SelectTrigger className="bg-secondary/50 h-12 rounded-xl">
                      <SelectValue placeholder="Select a theme" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border bg-card/95 backdrop-blur-xl">
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="wood">Wood</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="neon">Neon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Piece Style</Label>
                  <Select value={pieceStyle} onValueChange={setPieceStyle}>
                    <SelectTrigger className="bg-secondary/50 h-12 rounded-xl">
                      <SelectValue placeholder="Select a style" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border bg-card/95 backdrop-blur-xl">
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="classic">Classic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="flex justify-end">
                <Button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="h-12 px-8 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


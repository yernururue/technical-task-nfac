'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { BoardTheme } from '@/components/board/chess-board'

interface ProfilePreferences {
  boardTheme?: BoardTheme
  pieceStyle?: string
}

interface Profile {
  id: string
  username: string
  avatar_url: string | null
  rating: number
  preferences: ProfilePreferences | null
}

export function useProfile() {
  const supabase = createClient()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [localTheme, setLocalTheme] = useState<BoardTheme>('default')

  const fetchProfile = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (error) {
        console.warn('[useProfile] Error fetching profile:', error.message)
      } else if (data) {
        setProfile(data as any)
      }
    } catch (err) {
      console.error('[useProfile] fetchProfile error:', err)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  // Hydration from localStorage - SSR Safe
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('chess-board-theme') as BoardTheme
      if (storedTheme) {
        setLocalTheme(storedTheme)
      }
    }
    fetchProfile()
  }, [fetchProfile])

  // Realtime subscription
  useEffect(() => {
    let channel: any = null

    const setupSubscription = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      channel = supabase
        .channel(`profile-updates-${session.user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${session.user.id}`,
          },
          (payload) => {
            console.log('[useProfile] Realtime update received:', payload.new)
            setProfile(payload.new as Profile)
          }
        )
        .subscribe()
    }

    setupSubscription()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [supabase])

  const updateBoardTheme = async (theme: BoardTheme) => {
    // 1. Immediate UI update (Local state)
    setLocalTheme(theme)
    
    // 2. LocalStorage persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('chess-board-theme', theme)
    }

    // 3. Database persistence (if authenticated)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const newPrefs = {
      ...(profile?.preferences || {}),
      boardTheme: theme
    }

    // Optimistic profile update
    if (profile) {
      setProfile({ ...profile, preferences: newPrefs })
    }

    try {
      const { error } = await (supabase.from('profiles') as any)
        .update({ preferences: newPrefs })
        .eq('id', session.user.id)
      
      if (error) throw error
    } catch (err) {
      console.error('[useProfile] DB update error:', err)
    }
  }

  const updatePieceStyle = async (style: string) => {
    // 1. LocalStorage persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('chess-piece-style', style)
    }

    // 2. Database persistence (if authenticated)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const newPrefs = {
      ...(profile?.preferences || {}),
      pieceStyle: style
    }

    // Optimistic profile update
    if (profile) {
      setProfile({ ...profile, preferences: newPrefs })
    }

    try {
      const { error } = await (supabase.from('profiles') as any)
        .update({ preferences: newPrefs })
        .eq('id', session.user.id)
      
      if (error) throw error
    } catch (err) {
      console.error('[useProfile] DB update error (pieceStyle):', err)
    }
  }

  // Priority: Authenticated Preference > LocalStorage Guest Preference > Default
  const currentTheme = (profile?.preferences?.boardTheme as BoardTheme) || localTheme

  return {
    profile,
    loading,
    boardTheme: currentTheme,
    pieceStyle: profile?.preferences?.pieceStyle || 'default',
    updateBoardTheme,
    updatePieceStyle,
    refreshProfile: fetchProfile
  }
}

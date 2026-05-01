'use client'

import { useEffect, useState } from 'react'
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

  useEffect(() => {
    const fetchProfile = async () => {
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

      if (data) {
        setProfile(data as any)
      }
      setLoading(false)
    }

    fetchProfile()
  }, [supabase])

  return {
    profile,
    loading,
    boardTheme: profile?.preferences?.boardTheme || 'default',
    pieceStyle: profile?.preferences?.pieceStyle || 'default',
  }
}

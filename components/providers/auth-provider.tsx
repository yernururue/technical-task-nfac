'use client'

import { ReactNode } from 'react'

export interface AuthContextType {
  user: { id: string; email: string } | null
  loading: boolean
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Placeholder auth provider - will be connected to Supabase when integration is added
  return <>{children}</>
}

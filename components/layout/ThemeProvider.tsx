// Theme provider placeholder wrapping app children with theme context.
'use client'

import type { ReactNode } from 'react'

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps): JSX.Element {
  return <>{children}</>
}

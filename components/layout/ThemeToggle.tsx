// Theme toggle component placeholder for dark and light mode.
'use client'

interface ThemeToggleProps {
  isDark: boolean
  onToggle: () => void
}

export function ThemeToggle({ isDark, onToggle }: ThemeToggleProps): JSX.Element {
  return (
    <button onClick={onToggle} type="button">
      Theme: {isDark ? 'dark' : 'light'}
    </button>
  )
}

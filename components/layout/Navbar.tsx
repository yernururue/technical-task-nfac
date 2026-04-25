// Top navigation component placeholder with authentication state slot.
'use client'

interface NavbarProps {
  isAuthenticated: boolean
  username: string | null
}

export function Navbar({ isAuthenticated, username }: NavbarProps): JSX.Element {
  return <nav>Navbar placeholder: {isAuthenticated ? username : 'guest'}.</nav>
}

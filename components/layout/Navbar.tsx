'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Menu, X, User, LogOut, Settings, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/history', label: 'Replays' },
  { href: '/play', label: 'Play' },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  
  // Placeholder user state - will be connected to Supabase auth
  const user = null
  const loading = false

  const isActive = (path: string) => pathname === path

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-background flex items-center justify-center font-black text-xl shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            C
          </div>
          <span className="text-foreground font-extrabold text-xl tracking-tight">ChessMind</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'transition-colors hover:text-primary',
                isActive(link.href) ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Side - Auth */}
        <div className="hidden md:flex items-center gap-4">
          {!loading && (
            <>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
                      <User className="w-4 h-4" />
                      <span>Account</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem>
                      <BarChart3 className="w-4 h-4 mr-2" />
                      <span>Game History</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="w-4 h-4 mr-2" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <LogOut className="w-4 h-4 mr-2" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                      Login
                    </Button>
                  </Link>
                  <Link href="/play">
                    <Button className="bg-foreground text-background hover:bg-foreground/90 font-bold rounded-xl px-6">
                      Play Now
                    </Button>
                  </Link>
                </>
              )}
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl">
          <div className="px-6 py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'block py-2 text-base font-semibold transition-colors',
                  isActive(link.href) ? 'text-foreground' : 'text-muted-foreground'
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-border space-y-2">
              {user ? (
                <Button variant="outline" className="w-full justify-start gap-2">
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              ) : (
                <>
                  <Link href="/auth/login" className="block">
                    <Button variant="outline" className="w-full">Login</Button>
                  </Link>
                  <Link href="/play" className="block">
                    <Button className="w-full bg-primary text-primary-foreground">Play Now</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

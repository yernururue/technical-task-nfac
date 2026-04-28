'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Menu, X, User, LogOut, Settings, BarChart3, UserCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProfileDialog } from './profile-dialog'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/history', label: 'Replays' },
  { href: '/play', label: 'Play' },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [profileOpen, setProfileOpen] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    fetchUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

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
                    <Button variant="ghost" className="gap-2 h-12 px-4 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 flex items-center justify-center border border-white/10">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <span className="font-bold">{user.email?.split('@')[0]}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 p-2 bg-card/95 backdrop-blur-xl border-border rounded-2xl shadow-2xl">
                    <div className="px-3 py-2 mb-2">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Account</p>
                      <p className="text-sm font-bold text-foreground truncate">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator className="bg-border/50" />
                    <DropdownMenuItem className="rounded-xl focus:bg-primary/10 focus:text-primary cursor-pointer py-3" onClick={() => setProfileOpen(true)}>
                      <UserCircle className="w-4 h-4 mr-3" />
                      <span className="font-semibold">My Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
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
                <>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start gap-2"
                    onClick={() => {
                      setProfileOpen(true)
                      setMobileMenuOpen(false)
                    }}
                  >
                    <UserCircle className="w-4 h-4" />
                    Profile
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2" onClick={handleLogout}>
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </>
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

      {user && (
        <ProfileDialog 
          userId={user.id} 
          open={profileOpen} 
          onOpenChange={setProfileOpen} 
        />
      )}
    </nav>
  )
}

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
import { Menu, X, User, Settings, BarChart3, UserCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/history', label: 'Replays' },
  { href: '/play', label: 'Play' },
  { href: '/profile', label: 'Profile' },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let profileChannel: any = null

    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        const { data: profileData } = await supabase
          .from('profiles')
          .select('username, rating, avatar_url')
          .eq('id', user.id)
          .single()
        setProfile(profileData)

        // Subscribe to realtime changes for this specific profile
        profileChannel = supabase
          .channel(`public:profiles:id=eq.${user.id}`)
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'profiles',
              filter: `id=eq.${user.id}`,
            },
            (payload) => {
              setProfile(payload.new)
            }
          )
          .subscribe()
      } else {
        setUser(null)
        setProfile(null)
      }
      setLoading(false)
    }

    fetchUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUser()
      } else {
        setUser(null)
        setProfile(null)
        setLoading(false)
        if (profileChannel) {
          supabase.removeChannel(profileChannel)
          profileChannel = null
        }
      }
    })

    return () => {
      subscription.unsubscribe()
      if (profileChannel) {
        supabase.removeChannel(profileChannel)
      }
    }
  }, [supabase])

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
                <Link href="/profile" className="flex items-center">
                  <Button variant="ghost" className="gap-2 h-12 px-4 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center border border-white/10 overflow-hidden shrink-0">
                      {profile?.avatar_url ? (
                        <img 
                          src={`${profile.avatar_url}${profile.avatar_url.includes('?') ? '&' : '?'}t=${new Date().getTime()}`} 
                          alt="Avatar" 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <User className="w-4 h-4 text-primary" />
                      )}
                    </div>
                    <span className="font-bold">
                      {profile?.username || user.email?.split('@')[0]}
                      {profile?.rating ? ` (${profile.rating})` : ''}
                    </span>
                  </Button>
                </Link>
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
              {user ? null : (
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

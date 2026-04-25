'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogOut, User, Settings, BarChart3, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        setUser(data.session?.user || null)
      } catch (err) {
        console.error('Auth check failed:', err)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription?.unsubscribe()
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/')
  }

  const isActive = (path: string) => pathname === path

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 backdrop-blur-xl bg-opacity-80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="text-3xl">♟️</div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-cyan-300 transition">
              ChessMind
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link href="/play">
              <Button
                variant="ghost"
                className={cn(
                  'text-slate-400 hover:text-white transition',
                  isActive('/play') && 'text-white bg-slate-800'
                )}
              >
                Play
              </Button>
            </Link>
            {user && (
              <Link href="/history">
                <Button
                  variant="ghost"
                  className={cn(
                    'text-slate-400 hover:text-white transition',
                    isActive('/history') && 'text-white bg-slate-800'
                  )}
                >
                  History
                </Button>
              </Link>
            )}
          </div>

          {/* Right - Auth Section */}
          {!loading && (
            <div className="flex items-center gap-4">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:bg-slate-800 hover:text-white text-slate-300 h-9 px-4 py-2 outline-none"
                  >
                      <User className="w-4 h-4" />
                      <span className="hidden sm:inline">{user.email?.split('@')[0]}</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-slate-800 border-slate-700">
                    <DropdownMenuItem className="text-slate-400 cursor-default">
                      <User className="w-4 h-4 mr-2" />
                      <span>{user.email}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-slate-700" />
                    <DropdownMenuItem
                      onClick={() => router.push('/history')}
                      className="text-slate-300 hover:text-white cursor-pointer"
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      <span>Game History</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-slate-300 hover:text-white cursor-pointer">
                      <Settings className="w-4 h-4 mr-2" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-slate-700" />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-400 hover:text-red-300 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex gap-2">
                  <Link href="/auth/login">
                    <Button
                      variant="ghost"
                      className="text-slate-300 hover:text-white hover:bg-slate-800"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-blue-500/50 transition">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

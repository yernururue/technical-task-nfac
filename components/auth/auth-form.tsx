'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react'

interface AuthFormProps {
  type: 'login' | 'signup'
}

export function AuthForm({ type }: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)

    try {
      if (type === 'signup') {
        // SIGNUP
        if (!email || !password || !username) {
          throw new Error('All fields are required')
        }

        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters')
        }

        const { data, error: signupError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username,
            },
          },
        })

        if (signupError) {
          throw new Error(signupError.message)
        }

        if (!data.user) {
          throw new Error('Signup failed - no user returned')
        }

        setSuccess('✓ Account created! Logging you in...')
        setTimeout(() => {
          router.push('/play')
        }, 1500)
      } else {
        // LOGIN
        if (!email || !password) {
          throw new Error('Email and password are required')
        }

        const { data, error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (loginError) {
          throw new Error(loginError.message)
        }

        if (!data.user) {
          throw new Error('Login failed - no user returned')
        }

        setSuccess('✓ Logged in! Redirecting...')
        setTimeout(() => {
          router.push('/play')
        }, 1000)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
      console.error('Auth error:', message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl text-white">
            {type === 'login' ? '♟️ Welcome Back' : '♟️ Join ChessMind'}
          </CardTitle>
          <CardDescription className="text-slate-400">
            {type === 'login'
              ? 'Login to your account and start playing'
              : 'Create an account to save your games'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Alert */}
            {error && (
              <div className="flex gap-3 p-4 bg-red-900/20 border border-red-700 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-red-200">{error}</p>
                </div>
              </div>
            )}

            {/* Success Alert */}
            {success && (
              <div className="flex gap-3 p-4 bg-green-900/20 border border-green-700 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-200">{success}</p>
                </div>
              </div>
            )}

            {/* Username (signup only) */}
            {type === 'signup' && (
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                required
              />
            )}

            {/* Email */}
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              required
            />

            {/* Password */}
            <Input
              type="password"
              placeholder={type === 'signup' ? 'Password (min 6 chars)' : 'Password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              minLength={6}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
              required
            />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white h-10"
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {type === 'login' ? 'Login' : 'Create Account'}
            </Button>

            {/* Link to other form */}
            <div className="text-center">
              <p className="text-sm text-slate-400">
                {type === 'login' ? "Don't have an account?" : 'Already have an account?'}
                <Link
                  href={type === 'login' ? '/auth/signup' : '/auth/login'}
                  className="text-blue-400 hover:text-blue-300 ml-1 font-medium"
                >
                  {type === 'login' ? 'Sign up' : 'Login'}
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

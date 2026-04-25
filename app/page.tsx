'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Brain, Users2, BookOpen, ArrowRight, Sparkles, Target, Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-0 right-10 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-4 py-32 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-8">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-300">Powered by AI & Stockfish</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Learn Chess <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
              Master Your Game
            </span>
          </h1>

          <p className="text-xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Play against world-class AI, get instant feedback on every move, and watch your rating soar.
            <br />
            <span className="text-slate-500">Trusted by thousands of chess players worldwide.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/play">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-xl hover:shadow-blue-500/50 transition text-lg h-14 px-8"
              >
                Start Playing <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button
                size="lg"
                variant="outline"
                className="border-slate-700 text-white hover:bg-slate-800 hover:border-slate-600 text-lg h-14 px-8"
              >
                Create Account
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto py-12 border-y border-slate-800">
            <div>
              <div className="text-3xl font-bold text-blue-400">10K+</div>
              <div className="text-sm text-slate-400">Players</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-cyan-400">100K+</div>
              <div className="text-sm text-slate-400">Games Played</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400">99%</div>
              <div className="text-sm text-slate-400">Uptime</div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="max-w-6xl mx-auto px-4 py-20">
          <h2 className="text-4xl font-bold text-white text-center mb-4">Why ChessMind?</h2>
          <p className="text-center text-slate-400 mb-16 text-lg">Everything you need to improve your chess</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-blue-500/50 transition group">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition mb-4">
                  <Brain className="w-6 h-6 text-blue-400" />
                </div>
                <CardTitle className="text-white">AI Coach Analysis</CardTitle>
                <CardDescription className="text-slate-400">
                  Understand every mistake
                </CardDescription>
              </CardHeader>
              <CardContent className="text-slate-400">
                Get instant, detailed analysis of your games with move-by-move explanations from advanced AI.
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-cyan-500/50 transition group">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center group-hover:bg-cyan-500/20 transition mb-4">
                  <Zap className="w-6 h-6 text-cyan-400" />
                </div>
                <CardTitle className="text-white">Play vs AI</CardTitle>
                <CardDescription className="text-slate-400">
                  3 difficulty levels
                </CardDescription>
              </CardHeader>
              <CardContent className="text-slate-400">
                Challenge yourself against Stockfish at beginner, intermediate, or grandmaster strength.
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-purple-500/50 transition group">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition mb-4">
                  <Target className="w-6 h-6 text-purple-400" />
                </div>
                <CardTitle className="text-white">Track Progress</CardTitle>
                <CardDescription className="text-slate-400">
                  Watch yourself improve
                </CardDescription>
              </CardHeader>
              <CardContent className="text-slate-400">
                Save all your games, review them anytime, and see your improvement over time.
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto px-4 py-20">
          <div className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 rounded-2xl p-12 shadow-2xl">
            <h3 className="text-3xl font-bold text-white mb-4 text-center">Ready to become a better player?</h3>
            <p className="text-blue-100 mb-8 text-center text-lg">
              Join thousands of chess enthusiasts. Sign up today and start your journey to mastery.
            </p>
            <div className="flex justify-center">
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-slate-100 shadow-lg text-lg h-12 px-8 font-semibold"
                >
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-800 mt-20 py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h4 className="font-semibold text-white mb-4">Product</h4>
                <ul className="space-y-2 text-slate-400">
                  <li><Link href="/play" className="hover:text-white transition">Play</Link></li>
                  <li><Link href="/history" className="hover:text-white transition">History</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">About</h4>
                <ul className="space-y-2 text-slate-400">
                  <li><a href="#" className="hover:text-white transition">About Us</a></li>
                  <li><a href="#" className="hover:text-white transition">Blog</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Legal</h4>
                <ul className="space-y-2 text-slate-400">
                  <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                  <li><a href="#" className="hover:text-white transition">Terms</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-4">Connect</h4>
                <ul className="space-y-2 text-slate-400">
                  <li><a href="#" className="hover:text-white transition">Twitter</a></li>
                  <li><a href="#" className="hover:text-white transition">Discord</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-slate-800 pt-8 text-center text-slate-500">
              <p>© 2024 ChessMind. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

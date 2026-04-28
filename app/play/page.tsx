'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Cpu, Users2, ArrowRight, Sparkles, Globe } from 'lucide-react'

export default function PlayPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 overflow-x-hidden">
      {/* Spacer for fixed navbar */}
      <div className="h-20" />

      <main className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl sm:text-6xl font-extrabold text-foreground tracking-tight">
            Choose Your <span className="text-gradient">Battlefield</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
            Whether you want to practice against the engine or play with friends, we've got you covered.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* AI Game */}
          <div className="bento-card flex flex-col group cursor-pointer relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Cpu className="w-24 h-24" />
            </div>
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-8 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-300">
              <Cpu className="w-8 h-8" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 tracking-tight">Play vs AI</h3>
            <p className="text-muted-foreground leading-relaxed font-medium mb-8 flex-grow">
              Challenge our Stockfish-powered engine with 3 difficulty levels. Perfect for training and improving your tactics.
            </p>
            <Link href="/play/ai" className="w-full">
              <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white rounded-full py-6 font-bold text-lg shadow-lg shadow-cyan-500/20 transition-all hover:scale-105">
                Start Engine <ZapIcon className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>

          {/* Local Game */}
          <div className="bento-card flex flex-col group cursor-pointer relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Users2 className="w-24 h-24" />
            </div>
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-8 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
              <Users2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 tracking-tight">Local Multi</h3>
            <p className="text-muted-foreground leading-relaxed font-medium mb-8 flex-grow">
              Play with a friend on the same device. The classic way to settle scores and enjoy a game of chess together.
            </p>
            <Link href="/play/local" className="w-full">
              <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-full py-6 font-bold text-lg shadow-lg shadow-emerald-500/20 transition-all hover:scale-105">
                Play Locally <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>

          {/* Online Multiplayer - Placeholder */}
          <div className="bento-card flex flex-col group opacity-60 cursor-not-allowed relative overflow-hidden border-dashed">
            <div className="absolute top-4 right-4">
              <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-bold text-primary uppercase tracking-widest">
                Coming Soon
              </div>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-muted border border-border flex items-center justify-center text-muted-foreground mb-8">
              <Globe className="w-8 h-8" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 tracking-tight">Online Arena</h3>
            <p className="text-muted-foreground leading-relaxed font-medium mb-8 flex-grow">
              Join the global community and play against players from around the world in real-time matches.
            </p>
            <Button disabled className="w-full bg-muted text-muted-foreground rounded-full py-6 font-bold text-lg cursor-not-allowed">
              Coming Soon
            </Button>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold text-primary uppercase tracking-widest">
              <Sparkles className="w-3 h-3" /> Advanced Training
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight">
              Master the board with <span className="text-gradient">AI Insights</span>
            </h2>
            <p className="text-lg text-muted-foreground font-medium leading-relaxed">
              Every game you play is stored and can be analyzed by our AI coach. Understand your mistakes and learn from your brilliant moves.
            </p>
            <ul className="space-y-4">
              {['Real-time engine evaluation', 'Detailed game history', 'AI-powered move suggestions'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-foreground font-semibold">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="glass rounded-[2rem] p-8 aspect-video flex items-center justify-center border-primary/10 relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-[2rem]" />
            <Cpu className="w-24 h-24 text-primary/20 group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute bottom-8 left-8 right-8 p-6 glass rounded-2xl border-white/5">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <div className="text-sm font-bold text-primary uppercase tracking-widest">Engine Status</div>
                  <div className="text-xl font-bold text-foreground">Stockfish 16.1 Online</div>
                </div>
                <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function ZapIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}

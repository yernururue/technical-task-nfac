'use client'

import Link from 'next/link'
import { Brain, Zap, Target, ArrowRight, MessageCircle, Code, Video, User, Activity, Shield } from 'lucide-react'

// Local data arrays
const features = [
  {
    icon: Brain,
    title: 'Best analysis',
    description: 'Get deep insights into your games with our advanced AI coach. Understand every move.',
  },
  {
    icon: Zap,
    title: 'Less than 5 minutes',
    description: 'Lightning-fast evaluations. Get your game analyzed in seconds, not hours.',
  },
  {
    icon: Shield,
    title: 'Non-essential',
    description: 'Skip the noise. We focus only on critical mistakes and brilliant moves that matter.',
  },
  {
    icon: Target,
    title: 'Totally free',
    description: 'Access world-class chess analysis without hitting a paywall. Learn at your own pace.',
  },
]

const champions = [
  { name: 'Magnus Carlsen', rating: '2882', bio: '5-time World Chess Champion. Known for his endgame mastery.' },
  { name: 'Garry Kasparov', rating: '2851', bio: 'Former World Chess Champion. Famous for his aggressive style.' },
  { name: 'Hikaru Nakamura', rating: '2802', bio: 'Blitz specialist and 5-time US Chess Champion.' },
]

const recentGames = [
  { date: 'Oct 24, 2024', white: 'PlayerOne', black: 'ChessMaster99', result: '1-0' },
  { date: 'Oct 23, 2024', white: 'GrandMaster', black: 'Beginner123', result: '½-½' },
  { date: 'Oct 22, 2024', white: 'CheckMate24', black: 'KnightRider', result: '0-1' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-300 font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#09090b]/60 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-[#09090b] flex items-center justify-center font-black text-2xl shadow-[0_0_20px_-5px_rgba(52,211,153,0.5)] group-hover:scale-105 transition-transform">
              C
            </div>
            <span className="text-white font-extrabold text-2xl tracking-tighter">ChessMind</span>
          </div>
          <div className="hidden md:flex items-center gap-10 text-base font-semibold">
            <Link href="/" className="text-white transition-colors hover:text-emerald-400">Home</Link>
            <Link href="/history" className="transition-colors hover:text-white">Replays</Link>
            <Link href="#" className="transition-colors hover:text-white">Masters</Link>
            <Link href="/play" className="transition-colors hover:text-white">Play</Link>
          </div>
          <Link href="/play" className="hidden md:inline-flex items-center justify-center bg-white text-black hover:bg-zinc-200 font-bold rounded-2xl px-8 py-4 text-base transition-all hover:scale-105">
             Play Now
          </Link>
        </div>
      </nav>

      <main className="pt-32">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-32 flex flex-col xl:flex-row items-center gap-20">
          <div className="flex-1 space-y-10 z-10 text-center xl:text-left flex flex-col items-center xl:items-start">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-sm font-bold text-emerald-400 backdrop-blur-sm">
              <SparkleIcon className="w-5 h-5" /> New AI Engine Integrated
            </div>
            <h1 className="text-6xl md:text-8xl font-extrabold text-white leading-[1.05] tracking-tighter">
              Get your chess wisdom from <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">masters</span>
            </h1>
            <p className="text-xl md:text-2xl max-w-2xl text-zinc-400 leading-relaxed font-medium">
              Improve your game with AI-powered analysis, practice against top-tier engines, and learn from the best games in history.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-6 pt-8 w-full sm:w-auto">
              <Link href="/play" className="w-full sm:w-auto inline-flex items-center justify-center bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-[0_0_50px_-12px_rgba(16,185,129,0.6)] rounded-full px-12 py-8 text-2xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-[0_0_80px_-15px_rgba(16,185,129,0.8)] border-none">
                Analyze replays <ArrowRight className="ml-4 w-8 h-8" />
              </Link>
            </div>
          </div>
          
          <div className="flex-1 w-full max-w-2xl relative aspect-square xl:aspect-auto xl:h-[700px]">
            {/* Grandmaster Photo Placeholder */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-md border border-white/10 rounded-[3rem] overflow-hidden flex items-center justify-center relative group shadow-2xl hover:bg-white/10 transition-colors duration-500">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#09090b] via-transparent to-transparent opacity-80 z-10"></div>
              <User className="w-48 h-48 text-white/10 group-hover:scale-110 transition-transform duration-700" />
              <span className="absolute bottom-10 left-10 text-white/40 font-black text-4xl z-20 tracking-tighter">Grandmaster</span>
            </div>

            {/* Floating Glassmorphism Card */}
            <div className="absolute -bottom-10 -left-6 md:bottom-20 md:-left-20 bg-zinc-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-10 shadow-2xl z-30 flex gap-10 animate-in slide-in-from-bottom-10 fade-in duration-1000">
              <div className="space-y-2">
                <div className="text-4xl font-black text-white">4k+</div>
                <div className="text-sm text-emerald-400 font-bold uppercase tracking-widest">Replays</div>
              </div>
              <div className="w-px bg-white/10"></div>
              <div className="space-y-2">
                <div className="text-4xl font-black text-white">1k+</div>
                <div className="text-sm text-emerald-400 font-bold uppercase tracking-widest">Users</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features / Why Us (Bento Box style) */}
        <section className="py-32 px-6 max-w-7xl mx-auto relative space-y-20">
          <div className="text-center space-y-6">
            <h2 className="text-5xl md:text-7xl font-extrabold text-white tracking-tighter">Why <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">ChessMind?</span></h2>
            <p className="text-2xl max-w-3xl mx-auto text-zinc-400 font-medium">Discover the tools that will transform your chess journey.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 - Large spanning */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-[2.5rem] p-10 hover:-translate-y-2 hover:bg-white/10 transition-all duration-300 group cursor-pointer flex flex-col md:col-span-2 lg:col-span-2">
               <div className="w-20 h-20 rounded-3xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-8 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                 <Brain className="w-10 h-10" />
               </div>
               <h3 className="text-4xl font-bold text-white mb-4 tracking-tight">{features[0].title}</h3>
               <p className="text-xl text-zinc-400 leading-relaxed font-medium max-w-lg">{features[0].description}</p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-[2.5rem] p-10 hover:-translate-y-2 hover:bg-white/10 transition-all duration-300 group cursor-pointer flex flex-col">
               <div className="w-20 h-20 rounded-3xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-8 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-300">
                 <Zap className="w-10 h-10" />
               </div>
               <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">{features[1].title}</h3>
               <p className="text-lg text-zinc-400 leading-relaxed font-medium">{features[1].description}</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-[2.5rem] p-10 hover:-translate-y-2 hover:bg-white/10 transition-all duration-300 group cursor-pointer flex flex-col">
               <div className="w-20 h-20 rounded-3xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-8 group-hover:scale-110 group-hover:bg-purple-500 group-hover:text-white transition-all duration-300">
                 <Shield className="w-10 h-10" />
               </div>
               <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">{features[2].title}</h3>
               <p className="text-lg text-zinc-400 leading-relaxed font-medium">{features[2].description}</p>
            </div>

             {/* Feature 4 - Large spanning */}
             <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-[2.5rem] p-10 hover:-translate-y-2 hover:bg-white/10 transition-all duration-300 group cursor-pointer flex flex-col md:col-span-2 lg:col-span-2">
               <div className="w-20 h-20 rounded-3xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-8 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                 <Target className="w-10 h-10" />
               </div>
               <h3 className="text-4xl font-bold text-white mb-4 tracking-tight">{features[3].title}</h3>
               <p className="text-xl text-zinc-400 leading-relaxed font-medium max-w-lg">{features[3].description}</p>
            </div>
          </div>
        </section>

        {/* Champions */}
        <section className="py-32 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-20">
            <div className="text-center">
              <h2 className="text-5xl md:text-7xl font-extrabold text-white tracking-tighter mb-6">Best of the <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">best</span></h2>
              <p className="text-2xl text-zinc-400 font-medium">Learn from the greatest minds in chess.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {champions.map((champ, i) => (
                <div key={i} className="bg-white/5 border border-white/10 backdrop-blur-md rounded-[2.5rem] p-10 hover:-translate-y-2 hover:bg-white/10 transition-all duration-300 group cursor-pointer flex flex-col justify-between">
                  <div>
                    <div className="w-24 h-24 rounded-[2rem] bg-zinc-900 border border-white/10 flex items-center justify-center mb-8 group-hover:border-emerald-500/50 group-hover:shadow-[0_0_30px_-5px_rgba(52,211,153,0.3)] transition-all">
                      <User className="w-10 h-10 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-3 tracking-tight">{champ.name}</h3>
                    <p className="text-lg text-zinc-400 leading-relaxed font-medium mb-8">{champ.bio}</p>
                  </div>
                  <div className="inline-flex w-fit items-center px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white font-mono text-xl font-bold">
                    Elo {champ.rating}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Latest Games (Replays) */}
        <section className="py-32 relative overflow-hidden bg-[#09090b]">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
             <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-20 gap-8">
              <h2 className="text-5xl md:text-7xl font-extrabold text-white tracking-tighter text-center md:text-left">Latest <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">Games</span></h2>
              <Link href="/history" className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 font-bold text-lg transition-all hover:scale-105">
                View all replays <ArrowRight className="w-6 h-6" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {recentGames.map((game, i) => (
                <div key={i} className="bg-white/5 border border-white/10 backdrop-blur-md rounded-[2.5rem] p-6 hover:-translate-y-2 hover:bg-white/10 transition-all duration-300 group cursor-pointer flex flex-col">
                  <div className="aspect-square bg-zinc-950 rounded-[2rem] flex items-center justify-center relative mb-8 border border-white/5 group-hover:border-emerald-500/30 transition-colors">
                    <div className="w-24 h-24 border border-white/10 rounded-3xl flex items-center justify-center bg-zinc-900 group-hover:scale-110 transition-transform duration-500 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/50">
                      <Target className="w-10 h-10 text-zinc-600 group-hover:text-emerald-400 transition-colors" />
                    </div>
                  </div>
                  <div className="px-4">
                    <div className="flex justify-between items-center mb-6 text-sm font-bold uppercase tracking-widest text-zinc-500">
                      <span>{game.date}</span>
                      <span className="bg-white/10 text-white px-4 py-2 rounded-xl">{game.result}</span>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-white font-bold text-xl">
                        <span>{game.white}</span>
                        <div className="w-4 h-4 rounded-md bg-white border border-white/20"></div>
                      </div>
                      <div className="flex items-center justify-between text-zinc-400 font-bold text-xl">
                        <span>{game.black}</span>
                        <div className="w-4 h-4 rounded-md bg-black border border-white/20"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Huge Bottom CTA */}
        <section className="py-40 px-6">
          <div className="max-w-5xl mx-auto bg-gradient-to-br from-emerald-900/40 to-cyan-900/40 border border-emerald-500/20 backdrop-blur-3xl rounded-[3rem] p-16 md:p-24 text-center flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.1)_0%,transparent_70%)]"></div>
            <h2 className="text-5xl md:text-7xl font-extrabold text-white tracking-tighter mb-8 relative z-10">Ready to play?</h2>
            <p className="text-2xl text-emerald-100/70 font-medium mb-16 relative z-10">Join thousands of players improving their game today.</p>
            <Link href="/play" className="relative z-10 inline-flex items-center justify-center bg-white text-black shadow-[0_0_50px_-10px_rgba(255,255,255,0.4)] rounded-full px-16 py-8 text-3xl font-black transition-all duration-300 hover:scale-110 hover:shadow-[0_0_80px_-15px_rgba(255,255,255,0.6)]">
              Start Now <Zap className="ml-4 w-8 h-8 text-black" />
            </Link>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-[#09090b] border-t border-white/5 pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-24">
            <div className="md:col-span-1 space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-black flex items-center justify-center font-black text-xl">
                  C
                </div>
                <span className="text-white font-extrabold text-2xl tracking-tighter">ChessMind</span>
              </div>
              <p className="text-lg text-zinc-400 leading-relaxed font-medium">
                Empowering chess players worldwide to reach their full potential through AI-driven insights.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-emerald-500 hover:border-emerald-500 hover:text-white text-zinc-400 transition-all hover:-translate-y-1"><MessageCircle className="w-6 h-6" /></a>
                <a href="#" className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-cyan-500 hover:border-cyan-500 hover:text-white text-zinc-400 transition-all hover:-translate-y-1"><Code className="w-6 h-6" /></a>
                <a href="#" className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-500 hover:border-blue-500 hover:text-white text-zinc-400 transition-all hover:-translate-y-1"><Video className="w-6 h-6" /></a>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold text-xl mb-8 tracking-tight">Pages</h4>
              <ul className="space-y-6 text-lg text-zinc-400 font-medium">
                <li><Link href="/" className="hover:text-emerald-400 transition-colors">Home</Link></li>
                <li><Link href="/play" className="hover:text-emerald-400 transition-colors">Play</Link></li>
                <li><Link href="/history" className="hover:text-emerald-400 transition-colors">Replays</Link></li>
                <li><Link href="#" className="hover:text-emerald-400 transition-colors">Masters</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-xl mb-8 tracking-tight">Info</h4>
              <ul className="space-y-6 text-lg text-zinc-400 font-medium">
                <li><Link href="#" className="hover:text-emerald-400 transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-emerald-400 transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-emerald-400 transition-colors">Contact</Link></li>
                <li><Link href="#" className="hover:text-emerald-400 transition-colors">Blog</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-xl mb-8 tracking-tight">Legal</h4>
              <ul className="space-y-6 text-lg text-zinc-400 font-medium">
                <li><Link href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-emerald-400 transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-10 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-zinc-500 font-medium">
            <p>© 2024 ChessMind. All rights reserved.</p>
            <div className="flex gap-6">
              <span className="flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><Activity className="w-4 h-4"/> System operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function SparkleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  )
}

'use client'

import Link from 'next/link'
import { Brain, Zap, Target, ArrowRight, MessageCircle, Code, Video, User, Shield, Check, Star, Activity } from 'lucide-react'
import { toast } from 'sonner'

// Sparkle icon component
function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
  )
}

const features = [
  {
    icon: Brain,
    title: 'AI Coach (Free)',
    description: 'Get deep insights into your games with our base AI model. Understand your mistakes without dry engine evaluations.',
    color: 'emerald',
  },
  {
    icon: Zap,
    title: 'Deep LLM Insights (Pro)',
    description: 'Unlock advanced Gemini 2.5 Flash analysis. Get personalized, human-like explanations for every critical blunder.',
    color: 'cyan',
  },
  {
    icon: Shield,
    title: 'Brain Fitness Tracker (Coming Soon)',
    description: 'Track your cognitive endurance. Our AI analyzes your game history to find out exactly when you lose focus and start blundering.',
    color: 'purple',
  },
  {
    icon: Target,
    title: 'Web3 Tournaments (Planned)',
    description: 'Compete in decentralized arenas. Join smart-contract-based tournaments and play for real prize pools on Solana.',
    color: 'blue',
  },
]

const champions = [
  { name: 'Magnus Carlsen', rating: '2882', bio: '5-time World Chess Champion. Known for his endgame mastery.' },
  { name: 'Garry Kasparov', rating: '2851', bio: 'Former World Chess Champion. Famous for his aggressive style.' },
  { name: 'Hikaru Nakamura', rating: '2802', bio: 'Blitz specialist and 5-time US Chess Champion.' },
]

const recentGames = [
  { date: 'Apr 24, 2026', white: 'PlayerOne', black: 'ChessMaster99', result: '1-0' },
  { date: 'Apr 23, 2026', white: 'GrandMaster', black: 'Beginner123', result: '1/2-1/2' },
  { date: 'Apr 22, 2026', white: 'CheckMate24', black: 'KnightRider', result: '0-1' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 overflow-x-hidden">
      {/* Spacer for fixed navbar */}
      <div className="h-20" />

      <main className="pt-12">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-20 lg:py-32 flex flex-col xl:flex-row items-center gap-16 xl:gap-20">
          <div className="flex-1 space-y-8 z-10 text-center xl:text-left flex flex-col items-center xl:items-start">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-xs sm:text-sm font-bold text-green-400 backdrop-blur-sm shadow-lg shadow-green-500/5">
              <Activity className="w-4 h-4 animate-pulse" /> Stockfish 16.1 Online
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-foreground leading-[1.05] tracking-tight text-balance">
              Magnus Carlsen Level <span className="text-gradient">Analysis</span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl max-w-2xl text-muted-foreground leading-relaxed font-medium">
              Train with the same precision as the World Champion. Our AI dissects your games to find the lines even Grandmasters might miss.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 w-full sm:w-auto">
              <Link
                href="/history"
                className="w-full sm:w-auto inline-flex items-center justify-center bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/40 rounded-full px-10 py-5 text-lg sm:text-xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/60 active:scale-95"
              >
                Analyze replays <ArrowRight className="ml-3 w-6 h-6" />
              </Link>
            </div>
          </div>

          <div className="flex-1 w-full max-w-xl relative aspect-square xl:aspect-auto xl:h-[600px]">
            {/* Grandmaster Photo Placeholder */}
            <div className="absolute inset-0 bg-card/50 backdrop-blur-md border border-border rounded-[2.5rem] overflow-hidden flex items-center justify-center relative group shadow-2xl hover:bg-card/70 transition-colors duration-500">
              <div className="absolute inset-0 bg-gradient-to-tr from-background via-transparent to-transparent opacity-80 z-10" />
              <User className="w-32 h-32 sm:w-48 sm:h-48 text-muted-foreground/20 group-hover:scale-110 transition-transform duration-700" />
              <span className="absolute bottom-8 left-8 text-muted-foreground/40 font-black text-2xl sm:text-4xl z-20 tracking-tight">Grandmaster</span>
            </div>

            {/* Floating Glassmorphism Stats Card */}
            <div className="absolute -bottom-6 -left-4 sm:bottom-16 sm:-left-16 glass rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl z-30 flex gap-6 sm:gap-10 animate-slide-up">
              <div className="space-y-1">
                <div className="text-2xl sm:text-4xl font-black text-foreground">4k+</div>
                <div className="text-xs sm:text-sm text-primary font-bold uppercase tracking-widest">Replays</div>
              </div>
              <div className="w-px bg-border" />
              <div className="space-y-1">
                <div className="text-2xl sm:text-4xl font-black text-foreground flex items-center gap-2">
                  1k+ <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50" />
                </div>
                <div className="text-xs sm:text-sm text-primary font-bold uppercase tracking-widest">Live Users</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features / Why Us (Bento Box style) */}
        <section className="py-24 lg:py-32 px-6 max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-foreground tracking-tight text-balance">
              Why <span className="text-gradient">ChessMind?</span>
            </h2>
            <p className="text-lg sm:text-2xl max-w-3xl mx-auto text-muted-foreground font-medium">
              Discover the tools that will transform your chess journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 - Large spanning */}
            <div className="bento-card flex flex-col md:col-span-2 lg:col-span-2 cursor-pointer group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 sm:mb-8 group-hover:scale-110 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                <Brain className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <h3 className="text-2xl sm:text-4xl font-bold text-foreground mb-3 sm:mb-4 tracking-tight">{features[0].title}</h3>
              <p className="text-base sm:text-xl text-muted-foreground leading-relaxed font-medium max-w-lg">{features[0].description}</p>
            </div>

            {/* Feature 2 */}
            <div className="bento-card flex flex-col cursor-pointer group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6 sm:mb-8 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-300">
                <Zap className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <h3 className="text-xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4 tracking-tight">{features[1].title}</h3>
              <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed font-medium">{features[1].description}</p>
            </div>

            {/* Feature 3 */}
            <div className="bento-card flex flex-col cursor-pointer group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-6 sm:mb-8 group-hover:scale-110 group-hover:bg-purple-500 group-hover:text-white transition-all duration-300">
                <Shield className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <h3 className="text-xl sm:text-3xl font-bold text-foreground mb-3 sm:mb-4 tracking-tight">{features[2].title}</h3>
              <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed font-medium">{features[2].description}</p>
            </div>

            {/* Feature 4 - Large spanning */}
            <div className="bento-card flex flex-col md:col-span-2 lg:col-span-2 cursor-pointer group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-6 sm:mb-8 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                <Target className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <h3 className="text-2xl sm:text-4xl font-bold text-foreground mb-3 sm:mb-4 tracking-tight">{features[3].title}</h3>
              <p className="text-base sm:text-xl text-muted-foreground leading-relaxed font-medium max-w-lg">{features[3].description}</p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-24 lg:py-32 px-6 max-w-7xl mx-auto space-y-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="text-center space-y-4 relative z-10">
            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-foreground tracking-tight text-balance">
              Simple, transparent <span className="text-gradient">pricing</span>
            </h2>
            <p className="text-lg sm:text-2xl max-w-3xl mx-auto text-muted-foreground font-medium">
              Choose the perfect plan to elevate your chess skills.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto relative z-10">
            {/* Free Plan */}
            <div className="bento-card p-8 sm:p-12 flex flex-col justify-between border border-border bg-card/50 backdrop-blur-sm">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Free</h3>
                <div className="text-4xl sm:text-5xl font-black text-foreground mb-6">$0<span className="text-xl text-muted-foreground font-medium">/mo</span></div>
                <p className="text-muted-foreground font-medium mb-8">Perfect for getting started and learning the basics of chess.</p>
                <ul className="space-y-4 mb-8">
                  {[
                    'Base AI Game Analysis (3 per day)',
                    'Standard Multiplayer Arena',
                    'Basic Profile Customization',
                    'Global Leaderboard Access'
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-6 h-6 text-emerald-500 shrink-0" />
                      <span className="text-foreground font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button className="w-full py-4 rounded-xl font-bold text-lg bg-secondary text-foreground hover:bg-secondary/80 transition-colors border border-border">
                Get Started
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bento-card p-8 sm:p-12 flex flex-col justify-between border border-purple-500/30 bg-gradient-to-b from-purple-900/20 to-card/50 backdrop-blur-md relative transform md:-translate-y-4 shadow-2xl shadow-purple-500/10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-xs font-bold uppercase tracking-widest rounded-full flex items-center gap-1 shadow-lg">
                <Star className="w-3 h-3" /> Recommended
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Pro</h3>
                <div className="text-4xl sm:text-5xl font-black text-foreground mb-6">$9.99<span className="text-xl text-muted-foreground font-medium">/mo</span></div>
                <p className="text-muted-foreground font-medium mb-8">Advanced tools and unlimited insights for serious players.</p>
                <ul className="space-y-4 mb-8">
                  {[
                    'Unlimited AI Analysis (Gemini 2.5 Flash)',
                    'Brain Fitness Tracker (Cognitive Endurance Analytics)',
                    'Exclusive Board & Piece Themes',
                    'Ad-free Experience',
                    'Priority Support'
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-6 h-6 text-purple-400 shrink-0" />
                      <span className="text-foreground font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <button className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-purple-500 to-cyan-500 text-white hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/25">
                Upgrade Now
              </button>
            </div>
          </div>
        </section>

        {/* Champions */}
        <section className="py-24 lg:py-32 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 relative z-10 space-y-16">
            <div className="text-center">
              <h2 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-foreground tracking-tight mb-4 sm:mb-6 text-balance">
                Best of the <span className="text-gradient">best</span>
              </h2>
              <p className="text-lg sm:text-2xl text-muted-foreground font-medium">Learn from the greatest minds in chess.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              {champions.map((champ, i) => (
                <div key={i} className="bento-card flex flex-col justify-between cursor-pointer group">
                  <div>
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[1.5rem] sm:rounded-[2rem] bg-secondary border border-border flex items-center justify-center mb-6 sm:mb-8 group-hover:border-primary/50 group-hover:shadow-lg group-hover:shadow-primary/10 transition-all">
                      <User className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 sm:mb-3 tracking-tight">{champ.name}</h3>
                    <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-medium mb-6 sm:mb-8">{champ.bio}</p>
                  </div>
                  <div className="inline-flex w-fit items-center px-5 py-2.5 rounded-full bg-card border border-border text-foreground font-mono text-lg sm:text-xl font-bold">
                    Elo {champ.rating}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Latest Games (Replays) */}
        <section className="py-24 lg:py-32 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 lg:mb-20 gap-6 sm:gap-8">
              <h2 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-foreground tracking-tight text-center md:text-left text-balance">
                Latest <span className="text-gradient">Games</span>
              </h2>
              <Link
                href="/history"
                className="inline-flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-full glass text-foreground hover:bg-card/80 font-bold text-base sm:text-lg transition-all hover:scale-105"
              >
                View all replays <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
              {recentGames.map((game, i) => (
                <div key={i} className="bento-card p-5 sm:p-6 flex flex-col cursor-pointer group">
                  <div className="aspect-square bg-secondary rounded-[1.5rem] sm:rounded-[2rem] flex items-center justify-center relative mb-6 sm:mb-8 border border-border group-hover:border-primary/30 transition-colors">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 border border-border rounded-2xl sm:rounded-3xl flex items-center justify-center bg-card group-hover:scale-110 transition-transform duration-500 group-hover:bg-primary/20 group-hover:border-primary/50">
                      <Target className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                  <div className="px-2 sm:px-4">
                    <div className="flex justify-between items-center mb-4 sm:mb-6 text-xs sm:text-sm font-bold uppercase tracking-widest text-muted-foreground">
                      <span>{game.date}</span>
                      <span className="bg-card text-foreground px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl border border-border">{game.result}</span>
                    </div>
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center justify-between text-foreground font-bold text-lg sm:text-xl">
                        <span>{game.white}</span>
                        <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-md bg-white border border-border" />
                      </div>
                      <div className="flex items-center justify-between text-muted-foreground font-bold text-lg sm:text-xl">
                        <span>{game.black}</span>
                        <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-md bg-black border border-border" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Huge Bottom CTA */}
        <section className="py-24 lg:py-40 px-6">
          <div className="max-w-5xl mx-auto bg-gradient-to-br from-emerald-900/40 to-cyan-900/40 border border-primary/20 backdrop-blur-xl rounded-[2rem] sm:rounded-[3rem] p-12 sm:p-16 lg:p-24 text-center flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.1)_0%,transparent_70%)]" />
            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-foreground tracking-tight mb-6 sm:mb-8 relative z-10 text-balance">Ready to play?</h2>
            <p className="text-lg sm:text-2xl text-primary/70 font-medium mb-12 sm:mb-16 relative z-10">Join thousands of players improving their game today.</p>
            <Link
              href="/play"
              className="relative z-10 inline-flex items-center justify-center bg-foreground text-background shadow-lg shadow-white/10 rounded-full px-12 sm:px-16 py-6 sm:py-8 text-xl sm:text-3xl font-black transition-all duration-300 hover:scale-110 hover:shadow-white/20"
            >
              Start Now <Zap className="ml-3 sm:ml-4 w-6 h-6 sm:w-8 sm:h-8" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border pt-24 lg:pt-32 pb-12 lg:pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-20 mb-16 lg:mb-24">
            <div className="md:col-span-1 space-y-6 sm:space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-background flex items-center justify-center font-black text-lg sm:text-xl">
                  C
                </div>
                <span className="text-foreground font-extrabold text-xl sm:text-2xl tracking-tight">ChessMind</span>
              </div>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-medium">
                Empowering chess players worldwide to reach their full potential through AI-driven insights.
              </p>
              <div className="flex gap-3 sm:gap-4">
                <a href="#" className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl glass flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground text-muted-foreground transition-all hover:-translate-y-1">
                  <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>
                <a href="#" className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl glass flex items-center justify-center hover:bg-cyan-500 hover:border-cyan-500 hover:text-white text-muted-foreground transition-all hover:-translate-y-1">
                  <Code className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>
                <a href="#" className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl glass flex items-center justify-center hover:bg-blue-500 hover:border-blue-500 hover:text-white text-muted-foreground transition-all hover:-translate-y-1">
                  <Video className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-foreground font-bold text-lg sm:text-xl mb-6 sm:mb-8 tracking-tight">Pages</h4>
              <ul className="space-y-4 sm:space-y-6 text-base sm:text-lg text-muted-foreground font-medium">
                <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
                <li><Link href="/play" className="hover:text-primary transition-colors">Play</Link></li>
                <li><Link href="/history" className="hover:text-primary transition-colors">Replays</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-foreground font-bold text-lg sm:text-xl mb-6 sm:mb-8 tracking-tight">Info</h4>
              <ul className="space-y-4 sm:space-y-6 text-base sm:text-lg text-muted-foreground font-medium">
                <li><button onClick={() => toast.info('About Us page coming soon')} className="hover:text-primary transition-colors text-left">About Us</button></li>
                <li><button onClick={() => toast.info('Pricing integration coming soon')} className="hover:text-primary transition-colors text-left">Pricing</button></li>
                <li><button onClick={() => toast.info('Contact system coming soon')} className="hover:text-primary transition-colors text-left">Contact</button></li>
              </ul>
            </div>
 
            <div>
              <h4 className="text-foreground font-bold text-lg sm:text-xl mb-6 sm:mb-8 tracking-tight">Legal</h4>
              <ul className="space-y-4 sm:space-y-6 text-base sm:text-lg text-muted-foreground font-medium">
                <li><button onClick={() => toast.info('Legal terms coming soon')} className="hover:text-primary transition-colors text-left">Terms of Service</button></li>
                <li><button onClick={() => toast.info('Privacy policy coming soon')} className="hover:text-primary transition-colors text-left">Privacy Policy</button></li>
                <li><button onClick={() => toast.info('Cookie policy coming soon')} className="hover:text-primary transition-colors text-left">Cookie Policy</button></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} ChessMind. All rights reserved.</p>
            <p>Built with AI-powered analysis</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

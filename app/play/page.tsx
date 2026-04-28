'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Cpu, Users2 } from 'lucide-react'

export default function PlayPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-white text-center mb-12">Choose Game Mode</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Local Game */}
          <Card className="bg-slate-800 border-slate-700 hover:border-blue-500 transition cursor-pointer">
            <CardHeader>
              <Users2 className="w-12 h-12 text-blue-400 mb-4" />
              <CardTitle className="text-2xl text-white">Play Locally</CardTitle>
              <CardDescription className="text-slate-400">
                Play with a friend on the same device
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 mb-6">
                Perfect for two players who want to play together. No ratings or leaderboards.
              </p>
              <Link href="/play/local" className="w-full block">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-10">
                  Play Now
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* AI Game */}
          <Card className="bg-slate-800 border-slate-700 hover:border-cyan-500 transition cursor-pointer">
            <CardHeader>
              <Cpu className="w-12 h-12 text-cyan-400 mb-4" />
              <CardTitle className="text-2xl text-white">Play vs AI</CardTitle>
              <CardDescription className="text-slate-400">
                Challenge the AI engine
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 mb-6">
                Play against our AI at 3 difficulty levels. Your games are saved and analyzed.
              </p>
              <Link href="/play/ai" className="w-full block">
                <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white h-10">
                  Play Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

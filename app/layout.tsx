import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/components/providers/auth-provider'
import { Navbar } from '@/components/layout/navbar'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ChessMind - Learn Chess with AI Coach',
  description: 'Master chess with AI-powered analysis. Get deep insights into your games, practice against top-tier engines, and learn from the best games in history.',
  keywords: ['chess', 'AI coach', 'chess analysis', 'learn chess', 'stockfish', 'chess training'],
  authors: [{ name: 'ChessMind' }],
  creator: 'ChessMind',
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>♟️</text></svg>",
  },
  openGraph: {
    title: 'ChessMind - Learn Chess with AI Coach',
    description: 'Master chess with AI-powered analysis and improve your game.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#09090b',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} dark bg-background`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-foreground">
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Toaster 
            theme="dark" 
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'oklch(0.15 0 0)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                color: 'white',
              },
            }}
          />
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

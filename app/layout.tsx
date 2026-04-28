import type { Metadata } from "next"
import { Space_Grotesk, Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/layout/Navbar"
import { AuthProvider } from "@/components/AuthProvider"
import { Toaster } from "sonner"
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ChessMind - Learn Chess with AI Coach",
  description: "Master chess with AI analysis and improve your game.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>♟️</text></svg>",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", inter.variable)}>

      <body className={`${spaceGrotesk.className} bg-slate-950 text-white antialiased`}>
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}

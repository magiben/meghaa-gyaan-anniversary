import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display, Dancing_Script } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

const dancingScript = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-dancing',
})

export const metadata: Metadata = {
  title: 'Happy Anniversary',
  description: 'A digital love letter, made just for you.',
}

export const viewport: Viewport = {
  themeColor: '#F8F4EC',
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} ${dancingScript.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

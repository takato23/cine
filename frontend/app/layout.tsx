import type { Metadata } from 'next'
import { Inter, Spline_Sans } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Cinema Pergamino',
  description: 'Sistema de gestión de cine',
}

const fontSans = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

const fontDisplay = Spline_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  weight: ['300', '400', '500', '600', '700'],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${fontSans.variable} ${fontDisplay.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

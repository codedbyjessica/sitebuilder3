import type { Metadata } from 'next'
import { Inter, Fraunces } from 'next/font/google'
import './globals.css'
import AmplifyProvider from '@/components/providers/AmplifyProvider'

const inter = Inter({ subsets: ['latin'] })
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces' })

export const metadata: Metadata = {
  title: 'Sitelit — Professional Websites for Local Businesses',
  description:
    'Build a professional website for your local business in minutes. Choose a template, enter your info, and publish. No coding required.',
  openGraph: {
    title: 'Sitelit — Professional Websites for Local Businesses',
    description: 'Build a professional website for your local business in minutes.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${fraunces.variable} antialiased`}>
        <AmplifyProvider>
          {children}
        </AmplifyProvider>
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AmplifyProvider from '@/components/providers/AmplifyProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SiteBuilder — Professional Websites for Local Businesses',
  description:
    'Build a professional website for your local business in minutes. Choose a template, enter your info, and publish. No coding required.',
  openGraph: {
    title: 'SiteBuilder — Professional Websites for Local Businesses',
    description: 'Build a professional website for your local business in minutes.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <AmplifyProvider>
          {children}
        </AmplifyProvider>
      </body>
    </html>
  )
}

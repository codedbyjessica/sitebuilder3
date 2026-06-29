'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getAuthUser, configureAmplify } from '@/lib/amplify/client'
import Sidebar from '@/components/dashboard/Sidebar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    configureAmplify()
    getAuthUser().then((user) => {
      if (!user) router.replace('/login')
      else setChecking(false)
    })
  }, [router])

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="w-8 h-8 bg-indigo-200 rounded-lg" />
          <div className="w-20 h-3 bg-gray-200 rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8 min-w-0">
        {children}
      </main>
    </div>
  )
}

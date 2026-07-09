'use client'

import Sidebar from '@/components/dashboard/Sidebar'

// No auth gate here — the builder is open to everyone.
// Login is only required at publish time.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar />
      <main className="flex-1 p-8 min-w-0">
        {children}
      </main>
    </div>
  )
}

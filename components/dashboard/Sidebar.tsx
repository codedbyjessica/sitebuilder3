'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { logout } from '@/lib/amplify/client'
import { useRouter } from 'next/navigation'

const navItems = [
  { href: '/app', label: 'Dashboard', icon: '⊞' },
  { href: '/app/create', label: 'New website', icon: '+' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await logout()
    router.push('/')
  }

  return (
    <aside className="w-60 min-h-screen bg-white border-r border-ink/10 flex flex-col">
      {/* Logo */}
      <div className="p-5 border-b border-ink/10">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-maple rounded-md flex items-center justify-center">
            <span className="text-white font-display font-bold text-xs">S</span>
          </div>
          <span className="font-display font-semibold text-ink">Sitelit</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3">
        <div className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                pathname === item.href
                  ? 'bg-maple-light text-maple-deep'
                  : 'text-ink/60 hover:text-ink hover:bg-paper'
              )}
            >
              <span className="text-base leading-none">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-ink/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-ink/60 hover:text-ink hover:bg-paper transition-colors"
        >
          <span className="text-base">↩</span>
          Sign out
        </button>
      </div>
    </aside>
  )
}

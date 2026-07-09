import Link from 'next/link'

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-paper/85 backdrop-blur-md border-b border-ink/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-maple rounded-lg flex items-center justify-center">
              <span className="text-paper font-display font-bold text-base leading-none">S</span>
            </div>
            <span className="font-display font-semibold text-ink text-xl tracking-tight">Sitelit</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="#how" className="text-sm text-ink/60 hover:text-ink transition-colors">
              How it works
            </Link>
            <Link href="#themes" className="text-sm text-ink/60 hover:text-ink transition-colors">
              Themes
            </Link>
            <Link href="#pricing" className="text-sm text-ink/60 hover:text-ink transition-colors">
              Pricing
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/app"
              className="hidden sm:block text-sm font-medium text-ink/70 hover:text-ink px-3 py-2 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/app"
              className="text-sm font-medium bg-ink text-paper px-4 py-2 rounded-full hover:bg-maple transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-ink text-paper/50 py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-maple rounded-lg flex items-center justify-center">
              <span className="text-paper font-display font-bold text-base leading-none">S</span>
            </div>
            <span className="font-display font-semibold text-paper text-xl tracking-tight">Sitelit</span>
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
            <Link href="#how" className="hover:text-paper transition-colors">How it works</Link>
            <Link href="#themes" className="hover:text-paper transition-colors">Themes</Link>
            <Link href="#pricing" className="hover:text-paper transition-colors">Pricing</Link>
            <Link href="#" className="hover:text-paper transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-paper transition-colors">Terms</Link>
          </nav>
        </div>

        <div className="border-t border-paper/10 mt-10 pt-8 flex flex-col sm:flex-row justify-between gap-2 text-sm">
          <span>Made in Canada 🍁</span>
          <span>© {new Date().getFullYear()} Sitelit</span>
        </div>
      </div>
    </footer>
  )
}

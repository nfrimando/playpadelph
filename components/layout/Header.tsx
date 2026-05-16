'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { href: '/rankings', label: 'Rankings' },
  { href: '/calendar', label: 'Tournament Calendar' },
]

export default function Header() {
  const pathname = usePathname()

  if (pathname.startsWith('/admin')) return null

  return (
    <header className="bg-green-dark h-[62px] flex items-center justify-between px-9 sticky top-0 z-[300] shadow-[0_2px_16px_rgba(0,0,0,.22)]">
      <Link href="/" className="flex items-center">
        <span className="font-display text-2xl font-semibold text-oat tracking-[0.5px]">
          Play Padel
        </span>
        <span className="w-px h-4 bg-oat/20 mx-3.5 inline-block" />
        <span className="text-[9.5px] tracking-[3px] uppercase text-oat/40">
          Philippines
        </span>
      </Link>

      <nav className="flex items-center gap-1">
        {NAV_LINKS.map(({ href, label }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`px-4 py-[7px] text-[10px] font-semibold tracking-[1.5px] uppercase rounded-[2px] transition-all duration-150 font-body
                ${isActive
                  ? 'text-oat bg-white/10'
                  : 'text-oat/55 hover:text-oat hover:bg-white/10'
                }`}
            >
              {label}
            </Link>
          )
        })}
      </nav>
    </header>
  )
}

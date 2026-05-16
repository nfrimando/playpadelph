'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'

const NAV = [
  { href: '/admin/players', label: 'Players' },
  { href: '/admin/events', label: 'Events' },
  { href: '/admin/points', label: 'Points' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/signin')
    router.refresh()
  }

  return (
    <div className="w-[220px] min-h-screen bg-green-dark flex flex-col shrink-0">
      <div className="px-6 pt-7 pb-5 border-b border-white/[0.08]">
        <p className="font-display text-[18px] font-semibold text-oat leading-tight">
          Play Padel
        </p>
        <p className="text-[9px] tracking-[2.5px] uppercase text-oat/40 mt-0.5">
          Admin
        </p>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-0.5">
        {NAV.map(({ href, label }) => {
          const active = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center px-3 py-2 rounded-[3px] text-[11px] tracking-[1.5px] uppercase font-semibold transition-colors font-body
                ${active
                  ? 'bg-white/[0.14] text-oat'
                  : 'text-oat/50 hover:text-oat hover:bg-white/[0.06]'
                }`}
            >
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 pb-6 space-y-0.5">
        <Link
          href="/"
          className="flex items-center px-3 py-2 rounded-[3px] text-[11px] tracking-[1.5px] uppercase font-semibold text-oat/40 hover:text-oat/70 transition-colors font-body"
        >
          ← View site
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center px-3 py-2 rounded-[3px] text-[11px] tracking-[1.5px] uppercase font-semibold text-oat/40 hover:text-oat/70 transition-colors font-body text-left"
        >
          Sign out
        </button>
      </div>
    </div>
  )
}

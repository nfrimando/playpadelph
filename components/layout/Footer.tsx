'use client'

import { usePathname } from 'next/navigation'

export default function Footer() {
  const pathname = usePathname()

  if (pathname.startsWith('/admin')) return null

  return (
    <footer className="bg-green-dark pt-12 pb-7 px-9">
      <div className="max-w-content mx-auto">
        <div className="grid grid-cols-[1.2fr_1fr_1fr] gap-12 pb-9 border-b border-oat/[0.08] max-[720px]:grid-cols-1 max-[720px]:gap-8">
          <div>
            <div className="font-display text-[28px] font-semibold text-oat mb-2.5 tracking-[0.3px]">
              Play Padel
            </div>
            <div className="text-[9.5px] tracking-[2.5px] uppercase text-matcha mb-3.5">
              Official Rankings · Philippine Islands Padel Tour
            </div>
            <div className="text-xs text-oat/50 leading-[1.7] max-w-[300px]">
              The home of competitive padel in the Philippines — premium courts,
              sanctioned tournaments, and the official PIPT player rankings.
            </div>
          </div>

          <div>
            <div className="text-[9.5px] tracking-[2.5px] uppercase text-oat/40 mb-3.5 font-semibold">
              Get in touch
            </div>
            <div className="flex flex-col gap-[9px]">
              {[
                { key: 'Email', value: 'juancho@playpadelph.com', href: 'mailto:juancho@playpadelph.com' },
                { key: 'Phone', value: '+63 917 149 6824', href: 'tel:+639171496824' },
                { key: 'Insta', value: '@playpadelph', href: 'https://www.instagram.com/playpadelph' },
                { key: 'FB',    value: 'facebook.com/playpadelph', href: 'https://www.facebook.com/playpadelph' },
              ].map(({ key, value, href }) => (
                <a
                  key={key}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="text-xs text-oat/65 no-underline flex gap-2 items-start font-body hover:text-oat transition-colors"
                >
                  <span className="shrink-0 w-12 text-[9px] tracking-[1.5px] uppercase text-oat/35 pt-px">
                    {key}
                  </span>
                  <span>{value}</span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[9.5px] tracking-[2.5px] uppercase text-oat/40 mb-3.5 font-semibold">
              Locations
            </div>
            <div className="flex flex-col gap-[9px]">
              {[
                { key: 'Main', value: 'Play Padel Greenfield\nMandaluyong' },
                { key: 'Sat.', value: 'Play Padel McKinley West\nTaguig' },
              ].map(({ key, value }) => (
                <span key={key} className="text-xs text-oat/65 flex gap-2 items-start font-body">
                  <span className="shrink-0 w-12 text-[9px] tracking-[1.5px] uppercase text-oat/35 pt-px">
                    {key}
                  </span>
                  <span className="whitespace-pre-line leading-[1.5]">{value}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-[22px] flex-wrap gap-3">
          <div className="text-[10.5px] tracking-[1.5px] uppercase text-oat/30">
            © 2026 Play Padel Philippines
          </div>
          <div className="text-[10.5px] tracking-[1.5px] uppercase text-oat/45 flex items-center">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-matcha mr-2" />
            Rankings updated · Apr 27, 2026
          </div>
        </div>

        <div className="text-[11px] text-oat/[0.28] leading-[1.6] text-center mt-[18px] italic">
          Points expire when the same tournament runs again, or after 52 weeks — whichever comes first.
        </div>
      </div>
    </footer>
  )
}

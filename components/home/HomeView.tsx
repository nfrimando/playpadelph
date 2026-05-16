import Link from 'next/link'

const SECTIONS = [
  {
    href: '/rankings',
    overline: 'Official PIPT Rankings',
    title: 'Player',
    titleItalic: 'Rankings',
    description:
      'View player standings, points, and category rankings across the Philippine Islands Padel Tour.',
    cta: 'View Rankings',
  },
  {
    href: '/calendar',
    overline: 'Tournament Schedule',
    title: 'Tournament',
    titleItalic: 'Calendar',
    description:
      'Browse sanctioned PIPT tournaments, registration status, and upcoming event details.',
    cta: 'View Calendar',
  },
]

export default function HomeView() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-green relative overflow-hidden hero-watermark px-9 pt-[60px] pb-[52px]">
        <div className="max-w-content mx-auto relative z-10">
          <p className="text-[9.5px] tracking-[4px] uppercase text-matcha mb-4">
            Philippine Islands Padel Tour
          </p>
          <h1 className="font-display text-[68px] font-semibold text-oat leading-[.9] tracking-[-1px]">
            Play Padel
            <br />
            <em className="text-oat/50 not-italic">Philippines</em>
          </h1>
          <p className="text-xs text-oat/45 leading-[1.7] max-w-[460px] mt-5">
            The home of competitive padel in the Philippines — premium courts,
            sanctioned tournaments, and the official PIPT player rankings.
          </p>
          <div className="inline-flex items-center gap-2 bg-white/[0.08] border border-white/[0.12] rounded-[2px] px-3.5 py-1.5 mt-5">
            <span className="w-[5px] h-[5px] rounded-full bg-matcha inline-block" />
            <span className="text-[9.5px] tracking-[2.5px] uppercase text-oat/60">
              May 2025 – Apr 2026
            </span>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="bg-oat py-14">
        <div className="max-w-content mx-auto px-9">
          <div className="grid grid-cols-2 gap-6">
            {SECTIONS.map(({ href, overline, title, titleItalic, description, cta }) => (
              <div
                key={href}
                className="bg-white border border-line rounded-[3px] overflow-hidden flex flex-col"
              >
                <div className="h-[3px] bg-gradient-to-r from-matcha to-green" />
                <div className="p-8 flex flex-col flex-1">
                  <p className="text-[9px] tracking-[3px] uppercase text-matcha mb-5">
                    {overline}
                  </p>
                  <h2 className="font-display text-[28px] font-semibold text-ink leading-[1] tracking-[-0.5px] mb-3">
                    {title}
                    <br />
                    <em className="text-mid/60">{titleItalic}</em>
                  </h2>
                  <p className="text-xs text-mid leading-[1.7] mb-8 flex-1">
                    {description}
                  </p>
                  <Link
                    href={href}
                    className="block w-full text-center bg-green text-oat hover:bg-green-dark rounded-[2px] px-5 py-2.5 text-[9.5px] font-semibold tracking-[1.5px] uppercase transition-colors duration-150 font-body"
                  >
                    {cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Mail, Menu, Phone, X, Zap } from 'lucide-react'
import { CSIRT_EMAIL, HOTLINE } from '../data/mockData'

const NAV_LINKS = [
  { id: 'beranda', label: 'Beranda' },
  { id: 'profil', label: 'Profil & RFC 2350' },
  { id: 'mandat', label: 'Mandat Operasional' },
  { id: 'advisory', label: 'Advisory' },
  { id: 'lacak', label: 'Lacak Tiket' },
  { id: 'panduan', label: 'Panduan' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [active, setActive] = useState('beranda')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const spyIds = [...NAV_LINKS.map((l) => l.id), 'lapor']
    const sections = spyIds.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    )
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-35% 0px -55% 0px' },
    )
    sections.forEach((s) => obs.observe(s))
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawerOpen])

  const goTo = (id: string) => {
    setDrawerOpen(false)
    // scroll ditunda sampai lock overflow body dilepas, jika tidak browser membatalkan scroll
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }, 60)
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Emergency bar */}
      <div className="bg-ink text-white">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between gap-3 px-4 text-[11px] sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-4">
            <a
              href={`tel:${HOTLINE.replace(/[^+\d]/g, '')}`}
              className="flex items-center gap-1.5 font-mono font-semibold tracking-wide transition-colors hover:text-brand-bright"
            >
              <Phone size={11} className="text-brand-bright" />
              <span className="hidden sm:inline">HOTLINE 24/7:</span> {HOTLINE}
            </a>
            <a
              href={`mailto:${CSIRT_EMAIL}`}
              className="hidden items-center gap-1.5 font-mono tracking-wide text-slate-300 transition-colors hover:text-white md:flex"
            >
              <Mail size={11} className="text-brand-bright" />
              {CSIRT_EMAIL}
            </a>
          </div>
          <div className="flex shrink-0 items-center gap-2.5 font-mono text-[10px] font-bold tracking-[0.18em]">
            <span className="relative flex h-2 w-2">
              <span className="animate-radar absolute inline-flex h-full w-full rounded-full bg-brand-bright" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-bright" />
            </span>
            <span className="text-brand-bright">OPERATIONAL</span>
            <span className="hidden text-slate-400 sm:inline">24/7/365</span>
          </div>
        </div>
        <div className="h-[3px] w-full bg-gradient-to-r from-brand via-brand-bright to-ink" />
      </div>

      {/* Main navbar */}
      <div
        className={`border-b bg-white/95 backdrop-blur-md transition-shadow duration-300 ${
          scrolled ? 'border-line shadow-lg shadow-slate-900/5' : 'border-transparent'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => goTo('beranda')}
            className="group flex shrink-0 items-center"
            aria-label="WHOOSH CSIRT — kembali ke beranda"
          >
            <img
              src="/gemini-svg.svg"
              alt="WHOOSH CSIRT - PT KCIC"
              className="h-10 w-auto transition-transform duration-300 group-hover:scale-[1.03] sm:h-11"
            />
          </button>

          <nav className="hidden items-center gap-1 xl:flex" aria-label="Navigasi utama">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => goTo(link.id)}
                className={`relative rounded-md px-3 py-2 text-[13px] font-semibold transition-colors ${
                  active === link.id ? 'text-brand' : 'text-slate-600 hover:text-ink'
                }`}
              >
                {link.label}
                <span
                  className={`absolute inset-x-3 -bottom-[1px] h-[2px] bg-brand transition-transform duration-300 ${
                    active === link.id ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </button>
            ))}
          </nav>

          <div className="hidden items-center gap-2.5 xl:flex">
            <button
              onClick={() => goTo('lapor')}
              className="group relative flex items-center gap-1.5 overflow-hidden rounded-md bg-brand px-4 py-2 text-[13px] font-bold text-white shadow-md shadow-brand/30 transition-all hover:bg-brand-deep hover:shadow-lg hover:shadow-brand/40"
            >
              <Zap size={15} className="transition-transform group-hover:scale-125" />
              Laporkan Insiden
            </button>
          </div>

          <button
            onClick={() => setDrawerOpen(true)}
            className="flex h-10 w-10 items-center justify-center rounded-md border border-line text-ink xl:hidden"
            aria-label="Buka menu navigasi"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-[60] xl:hidden ${drawerOpen ? '' : 'pointer-events-none'}`}
        aria-hidden={!drawerOpen}
      >
        <div
          className={`absolute inset-0 bg-ink/60 backdrop-blur-sm transition-opacity duration-300 ${
            drawerOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setDrawerOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ${
            drawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <img src="/gemini-svg.svg" alt="WHOOSH CSIRT - PT KCIC" className="h-9 w-auto" />
            <button
              onClick={() => setDrawerOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-line text-slate-600"
              aria-label="Tutup menu"
            >
              <X size={18} />
            </button>
          </div>
          <div className="flex items-center justify-between border-b border-line bg-paper px-5 py-2.5">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              Kanal Pelaporan
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-2.5 py-1">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              <span className="font-mono text-[10px] font-bold tracking-wider text-green-700">
                AKTIF 24/7
              </span>
            </span>
          </div>
          <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Navigasi mobile">
            {NAV_LINKS.map((link, i) => (
              <button
                key={link.id}
                onClick={() => goTo(link.id)}
                className={`flex w-full items-center justify-between rounded-lg px-4 py-3.5 text-left text-[15px] font-semibold transition-colors ${
                  active === link.id
                    ? 'bg-brand-soft text-brand-deep'
                    : 'text-slate-700 hover:bg-paper'
                }`}
              >
                <span>{link.label}</span>
                <span className="font-mono text-[10px] text-slate-400">0{i + 1}</span>
              </button>
            ))}
          </nav>
          <div className="space-y-2.5 border-t border-line p-4">
            <button
              onClick={() => goTo('lapor')}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-brand py-3 text-sm font-bold text-white shadow-md shadow-brand/30"
            >
              <Zap size={16} /> Laporkan Insiden
            </button>
            <p className="pt-1 text-center font-mono text-[10px] tracking-wider text-slate-500">
              HOTLINE 24/7 · {HOTLINE}
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
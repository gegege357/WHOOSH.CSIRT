import { Fingerprint, Mail, MapPin, Phone, ShieldCheck, Zap } from 'lucide-react'
import { CSIRT_EMAIL, HOTLINE, PGP_FINGERPRINT, PGP_KEY_ID } from '../data/mockData'

const QUICK_LINKS = [
  { id: 'beranda', label: 'Beranda' },
  { id: 'profil', label: 'Profil & RFC 2350' },
  { id: 'mandat', label: 'Mandat & Ruang Lingkup' },
  { id: 'advisory', label: 'Security Advisories' },
  { id: 'lapor', label: 'Laporkan Insiden' },
  { id: 'lacak', label: 'Lacak Tiket' },
  { id: 'panduan', label: 'Panduan & FAQ' },
]

export default function Footer() {
  const goTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <footer className="border-t-4 border-brand bg-ink text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* brand */}
          <div className="lg:col-span-4">
            {/* badge putih menjaga kontras tipografi hitam SVG di atas footer hitam */}
            <div className="inline-flex items-center bg-white px-3.5 py-2 rounded-lg shadow-sm mb-4">
              <img
                src="/gemini-svg.svg"
                alt="WHOOSH CSIRT - PT KCIC"
                className="h-10 w-auto"
              />
            </div>
            <p className="max-w-sm text-[13px] leading-relaxed text-slate-400">
              Tim Tanggap Insiden Keamanan Siber resmi PT Kereta Cepat Indonesia China
              (KCIC) — operator kereta cepat Whoosh koridor Jakarta–Bandung. Penanganan
              insiden, peringatan dini, dan koordinasi keamanan sistem digital operasional.
              Non-komersial · 24/7/365. Cakupan penanganan hanya aset digital KCIC/Whoosh;
              portal ini wadah publik uji keamanan &amp; pelaporan kerentanan, bukan layanan
              CSIRT komersial.
            </p>
            <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-white/10 bg-white/[0.04] p-4">
              <ShieldCheck size={16} className="mt-0.5 shrink-0 text-brand-bright" />
              <p className="text-[11.5px] leading-relaxed text-slate-400">
                Beroperasi dalam koordinasi keamanan siber nasional bersama{' '}
                <strong className="font-bold text-white">BSSN</strong> dan{' '}
                <strong className="font-bold text-white">Id-SIRTII/CC</strong>, sesuai RFC 2350
                dan regulasi Infrastruktur Informasi Vital (IIV) sektor transportasi.
              </p>
            </div>
          </div>

          {/* emergency contact */}
          <div className="lg:col-span-4">
            <h4 className="mb-4 font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-brand-bright">
              Kontak Darurat 24/7
            </h4>
            <ul className="space-y-3.5 text-sm">
              <li>
                <a href={`tel:${HOTLINE.replace(/[^+\d]/g, '')}`} className="group flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand text-white transition-transform group-hover:scale-110">
                    <Phone size={15} />
                  </span>
                  <span>
                    <span className="block font-mono text-base font-bold tracking-wide text-white group-hover:text-brand-bright">{HOTLINE}</span>
                    <span className="block text-[11px] text-slate-500">Hotline insiden CRITICAL — bebas pulsa</span>
                  </span>
                </a>
              </li>
              <li>
                <a href={`mailto:${CSIRT_EMAIL}`} className="group flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-md bg-white/10 text-white transition-colors group-hover:bg-brand">
                    <Mail size={15} />
                  </span>
                  <span>
                    <span className="block font-mono text-[13px] font-bold text-white group-hover:text-brand-bright">{CSIRT_EMAIL}</span>
                    <span className="block text-[11px] text-slate-500">Umum · incident@kcic.co.id (PGP)</span>
                  </span>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white/10 text-white">
                  <MapPin size={15} />
                </span>
                <span className="text-[12.5px] leading-relaxed text-slate-400">
                  Gedung KCIC Cyber Operations Center<br />
                  Jl. Jend. Sudirman Kav. 52-53, Jakarta Selatan 12190
                </span>
              </li>
            </ul>
            <div className="mt-5 rounded-lg border border-white/10 bg-white/[0.04] p-4">
              <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
                <Fingerprint size={12} className="text-brand-bright" /> PGP Fingerprint ({PGP_KEY_ID})
              </div>
              <code className="block break-all font-mono text-[11px] leading-relaxed text-green-400">
                {PGP_FINGERPRINT}
              </code>
            </div>
          </div>

          {/* quick links */}
          <div className="lg:col-span-4">
            <h4 className="mb-4 font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-brand-bright">
              Tautan Cepat
            </h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5">
              {QUICK_LINKS.map((l) => (
                <li key={l.id}>
                  <button
                    onClick={() => goTo(l.id)}
                    className="group flex items-center gap-1.5 text-[13px] font-medium text-slate-400 transition-colors hover:text-white"
                  >
                    <span className="h-px w-3 bg-brand transition-all group-hover:w-5" />
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
            <button
              onClick={() => goTo('lapor')}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-brand px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand/30 transition-all hover:bg-brand-deep hover:shadow-brand/50"
            >
              <Zap size={16} />
              Laporkan Insiden Sekarang
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 font-mono text-[10.5px] tracking-wider text-slate-500 sm:flex-row sm:px-6 lg:px-8">
          <span>© 2026 WHOOSH CSIRT · PT KERETA CEPAT INDONESIA CHINA (KCIC)</span>
          <span className="flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-radar absolute inline-flex h-full w-full rounded-full bg-green-500" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
            </span>
            ALL SYSTEMS OPERATIONAL · TLP:CLEAR
          </span>
        </div>
      </div>
    </footer>
  )
}
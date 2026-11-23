import { Activity, ArrowRight, Clock, FileBadge, KeyRound, Lock, Radar, TrainFront, Zap } from 'lucide-react'

const METRICS = [
  {
    icon: Clock,
    value: '< 15 Menit',
    label: 'Respons Triase Awal',
    detail: 'Insiden CRITICAL ditangani analis manusia dalam hitungan menit.',
  },
  {
    icon: Radar,
    value: '24/7/365',
    label: 'Siaga Operasional',
    detail: 'Tiga shift analis memantau kanal laporan tanpa hari libur.',
  },
  {
    icon: Lock,
    value: 'TLP:RED',
    label: 'Kerahasiaan Terjamin',
    detail: 'Identitas pelapor dilindungi penuh, komunikasi terenkripsi PGP.',
  },
  {
    icon: FileBadge,
    value: 'RFC 2350',
    label: 'Standar Kepatuhan',
    detail: 'Profil tim & mandat sesuai RFC 2350 dan regulasi IIV sektor transportasi — BSSN.',
  },
]

export default function Hero({ onOpenPgp }: { onOpenPgp: () => void }) {
  const scrollToReport = () => {
    document.getElementById('lapor')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="beranda" className="relative overflow-hidden bg-white pt-[103px]">
      {/* layered background */}
      <div className="grid-paper pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -right-40 -top-24 h-[560px] w-[560px] rounded-full bg-brand/[0.05] blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-ink/[0.04] blur-3xl" />

      {/* speed motif — diagonal stripes */}
      <div className="pointer-events-none absolute right-0 top-[103px] hidden h-full w-[42%] lg:block" aria-hidden="true">
        <div className="absolute right-[-6%] top-[8%] h-[3px] w-[70%] -rotate-[24deg] bg-brand animate-speed-line" />
        <div className="absolute right-[-10%] top-[20%] h-[6px] w-[85%] -rotate-[24deg] bg-ink animate-speed-line [animation-delay:0.5s]" />
        <div className="absolute right-[-4%] top-[31%] h-[2px] w-[55%] -rotate-[24deg] bg-brand/60 animate-speed-line [animation-delay:1s]" />
        <div className="absolute right-[-12%] top-[44%] h-[10px] w-[92%] -rotate-[24deg] bg-gradient-to-r from-brand via-brand-bright to-transparent animate-speed-line [animation-delay:1.4s]" />
        <div className="absolute right-[-6%] top-[58%] h-[3px] w-[62%] -rotate-[24deg] bg-ink/70 animate-speed-line [animation-delay:0.8s]" />
        <div className="absolute right-[-9%] top-[70%] h-[2px] w-[75%] -rotate-[24deg] bg-brand/40 animate-speed-line [animation-delay:1.9s]" />
        <div className="speed-stripes absolute inset-y-0 right-0 w-2/3 opacity-70" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:px-8 lg:pb-20 lg:pt-20">
        <div className="max-w-3xl">
          {/* identitas institusi */}
          <div className="animate-fade-up mb-6 inline-flex flex-wrap items-center gap-2 rounded-full border border-line bg-white px-4 py-1.5 shadow-sm">
            <TrainFront size={14} className="text-brand" />
            <span className="font-mono text-[11px] font-bold tracking-[0.14em] text-slate-600">
              PT KERETA CEPAT INDONESIA CHINA (KCIC)
            </span>
            <span className="rounded-full bg-brand px-2 py-px font-mono text-[10px] font-bold tracking-wider text-white">
              WHOOSH
            </span>
          </div>

          <h1 className="animate-fade-up font-display text-4xl font-bold leading-[1.06] tracking-tight text-ink [animation-delay:100ms] sm:text-5xl lg:text-[64px]">
            <span className="text-brand">WHOOSH</span> CSIRT —
            <br />
            Rapid Cyber Incident
            <br />
            Response &amp; <span className="relative inline-block">
              Defense
              <span className="absolute -bottom-1 left-0 h-[6px] w-full -skew-x-12 bg-brand/85" />
            </span>
          </h1>

          <p className="animate-fade-up mt-6 max-w-xl text-base leading-relaxed text-slate-600 [animation-delay:200ms] sm:text-lg">
            Tim Tanggap Insiden Keamanan Siber resmi PT KCIC — operator kereta cepat Whoosh
            koridor Jakarta–Bandung (Halim · Karawang · Padalarang · Tegalluar).{' '}
            <strong className="font-semibold text-ink">Penanganan insiden darurat, peringatan dini
            kerentanan, dan koordinasi keamanan sistem digital operasional kereta cepat</strong>, siaga 24 jam.
          </p>

          <div className="animate-fade-up mt-8 flex flex-col gap-3 [animation-delay:300ms] sm:flex-row sm:items-center">
            <button
              onClick={scrollToReport}
              className="group flex items-center justify-center gap-2 rounded-md bg-brand px-7 py-3.5 text-[15px] font-bold text-white shadow-lg shadow-brand/30 transition-all hover:-translate-y-0.5 hover:bg-brand-deep hover:shadow-xl hover:shadow-brand/40"
            >
              <Zap size={18} className="transition-transform group-hover:scale-125" />
              Laporkan Insiden Sekarang
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={onOpenPgp}
              className="flex items-center justify-center gap-2 rounded-md border-2 border-ink bg-white px-7 py-3.5 text-[15px] font-bold text-ink transition-all hover:-translate-y-0.5 hover:bg-ink hover:text-white"
            >
              <KeyRound size={17} />
              Unduh PGP Key
            </button>
          </div>

          <div className="animate-fade-up mt-8 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] tracking-wider text-slate-500 [animation-delay:400ms]">
            <Activity size={13} className="text-green-600" />
            <span>SEMUA KANAL PELAPORAN NORMAL</span>
            <span className="hidden text-slate-300 sm:inline">|</span>
            <span>LAST SYNC: REAL-TIME</span>
            <span className="hidden text-slate-300 sm:inline">|</span>
            <span>CAKUPAN: ASET KCIC / WHOOSH SAJA</span>
          </div>
        </div>

        {/* metrics */}
        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {METRICS.map((m, i) => (
            <div
              key={m.value}
              className="animate-fade-up group relative overflow-hidden rounded-xl border border-line bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl hover:shadow-brand/10"
              style={{ animationDelay: `${450 + i * 90}ms` }}
            >
              <span className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-brand to-ink opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="mb-3 flex items-center justify-between">
                <m.icon size={20} className="text-brand" strokeWidth={2.2} />
                <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-slate-300">
                  0{i + 1}
                </span>
              </div>
              <div className="font-display text-2xl font-bold tracking-tight text-ink">{m.value}</div>
              <div className="mt-0.5 text-[13px] font-semibold text-brand-deep">{m.label}</div>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">{m.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* bottom slant divider */}
      <div className="relative h-8 bg-ink clip-slant" aria-hidden="true" />
    </section>
  )
}
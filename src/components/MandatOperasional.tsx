import {
  BellRing,
  BookOpen,
  ChevronRight,
  GraduationCap,
  Mail,
  Network,
  Phone,
  RefreshCcw,
  ShieldCheck,
  Siren,
  Zap,
} from 'lucide-react'
import { CSIRT_EMAIL, HOTLINE } from '../data/mockData'
import { Reveal, SectionHeading } from './ui'

const MANDAT = [
  {
    no: '01',
    icon: Siren,
    title: 'Triase Insiden',
    objective:
      'Menerima, memverifikasi, dan mengklasifikasikan laporan insiden serta temuan uji keamanan publik sebagai pintu masuk tunggal penanganan.',
    steps: [
      'Verifikasi keaslian laporan dan kelengkapan bukti melalui hotline, email PGP, atau formulir portal.',
      'Klasifikasi tingkat urgensi (CRITICAL–LOW) dan kerahasiaan (TLP) sesuai kebijakan insiden.',
      'Buka tiket investigasi, tugaskan analis, dan mulai timeline penanganan.',
    ],
    outputs: ['Tiket insiden', 'Severity & TLP', 'Timeline triase'],
  },
  {
    no: '02',
    icon: Network,
    title: 'Koordinasi Penanganan',
    objective:
      'Mengorkestrasi koordinasi penanganan insiden pada aset KCIC/Whoosh bersama pemilik sistem internal dan otoritas berwenang, tanpa mengambil alih kepemilikan sistem.',
    steps: [
      'Tetapkan kanal komunikasi dan titik kontak: pemilik sistem internal KCIC, ISP/hosting selaku mitra koordinasi, CSIRT sektoral transportasi, dan BSSN.',
      'Distribusikan IoC dan temuan teknis sesuai klasifikasi TLP yang berlaku.',
      'Pantau progres containment dan catat setiap keputusan pada audit log operasional.',
    ],
    outputs: ['Kanal koordinasi', 'Distribusi IoC', 'Catatan audit'],
  },
  {
    no: '03',
    icon: RefreshCcw,
    title: 'Pemulihan Sistem Terdampak',
    objective:
      'Mendampingi eradikasi akar penyebab dan pemulihan sistem KCIC/Whoosh terdampak hingga tervalidasi bersih dan layanan kembali normal.',
    steps: [
      'Isolasi sistem terdampak dan amankan bukti forensik (disk, memori, log).',
      'Eradikasi akar penyebab, lalu restore dari backup bersih bersama pemilik sistem internal KCIC.',
      'Validasi pasca-pemulihan dan terbitkan laporan akhir (RCA) maksimal 5 hari kerja.',
    ],
    outputs: ['Prosedur eradikasi', 'Validasi pemulihan', 'Laporan RCA'],
  },
  {
    no: '04',
    icon: BellRing,
    title: 'Penerbitan Peringatan Dini',
    objective:
      'Memantau kerentanan dan kampanye aktif, lalu menerbitkan advisory serta tingkat ancaman internal bagi ekosistem digital KCIC/Whoosh secara terkurasi.',
    steps: [
      'Pantau feed CVE NVD (API v2.0) dan indikasi eksploitasi aktif di lapangan.',
      'Nilai dampak terhadap infrastruktur KCIC/Whoosh: skor CVSS, versi terdampak, vektor serangan.',
      'Terbitkan advisory berisi langkah mitigasi; tingkat ancaman internal dikelola SOC dan tidak dipublikasikan.',
    ],
    outputs: ['Security advisory', 'Tingkat ancaman internal', 'Buletin IoC'],
  },
  {
    no: '05',
    icon: GraduationCap,
    title: 'Edukasi & Kesadaran Keamanan',
    objective:
      'Meningkatkan kesiapan staf internal KCIC dan mitra koordinasi melalui panduan prosedural, awareness, dan latihan tanggap insiden.',
    steps: [
      'Terbitkan panduan pelaporan, baseline hardening, dan prosedur eskalasi.',
      'Selenggarakan sesi awareness dan simulasi phishing bagi staf internal KCIC.',
      'Fasilitasi tabletop exercise tanggap insiden bersama mitra koordinasi operasional.',
    ],
    outputs: ['Panduan & baseline', 'Materi awareness', 'Hasil exercise'],
  },
]

const CAKUPAN = [
  'Web & portal KCIC — kcic.co.id beserta subdomain resmi, portal korporat, dan layanan web publik KCIC.',
  'Sistem digital & operasi Whoosh — ticketing & AFC gate, passenger information system, Wi-Fi stasiun/kereta, jaringan stasiun (Halim, Karawang, Padalarang, Tegalluar), OCC, depo, dan kantor pusat.',
  'Kanal publik (VDP) — peneliti keamanan & masyarakat menguji aset cakupan secara beritikad baik lalu melapor ke portal ini; bukan klien layanan komersial.',
]

export default function MandatOperasional() {
  return (
    <section id="mandat" className="relative overflow-hidden bg-white py-20 lg:py-24">
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-brand/[0.04] blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            kicker="Mandat Operasional · RFC 2350"
            title="Mandat & Ruang Lingkup Operasional (RFC 2350)"
            description="WHOOSH CSIRT adalah CSIRT internal PT Kereta Cepat Indonesia China (KCIC) untuk ekosistem digital kereta cepat Whoosh. Portal ini sekaligus wadah publik untuk uji keamanan dan pelaporan kerentanan/insiden pada aset KCIC/Whoosh sesuai RFC 2350 serta regulasi IIV sektor transportasi — BSSN. Penanganan terbatas pada aset KCIC/Whoosh; web/sistem pihak lain tidak ditangani."
          />
        </Reveal>

        <div className="grid gap-5 lg:grid-cols-12">
          {/* Piagam mandat — sticky charter panel */}
          <Reveal className="lg:col-span-4" delay={60}>
            <div className="lg:sticky lg:top-28">
              <div className="relative overflow-hidden rounded-2xl bg-ink p-7 text-white shadow-xl sm:p-8">
                <div className="grid-dark pointer-events-none absolute inset-0" />
                <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rotate-12 bg-brand/15" />
                <div className="pointer-events-none absolute right-8 top-0 h-full w-[2px] bg-gradient-to-b from-brand via-brand/30 to-transparent" />
                <div className="relative">
                  <div className="mb-2 flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand">
                      <ShieldCheck size={18} />
                    </span>
                    <span className="font-mono text-[11px] font-bold tracking-[0.24em] text-brand-bright">
                      PIAGAM MANDAT
                    </span>
                  </div>
                  <h3 className="font-display text-2xl font-bold">Kerangka Mandat Tim</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    CSIRT resmi PT Kereta Cepat Indonesia China (KCIC) yang beroperasi
                    24/7/365 menjaga ekosistem digital kereta cepat Whoosh. Mandat,
                    konstituen, dan otoritas tim dipublikasikan sesuai RFC 2350 dan
                    regulasi IIV sektor transportasi — BSSN. Cakupan penanganan hanya
                    aset digital KCIC/Whoosh.
                  </p>

                  <div className="mt-6 font-mono text-[10px] font-bold tracking-[0.24em] text-slate-500">
                    CAKUPAN ASET & KANAL
                  </div>
                  <div className="mt-2.5 space-y-2.5">
                    {CAKUPAN.map((k) => (
                      <div key={k} className="flex items-start gap-2 rounded-md bg-white/[0.04] px-3 py-2.5">
                        <ChevronRight size={13} className="mt-0.5 shrink-0 text-brand-bright" />
                        <span className="text-[12px] leading-relaxed text-slate-300">{k}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 rounded-lg border border-brand/50 bg-brand/10 p-4">
                    <div className="mb-1.5 font-mono text-[10px] font-bold tracking-[0.24em] text-brand-bright">
                      BATAS CAKUPAN — KCIC/WHOOSH SAJA
                    </div>
                    <p className="text-[11.5px] leading-relaxed text-slate-300">
                      WHOOSH CSIRT tidak menangani, memperbaiki, atau memulihkan web/sistem
                      di luar KCIC/Whoosh. Laporan di luar cakupan tidak diremediasi —
                      diarahkan ke pemilik sistem atau CSIRT berwenang (BSSN / Id-SIRTII /
                      CSIRT sektoral). Portal ini wadah uji keamanan &amp; pelaporan publik,
                      bukan penawaran layanan CSIRT komersial.
                    </p>
                  </div>

                  <button
                    onClick={() => document.getElementById('profil')?.scrollIntoView({ behavior: 'smooth' })}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-md border border-white/25 px-4 py-2.5 font-mono text-[11px] font-bold tracking-wider text-white transition-colors hover:border-brand-bright hover:bg-brand/15"
                  >
                    <BookOpen size={14} /> BACA PROFIL & DOKUMEN RFC 2350
                  </button>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Lima tugas pokok prosedural */}
          <div className="space-y-5 lg:col-span-8">
            {MANDAT.map((m, i) => (
              <Reveal key={m.no} delay={i * 60}>
                <div className="group relative overflow-hidden rounded-xl border border-line bg-paper p-6 shadow-sm transition-all duration-300 hover:border-brand/40 hover:bg-white hover:shadow-xl hover:shadow-brand/10 sm:p-7">
                  <span className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-brand to-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="flex flex-col gap-5 sm:flex-row">
                    <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-start sm:gap-2.5">
                      <span className="font-mono text-[26px] font-bold leading-none text-brand/25 transition-colors group-hover:text-brand/50">
                        {m.no}
                      </span>
                      <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-ink text-white shadow-md transition-colors duration-300 group-hover:bg-brand">
                        <m.icon size={20} />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-[17px] font-bold leading-snug text-ink">
                        {m.title}
                      </h3>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600">{m.objective}</p>
                      <div className="mt-4 grid gap-4 md:grid-cols-5">
                        <div className="md:col-span-3">
                          <div className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                            Prosedur
                          </div>
                          <ol className="space-y-1.5">
                            {m.steps.map((s, j) => (
                              <li key={j} className="flex gap-2 text-[12px] leading-relaxed text-slate-600">
                                <span className="mt-px flex h-4 w-4 shrink-0 items-center justify-center rounded bg-ink font-mono text-[9px] font-bold text-white">
                                  {j + 1}
                                </span>
                                {s}
                              </li>
                            ))}
                          </ol>
                        </div>
                        <div className="md:col-span-2">
                          <div className="mb-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                            Keluaran Operasional
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {m.outputs.map((o) => (
                              <span
                                key={o}
                                className="rounded-md border border-brand/30 bg-brand-soft px-2 py-1 font-mono text-[10px] font-bold text-brand-deep"
                              >
                                {o}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Kanal eskalasi operasional */}
        <Reveal delay={80}>
          <div className="mt-10 flex flex-col gap-4 rounded-2xl bg-ink p-6 text-white shadow-xl sm:p-7 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="font-mono text-[10px] font-bold tracking-[0.24em] text-brand-bright">
                ESKALASI & KOORDINASI OPERASIONAL
              </div>
              <p className="mt-1 max-w-xl text-sm leading-relaxed text-slate-400">
                Insiden aktif atau indikasi eksploitasi pada aset KCIC/Whoosh? Gunakan kanal
                resmi berikut — triase awal CRITICAL di bawah 15 menit, 24/7/365. Laporan di
                luar cakupan diarahkan ke pemilik sistem atau CSIRT berwenang.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row">
              <a
                href={`tel:${HOTLINE.replace(/[^+\d]/g, '')}`}
                className="flex items-center justify-center gap-2 rounded-md bg-brand px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-brand/30 transition-colors hover:bg-brand-deep"
              >
                <Phone size={14} /> Hotline {HOTLINE}
              </a>
              <a
                href={`mailto:${CSIRT_EMAIL}`}
                className="flex items-center justify-center gap-2 rounded-md border border-white/25 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:border-brand-bright hover:bg-brand/15"
              >
                <Mail size={14} /> {CSIRT_EMAIL}
              </a>
              <button
                onClick={() => document.getElementById('lapor')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center justify-center gap-2 rounded-md bg-white px-4 py-2.5 text-xs font-bold text-ink transition-colors hover:bg-brand-bright hover:text-white"
              >
                <Zap size={14} /> Formulir Laporan
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
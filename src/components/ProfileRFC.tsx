import { useState } from 'react'
import {
  Crosshair,
  Download,
  Eye,
  FileText,
  Flag,
  Globe2,
  KeyRound,
  Mail,
  MapPin,
  Phone,
  Scale,
  Server,
  Target,
  TrainFront,
} from 'lucide-react'
import { CSIRT_EMAIL, HOTLINE, PGP_FINGERPRINT, PGP_KEY_ID, RFC2350_CONTENT } from '../data/mockData'
import { Reveal, SectionHeading, downloadTextFile } from './ui'

type Tab = 'tentang' | 'rfc'

const CONSTITUENTS = [
  {
    icon: TrainFront,
    title: 'Operasi Stasiun & OCC',
    desc: 'Stasiun Halim, Karawang, Padalarang, Tegalluar, Operation Control Center, depo, dan kantor pusat PT KCIC.',
  },
  {
    icon: Server,
    title: 'Sistem Digital Operasional',
    desc: 'Ticketing & AFC gate, passenger information system, Wi-Fi stasiun/kereta, dan portal korporat KCIC.',
  },
  {
    icon: Globe2,
    title: 'Web & Portal KCIC',
    desc: 'kcic.co.id beserta subdomain resmi, portal korporat, dan layanan web publik KCIC — sasaran utama uji keamanan publik (VDP).',
  },
  {
    icon: Target,
    title: 'Kanal Uji Keamanan Publik (VDP)',
    desc: 'Peneliti keamanan dan masyarakat menguji aset cakupan secara beritikad baik, lalu melaporkan temuan ke WHOOSH CSIRT lewat portal ini.',
  },
]

const RFC_SECTIONS = [
  {
    icon: FileText,
    title: '1. Informasi Dokumen',
    rows: [
      ['Versi / Pembaruan', 'v3.2 — 12 Januari 2026'],
      ['Distribusi', 'Publik (TLP:CLEAR) · Bahasa Indonesia'],
      ['Kepatuhan', 'RFC 2350 · Regulasi IIV Sektor Transportasi (BSSN) · FIRST CSIRT Services Framework'],
    ],
  },
  {
    icon: Phone,
    title: '2. Informasi Kontak',
    rows: [
      ['Hotline Darurat', `${HOTLINE} (24/7/365)`],
      ['Email Umum / Insiden', `${CSIRT_EMAIL} · incident@kcic.co.id`],
      ['Alamat', 'Gedung KCIC Cyber Operations Center, Jl. Jend. Sudirman Kav. 52-53, Jakarta Selatan'],
      ['Kunci PGP', `${PGP_KEY_ID} · ${PGP_FINGERPRINT}`],
    ],
  },
  {
    icon: Scale,
    title: '4. Kebijakan & Klasifikasi Insiden',
    rows: [
      ['CRITICAL', 'Layanan vital terganggu aktif — respons awal < 15 menit'],
      ['HIGH', 'Kompromi terkonfirmasi sistem penting — respons awal < 30 menit'],
      ['MEDIUM / LOW', 'Indikasi tanpa dampak langsung — < 2 jam / < 1 hari kerja'],
      ['Kerahasiaan', 'Minimum TLP:AMBER · identitas pelapor tidak dipublikasikan'],
    ],
  },
  {
    icon: Crosshair,
    title: '5–6. Mandat & Alur Pelaporan',
    rows: [
      ['Mandat', 'Triase, koordinasi, pemulihan aset KCIC/Whoosh, peringatan dini, edukasi — non-komersial'],
      ['Batas Cakupan', 'Hanya aset KCIC/Whoosh; web/sistem pihak lain tidak diremediasi'],
      ['Kanal Laporan', 'Formulir portal · email PGP · hotline (khusus CRITICAL)'],
      ['Siklus Tiket', 'OPEN → INVESTIGATING → CONTAINMENT → RESOLVED'],
      ['Laporan Akhir', 'RCA maksimal 5 hari kerja setelah RESOLVED'],
    ],
  },
]

export default function ProfileRFC({ onOpenPgp }: { onOpenPgp: () => void }) {
  const [tab, setTab] = useState<Tab>('tentang')

  return (
    <section id="profil" className="relative bg-paper py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            kicker="Profil Organisasi"
            title="Mandat, Konstituen & Dokumen RFC 2350"
            description="WHOOSH CSIRT adalah tim tanggap insiden siber resmi PT Kereta Cepat Indonesia China (KCIC), berjejaring dengan BSSN (otoritas IIV sektor transportasi) dan Id-SIRTII/CC, serta mempublikasikan profil tim sesuai standar RFC 2350. Cakupan penanganan terbatas pada aset digital KCIC/Whoosh; portal sekaligus wadah publik uji keamanan dan pelaporan kerentanan (VDP)."
          />
        </Reveal>

        <Reveal delay={80}>
          <div className="mb-8 inline-flex rounded-lg border border-line bg-white p-1 shadow-sm">
            <button
              onClick={() => setTab('tentang')}
              className={`flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-bold transition-all sm:px-6 ${
                tab === 'tentang'
                  ? 'bg-brand text-white shadow-md shadow-brand/30'
                  : 'text-slate-600 hover:text-ink'
              }`}
            >
              <Flag size={15} />
              Tentang & Konstituen
            </button>
            <button
              onClick={() => setTab('rfc')}
              className={`flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-bold transition-all sm:px-6 ${
                tab === 'rfc'
                  ? 'bg-brand text-white shadow-md shadow-brand/30'
                  : 'text-slate-600 hover:text-ink'
              }`}
            >
              <FileText size={15} />
              Dokumen RFC 2350
            </button>
          </div>
        </Reveal>

        {tab === 'tentang' ? (
          <div key="tentang" className="animate-fade-up grid gap-6 lg:grid-cols-5">
            <div className="space-y-6 lg:col-span-2">
              <div className="relative overflow-hidden rounded-xl bg-ink p-7 text-white shadow-xl">
                <div className="grid-dark pointer-events-none absolute inset-0" />
                <div className="relative">
                  <div className="mb-4 flex items-center gap-2 font-mono text-[11px] font-bold tracking-[0.22em] text-brand-bright">
                    <Eye size={14} /> VISI
                  </div>
                  <p className="font-display text-xl font-semibold leading-snug">
                    Menjadi tim tanggap insiden siber terdepan yang menjamin ketahanan ekosistem
                    digital kereta cepat Whoosh melalui respons{' '}
                    <span className="text-brand-bright">cepat, presisi, dan terukur</span>.
                  </p>
                </div>
                <span className="absolute -right-6 -top-6 h-24 w-24 rotate-12 bg-brand/20" />
              </div>
              <div className="rounded-xl border border-line bg-white p-7 shadow-sm">
                <div className="mb-4 flex items-center gap-2 font-mono text-[11px] font-bold tracking-[0.22em] text-brand">
                  <Target size={14} /> MISI
                </div>
                <ul className="space-y-3.5">
                  {[
                    'Triase dan penanganan insiden dengan respons awal di bawah 15 menit.',
                    'Koordinasi pemulihan sistem KCIC/Whoosh bersama pemilik infrastruktur internal.',
                    'Peringatan dini dan advisory kerentanan berkala bagi ekosistem digital KCIC/Whoosh.',
                    'Peningkatan kapabilitas keamanan melalui edukasi, asesmen, dan latihan.',
                  ].map((m, i) => (
                    <li key={i} className="flex gap-3 text-sm leading-relaxed text-slate-700">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center bg-brand font-mono text-[10px] font-bold text-white">
                        {i + 1}
                      </span>
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="mb-5 flex items-center gap-2">
                <Globe2 size={17} className="text-brand" />
                <h3 className="font-display text-lg font-bold text-ink">Cakupan Aset yang Dilindungi & Diuji</h3>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {CONSTITUENTS.map((c, i) => (
                  <div
                    key={c.title}
                    className="group rounded-xl border border-line bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-brand-soft text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                      <c.icon size={21} />
                    </span>
                    <h4 className="font-display text-base font-bold text-ink">{c.title}</h4>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600">{c.desc}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-xl border-2 border-brand/40 bg-brand-soft/60 p-5">
                <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-brand-deep">
                  <Crosshair size={13} /> Di luar cakupan — tidak ditangani
                </div>
                <p className="mt-2 text-[12.5px] leading-relaxed text-slate-700">
                  Web/sistem organisasi lain di luar KCIC/Whoosh (mitra, vendor, ISP, hosting){' '}
                  <strong className="font-bold text-ink">tidak kami tangani atau perbaiki</strong>.
                  Laporan di luar cakupan diarahkan ke pemilik sistem atau CSIRT berwenang
                  (BSSN / Id-SIRTII / CSIRT sektoral terkait). Portal ini wadah uji keamanan &amp;
                  pelaporan publik, bukan layanan CSIRT komersial.
                </p>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-dashed border-slate-300 bg-white px-5 py-4 font-mono text-[11px] tracking-wide text-slate-500">
                <span className="flex items-center gap-1.5"><MapPin size={12} className="text-brand" /> JAKARTA SELATAN, ID</span>
                <span className="flex items-center gap-1.5"><Phone size={12} className="text-brand" /> {HOTLINE}</span>
                <span className="flex items-center gap-1.5"><Mail size={12} className="text-brand" /> {CSIRT_EMAIL}</span>
                <span className="flex items-center gap-1.5"><Scale size={12} className="text-brand" /> KOORDINASI: BSSN / Id-SIRTII</span>
              </div>
            </div>
          </div>
        ) : (
          <div key="rfc" className="animate-fade-up">
            <div className="grid gap-4 lg:grid-cols-2">
              {RFC_SECTIONS.map((s) => (
                <div
                  key={s.title}
                  className="rounded-xl border border-line border-l-4 border-l-brand bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="mb-4 flex items-center gap-2.5">
                    <s.icon size={18} className="text-brand" />
                    <h4 className="font-display text-[15px] font-bold text-ink">{s.title}</h4>
                  </div>
                  <dl className="space-y-2.5">
                    {s.rows.map(([k, v]) => (
                      <div key={k} className="grid grid-cols-[130px_1fr] gap-3 text-[13px] sm:grid-cols-[150px_1fr]">
                        <dt className="font-mono text-[11px] font-bold uppercase tracking-wide text-slate-500">{k}</dt>
                        <dd className="leading-relaxed text-slate-700">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-3 rounded-xl bg-ink p-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-md text-sm leading-relaxed text-slate-300">
                Dokumen lengkap mencakup 6 bab: informasi dokumen, kontak, konstituen & otoritas,
                kebijakan insiden, mandat & ruang lingkup operasional, serta prosedur pelaporan.
              </p>
              <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row">
                <button
                  onClick={() => downloadTextFile('WHOOSH-CSIRT-RFC2350.txt', RFC2350_CONTENT)}
                  className="flex items-center justify-center gap-2 rounded-md bg-brand px-5 py-3 text-sm font-bold text-white shadow-md shadow-brand/40 transition-colors hover:bg-brand-deep"
                >
                  <Download size={16} />
                  Unduh Dokumen RFC 2350
                </button>
                <button
                  onClick={onOpenPgp}
                  className="flex items-center justify-center gap-2 rounded-md border-2 border-white/70 px-5 py-3 text-sm font-bold text-white transition-colors hover:border-brand-bright hover:bg-brand-bright/10"
                >
                  <KeyRound size={16} />
                  Lihat Public PGP Key
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
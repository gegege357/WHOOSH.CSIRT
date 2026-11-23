import { useState } from 'react'
import { ChevronDown, HelpCircle, PhoneCall, ShieldQuestion } from 'lucide-react'
import { EMERGENCY_GUIDES, FAQ_ITEMS, HOTLINE } from '../data/mockData'
import { Reveal, SectionHeading } from './ui'

export default function GuidelinesFAQ() {
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0]?.id ?? null)

  return (
    <section id="panduan" className="relative bg-paper py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            kicker="Panduan & FAQ"
            title="Empat Langkah Pertama Saat Serangan Terjadi"
            description="Tindakan menit-menit awal menentukan besar kecilnya dampak. Ikuti urutan ini sebelum tim kami tiba di kanal komunikasi Anda."
          />
        </Reveal>

        <div className="mb-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {EMERGENCY_GUIDES.map((g, i) => (
            <Reveal key={g.step} delay={i * 80}>
              <div className="group relative h-full overflow-hidden rounded-xl border border-line bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <span className="absolute -right-3 -top-5 font-display text-[84px] font-bold leading-none text-paper transition-colors group-hover:text-brand-soft">
                  {g.step}
                </span>
                <span className="relative mb-4 flex h-10 w-10 items-center justify-center bg-ink font-display text-lg font-bold text-white transition-colors group-hover:bg-brand">
                  {g.step}
                </span>
                <h3 className="relative font-display text-[15px] font-bold text-ink">{g.title}</h3>
                <p className="relative mt-2 text-[12.5px] leading-relaxed text-slate-600">{g.description}</p>
                <span className="absolute bottom-0 left-0 h-1 w-0 bg-brand transition-all duration-500 group-hover:w-full" />
              </div>
            </Reveal>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <Reveal className="lg:col-span-2" delay={60}>
            <div className="mb-5 flex items-center gap-2">
              <HelpCircle size={18} className="text-brand" />
              <h3 className="font-display text-xl font-bold text-ink">Pertanyaan yang Sering Diajukan</h3>
            </div>
            <div className="space-y-3">
              {FAQ_ITEMS.map((f) => {
                const open = openId === f.id
                return (
                  <div
                    key={f.id}
                    className={`overflow-hidden rounded-xl border bg-white transition-all duration-300 ${
                      open ? 'border-brand/40 shadow-lg shadow-brand/5' : 'border-line shadow-sm hover:border-slate-300'
                    }`}
                  >
                    <button
                      onClick={() => setOpenId(open ? null : f.id)}
                      className="flex w-full items-center gap-3 px-5 py-4 text-left"
                      aria-expanded={open}
                    >
                      <span
                        className={`shrink-0 rounded px-2 py-0.5 font-mono text-[9.5px] font-bold uppercase tracking-wider ${
                          open ? 'bg-brand text-white' : 'bg-paper text-slate-500'
                        }`}
                      >
                        {f.category}
                      </span>
                      <span className={`flex-1 text-[14px] font-bold leading-snug ${open ? 'text-brand-deep' : 'text-ink'}`}>
                        {f.question}
                      </span>
                      <ChevronDown
                        size={17}
                        className={`shrink-0 text-slate-400 transition-transform duration-300 ${open ? 'rotate-180 text-brand' : ''}`}
                      />
                    </button>
                    <div
                      className="grid transition-[grid-template-rows] duration-300 ease-out"
                      style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
                    >
                      <div className="overflow-hidden">
                        <p className="border-t border-line px-5 py-4 text-[13px] leading-relaxed text-slate-600">
                          {f.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Reveal>

          <Reveal delay={140}>
            <div className="sticky top-32 space-y-5">
              <div className="relative overflow-hidden rounded-xl bg-ink p-7 text-white shadow-xl">
                <div className="grid-dark pointer-events-none absolute inset-0" />
                <div className="relative">
                  <ShieldQuestion size={26} className="mb-4 text-brand-bright" />
                  <h3 className="font-display text-xl font-bold leading-snug">
                    Insiden tidak bisa menunggu FAQ.
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    Untuk insiden CRITICAL yang sedang berlangsung, langsung hubungi hotline
                    darurat kami — analis senior siaga 24 jam.
                  </p>
                  <a
                    href={`tel:${HOTLINE.replace(/[^+\d]/g, '')}`}
                    className="mt-5 flex items-center justify-center gap-2 rounded-md bg-brand px-5 py-3.5 font-mono text-sm font-bold tracking-wide text-white shadow-lg shadow-brand/40 transition-transform hover:scale-[1.03]"
                  >
                    <PhoneCall size={16} />
                    {HOTLINE}
                  </a>
                  <p className="mt-3 text-center font-mono text-[10px] tracking-[0.2em] text-slate-500">
                    BEBAS PULSA · 24/7/365
                  </p>
                </div>
              </div>
              <div className="rounded-xl border-2 border-dashed border-brand/40 bg-brand-soft/50 p-6">
                <div className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-brand-deep">
                  Standar SLA Respons
                </div>
                <ul className="mt-3 space-y-2 font-mono text-[12px] text-slate-700">
                  <li className="flex justify-between gap-2"><span className="font-bold text-brand">CRITICAL</span><span>&lt; 15 menit</span></li>
                  <li className="flex justify-between gap-2"><span className="font-bold text-ink">HIGH</span><span>&lt; 30 menit</span></li>
                  <li className="flex justify-between gap-2"><span className="font-bold text-slate-600">MEDIUM</span><span>&lt; 2 jam kerja</span></li>
                  <li className="flex justify-between gap-2"><span className="font-bold text-slate-500">LOW</span><span>&lt; 1 hari kerja</span></li>
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
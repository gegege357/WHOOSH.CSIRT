import { AlertTriangle } from 'lucide-react'
import { useCsirt } from '../context/CsirtContext'

export default function ThreatTicker() {
  const { advisories } = useCsirt()
  const items = advisories.map(
    (a) => `${a.severity} · ${a.cveId} — ${a.title}`,
  )
  const doubled = [...items, ...items]

  return (
    <div className="relative overflow-hidden bg-brand py-2.5 text-white">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-brand to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-brand to-transparent" />
      <div className="animate-marquee flex w-max items-center gap-10 whitespace-nowrap">
        {doubled.map((text, i) => (
          <span key={i} className="flex items-center gap-2 font-mono text-[11px] font-semibold tracking-wide">
            <AlertTriangle size={12} className="shrink-0" />
            {text}
            <span className="ml-6 text-white/40">///</span>
          </span>
        ))}
      </div>
    </div>
  )
}
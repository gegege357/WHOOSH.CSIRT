import { Check, Copy, Download, Fingerprint, KeyRound, ShieldCheck } from 'lucide-react'
import { PGP_FINGERPRINT, PGP_KEY_ID, PGP_VALIDITY, PUBLIC_PGP_KEY } from '../data/mockData'
import { Modal, downloadTextFile, useCopyFeedback } from './ui'

export default function PgpModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { copied, triggerCopy } = useCopyFeedback()

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-3xl">
      <div className="border-b-4 border-brand bg-ink px-6 py-5 text-white sm:px-8">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand">
            <KeyRound size={22} />
          </span>
          <div>
            <h3 className="font-display text-xl font-bold">Public PGP Key — WHOOSH CSIRT</h3>
            <p className="font-mono text-[11px] tracking-wider text-slate-400">
              GUNAKAN UNTUK ENKRIPSI LAPORAN SENSITIF KE incident@kcic.co.id
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-5 px-6 py-6 sm:px-8">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-line bg-paper p-3.5">
            <div className="mb-1 flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
              <Fingerprint size={12} className="text-brand" /> Key ID
            </div>
            <div className="font-mono text-sm font-bold text-ink">{PGP_KEY_ID}</div>
          </div>
          <div className="rounded-lg border border-line bg-paper p-3.5 sm:col-span-2">
            <div className="mb-1 flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-widest text-slate-500">
              <ShieldCheck size={12} className="text-brand" /> Fingerprint
            </div>
            <div className="break-all font-mono text-sm font-bold text-ink">{PGP_FINGERPRINT}</div>
          </div>
        </div>

        <div className="rounded-lg border border-line bg-paper px-3.5 py-2.5 font-mono text-[11px] text-slate-600">
          <span className="font-bold text-ink">MASA BERLAKU:</span> {PGP_VALIDITY}
        </div>

        <div className="overflow-hidden rounded-lg border-2 border-ink">
          <div className="flex items-center justify-between bg-ink px-4 py-2">
            <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-white/80">
              WHOOSH-CSIRT-PUBLIC-KEY.asc
            </span>
            <span className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-brand" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/30" />
              <span className="h-2.5 w-2.5 rounded-full bg-white/30" />
            </span>
          </div>
          <pre className="dark-scroll max-h-64 overflow-auto bg-ink-deep p-4 font-mono text-[11px] leading-relaxed text-green-400">
            {PUBLIC_PGP_KEY}
          </pre>
        </div>

        <div className="flex flex-col gap-2.5 sm:flex-row">
          <button
            onClick={() => triggerCopy(PUBLIC_PGP_KEY)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-bold transition-all ${
              copied
                ? 'bg-green-600 text-white'
                : 'bg-brand text-white shadow-md shadow-brand/30 hover:bg-brand-deep'
            }`}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Tersalin!' : 'Salin PGP Key'}
          </button>
          <button
            onClick={() => downloadTextFile('WHOOSH-CSIRT-public-key.asc', PUBLIC_PGP_KEY, 'application/pgp-keys')}
            className="flex flex-1 items-center justify-center gap-2 rounded-md border-2 border-ink px-5 py-3 text-sm font-bold text-ink transition-colors hover:bg-ink hover:text-white"
          >
            <Download size={16} />
            Unduh File .asc
          </button>
        </div>

        <p className="text-xs leading-relaxed text-slate-500">
          Verifikasi fingerprint melalui kanal terpisah (hotline resmi) sebelum mempercayai kunci ini.
          Jangan mengirim laporan sensitif tanpa enkripsi PGP ke alamat email publik.
        </p>
      </div>
    </Modal>
  )
}
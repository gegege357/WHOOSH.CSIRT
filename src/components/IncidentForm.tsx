import { useRef, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import {
  AlertTriangle,
  Building2,
  Check,
  CheckCircle2,
  Copy,
  FileUp,
  Image as ImageIcon,
  Mail,
  Paperclip,
  Phone,
  RotateCcw,
  Search,
  Send,
  ShieldAlert,
  Siren,
  User,
  X,
  Zap,
} from 'lucide-react'
import type { EvidenceFile, IncidentCategory, IncidentReport, IncidentSeverity } from '../types/csirt'
import { INCIDENT_CATEGORIES, INCIDENT_SEVERITIES } from '../types/csirt'
import { HOTLINE } from '../data/mockData'
import { useCsirt } from '../context/CsirtContext'
import { SeverityBadge, useCopyFeedback } from './ui'

const MAX_FILES = 4
const MAX_FILE_BYTES = 2 * 1024 * 1024

interface FormState {
  reporterName: string
  organization: string
  email: string
  phone: string
  title: string
  category: IncidentCategory | ''
  severity: IncidentSeverity | ''
  incidentDate: string
  targetSystem: string
  description: string
}

const EMPTY_FORM: FormState = {
  reporterName: '',
  organization: '',
  email: '',
  phone: '',
  title: '',
  category: '',
  severity: '',
  incidentDate: '',
  targetSystem: '',
  description: '',
}

type Errors = Partial<Record<keyof FormState, string>>

const SEVERITY_HINT: Record<IncidentSeverity, string> = {
  CRITICAL: 'Layanan vital lumpuh / ransomware aktif',
  HIGH: 'Kompromi terkonfirmasi sistem penting',
  MEDIUM: 'Indikasi tanpa dampak langsung',
  LOW: 'Pertanyaan / laporan informatif',
}

function validate(form: FormState): Errors {
  const errors: Errors = {}
  if (form.reporterName.trim().length < 3) errors.reporterName = 'Nama lengkap minimal 3 karakter.'
  if (form.organization.trim().length < 3) errors.organization = 'Instansi / unit kerja wajib diisi.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()))
    errors.email = 'Format email tidak valid (mis. nama@kcic.co.id atau nama@gmail.com).'
  if (!/^[+\d][\d\s\-()]{7,19}$/.test(form.phone.trim()))
    errors.phone = 'Nomor telepon/WA tidak valid (8–20 digit, boleh diawali +).'
  if (form.title.trim().length < 10) errors.title = 'Judul insiden minimal 10 karakter agar jelas.'
  if (!form.category) errors.category = 'Pilih kategori insiden.'
  if (!form.severity) errors.severity = 'Pilih tingkat urgensi.'
  if (!form.incidentDate) errors.incidentDate = 'Tanggal & waktu kejadian wajib diisi.'
  else if (new Date(form.incidentDate).getTime() > Date.now() + 60_000)
    errors.incidentDate = 'Waktu kejadian tidak boleh di masa depan.'
  if (form.targetSystem.trim().length < 4)
    errors.targetSystem = 'Isi URL / IP / nama sistem terdampak (min. 4 karakter).'
  if (form.description.trim().length < 30)
    errors.description = 'Kronologi minimal 30 karakter — jelaskan apa, kapan, dan dampaknya.'
  return errors
}

const inputBase =
  'w-full rounded-md border bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition-all placeholder:text-slate-400 focus:ring-2'
const inputOk = 'border-line focus:border-brand focus:ring-brand/20'
const inputErr = 'border-brand bg-brand-soft/40 focus:border-brand focus:ring-brand/25'

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null
  return (
    <p className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-brand">
      <AlertTriangle size={11} /> {msg}
    </p>
  )
}

function Label({ text, required = true }: { text: string; required?: boolean }) {
  return (
    <span className="mb-1.5 block text-[12px] font-bold uppercase tracking-wide text-slate-600">
      {text} {required && <span className="text-brand">*</span>}
    </span>
  )
}

export default function IncidentForm({ onTrackTicket }: { onTrackTicket: (id: string) => void }) {
  const { submitIncident } = useCsirt()
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [errors, setErrors] = useState<Errors>({})
  const [attachments, setAttachments] = useState<EvidenceFile[]>([])
  const [fileErr, setFileErr] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState<IncidentReport | null>(null)
  const [sending, setSending] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const { copied, triggerCopy } = useCopyFeedback()

  const set = (key: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    setFileErr(null)
    for (const file of files) {
      if (file.size > MAX_FILE_BYTES) {
        setFileErr(`${file.name} melebihi batas 2 MB per file.`)
        continue
      }
      const reader = new FileReader()
      reader.onload = () => {
        const dataUrl = String(reader.result)
        setAttachments((prev) =>
          prev.length >= MAX_FILES
            ? prev
            : [
                ...prev,
                {
                  id: `${Date.now()}-${prev.length}-${file.name}`,
                  name: file.name,
                  mime: file.type || 'application/octet-stream',
                  size: file.size,
                  dataUrl,
                },
              ],
        )
      }
      reader.readAsDataURL(file)
    }
    if (attachments.length + files.length > MAX_FILES) {
      setFileErr(`Maksimal ${MAX_FILES} file lampiran per laporan.`)
    }
    e.target.value = ''
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    const errs = validate(form)
    setErrors(errs)
    if (Object.keys(errs).length > 0) {
      const firstKey = Object.keys(errs)[0]
      document.getElementById(`field-${firstKey}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    setSending(true)
    // simulasi transmisi aman ke pusat operasi
    setTimeout(() => {
      const report = submitIncident({
        reporterName: form.reporterName.trim(),
        organization: form.organization.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        title: form.title.trim(),
        category: form.category as IncidentCategory,
        severity: form.severity as IncidentSeverity,
        incidentDate: form.incidentDate,
        targetSystem: form.targetSystem.trim(),
        description: form.description.trim(),
        evidenceFileName: attachments[0]?.name,
        attachments: attachments.length > 0 ? attachments : undefined,
      })
      setSubmitted(report)
      setSending(false)
    }, 900)
  }

  const resetForm = () => {
    setForm(EMPTY_FORM)
    setErrors({})
    setAttachments([])
    setFileErr(null)
    setSubmitted(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <section id="lapor" className="relative overflow-hidden bg-ink py-20 lg:py-24">
      <div className="grid-dark pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -left-24 top-1/3 h-96 w-96 rounded-full bg-brand/10 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-brand via-brand/40 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-3xl">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center bg-brand text-white">
              <Siren size={13} />
            </span>
            <span className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-brand-bright">
              Incident &amp; Vulnerability Disclosure Center
            </span>
            <span className="h-px max-w-24 flex-1 bg-white/20" />
          </div>
          <h2 className="font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
            Laporkan Insiden & Temuan Uji Keamanan
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-300">
            Setiap laporan mendapat nomor tiket unik dan ditriase sesuai SLA urgensi. Untuk insiden{' '}
            <strong className="font-bold text-brand-bright">CRITICAL yang sedang berlangsung</strong>,
            hubungi juga hotline <span className="font-mono font-bold text-white">{HOTLINE}</span>.
            Kerahasiaan identitas pelapor dijamin.
          </p>
          <p className="mt-2.5 text-[13px] leading-relaxed text-slate-400">
            Portal ini sekaligus{' '}
            <strong className="font-bold text-slate-200">wadah publik uji keamanan &amp; pengungkapan kerentanan (VDP)</strong>:
            peneliti keamanan dan masyarakat dapat menguji aset dalam cakupan KCIC/Whoosh secara
            beritikad baik, lalu melaporkan temuan melalui kanal ini. Temuan di luar cakupan tidak
            diremediasi — laporan diarahkan ke pemilik sistem atau CSIRT berwenang.
          </p>
        </div>

        {/* batas cakupan pengujian & pelaporan */}
        <div className="mb-8 grid gap-5 rounded-xl border border-white/10 bg-white/[0.04] p-5 sm:p-6 lg:grid-cols-2">
          <div>
            <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-green-400">
              <CheckCircle2 size={13} /> Dalam cakupan — boleh diuji & dilaporkan
            </div>
            <ul className="mt-3 space-y-1.5 text-[12px] leading-relaxed text-slate-300">
              <li>· Web & portal KCIC: kcic.co.id + subdomain resmi, portal korporat, layanan web publik.</li>
              <li>· Sistem digital Whoosh: ticketing & AFC gate, passenger information system, Wi-Fi stasiun/kereta, aplikasi & API pendukung operasi.</li>
              <li>· Infrastruktur operasi KCIC: jaringan stasiun (Halim, Karawang, Padalarang, Tegalluar), OCC, depo, kantor pusat.</li>
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-brand-bright">
              <ShieldAlert size={13} /> Di luar cakupan — tidak ditangani
            </div>
            <ul className="mt-3 space-y-1.5 text-[12px] leading-relaxed text-slate-300">
              <li>· Web/sistem organisasi lain di luar KCIC/Whoosh — laporan diarahkan ke pemilik sistem / CSIRT berwenang.</li>
              <li>· DoS atau pengujian yang mengganggu layanan, akses data pengguna, dan social engineering terhadap staf.</li>
              <li>· Eksploitasi lanjutan setelah bukti cukup — berhenti pada proof minimal, jangan merusak atau mengubah data.</li>
            </ul>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow-2xl shadow-black/50">
          <div className="h-1.5 w-full bg-gradient-to-r from-brand via-brand-bright to-ink" />

          {submitted ? (
            /* ===== Konfirmasi sukses ===== */
            <div className="animate-fade-up px-6 py-12 text-center sm:px-12">
              <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600 ring-8 ring-green-50/60">
                <CheckCircle2 size={34} />
              </span>
              <h3 className="font-display text-2xl font-bold text-ink sm:text-3xl">
                Laporan Berhasil Dikirim
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">
                Tiket Anda telah masuk antrean triase WHOOSH CSIRT. Simpan nomor tiket di bawah
                untuk memantau perkembangan penanganan secara real-time.
              </p>

              <div className="mx-auto mt-7 max-w-md rounded-xl border-2 border-ink bg-paper p-6">
                <div className="font-mono text-[10px] font-bold uppercase tracking-[0.28em] text-slate-500">
                  Nomor Tiket Anda
                </div>
                <div className="mt-2 font-mono text-3xl font-bold tracking-wider text-brand sm:text-4xl">
                  {submitted.ticketId}
                </div>
                <div className="mt-3 flex items-center justify-center gap-2">
                  <SeverityBadge severity={submitted.severity} pulse />
                  <span className="font-mono text-[11px] font-bold uppercase tracking-wide text-slate-500">
                    STATUS: OPEN
                  </span>
                </div>
              </div>

              <div className="mx-auto mt-6 flex max-w-md flex-col gap-2.5 sm:flex-row">
                <button
                  onClick={() => triggerCopy(submitted.ticketId)}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-3 text-sm font-bold transition-all ${
                    copied ? 'bg-green-600 text-white' : 'border-2 border-ink text-ink hover:bg-ink hover:text-white'
                  }`}
                >
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                  {copied ? 'Tersalin!' : 'Salin Nomor Tiket'}
                </button>
                <button
                  onClick={() => onTrackTicket(submitted.ticketId)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-md bg-brand px-4 py-3 text-sm font-bold text-white shadow-md shadow-brand/30 transition-colors hover:bg-brand-deep"
                >
                  <Search size={15} />
                  Lacak Tiket Ini
                </button>
              </div>
              <button
                onClick={resetForm}
                className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate-500 underline-offset-4 transition-colors hover:text-brand hover:underline"
              >
                <RotateCcw size={13} /> Buat Laporan Baru
              </button>
            </div>
          ) : (
            /* ===== Formulir ===== */
            <form onSubmit={onSubmit} noValidate className="px-6 py-8 sm:px-10 sm:py-10">
              {/* Informasi pelapor */}
              <div className="mb-8">
                <h3 className="mb-5 flex items-center gap-2 font-display text-lg font-bold text-ink">
                  <span className="flex h-7 w-7 items-center justify-center bg-ink font-mono text-xs text-white">1</span>
                  Informasi Pelapor
                </h3>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div id="field-reporterName">
                    <label className="block">
                      <Label text="Nama Lengkap" />
                      <span className="relative block">
                        <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={form.reporterName}
                          onChange={(e) => set('reporterName', e.target.value)}
                          placeholder="mis. Budi Santoso"
                          className={`${inputBase} pl-9 ${errors.reporterName ? inputErr : inputOk}`}
                        />
                      </span>
                    </label>
                    <FieldError msg={errors.reporterName} />
                  </div>
                  <div id="field-organization">
                    <label className="block">
                      <Label text="Instansi / Unit Kerja" />
                      <span className="relative block">
                        <Building2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={form.organization}
                          onChange={(e) => set('organization', e.target.value)}
                          placeholder="mis. PT KCIC — Stasiun Halim, atau peneliti independen"
                          className={`${inputBase} pl-9 ${errors.organization ? inputErr : inputOk}`}
                        />
                      </span>
                    </label>
                    <FieldError msg={errors.organization} />
                  </div>
                  <div id="field-email">
                    <label className="block">
                      <Label text="Email Resmi" />
                      <span className="relative block">
                        <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => set('email', e.target.value)}
                          placeholder="nama@kcic.co.id / nama@gmail.com"
                          className={`${inputBase} pl-9 ${errors.email ? inputErr : inputOk}`}
                        />
                      </span>
                    </label>
                    <FieldError msg={errors.email} />
                  </div>
                  <div id="field-phone">
                    <label className="block">
                      <Label text="Nomor Telepon / WhatsApp" />
                      <span className="relative block">
                        <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={(e) => set('phone', e.target.value)}
                          placeholder="+62 812-3456-7890"
                          className={`${inputBase} pl-9 ${errors.phone ? inputErr : inputOk}`}
                        />
                      </span>
                    </label>
                    <FieldError msg={errors.phone} />
                  </div>
                </div>
              </div>

              <div className="mb-8 h-px w-full bg-line" />

              {/* Detail insiden */}
              <div>
                <h3 className="mb-5 flex items-center gap-2 font-display text-lg font-bold text-ink">
                  <span className="flex h-7 w-7 items-center justify-center bg-brand font-mono text-xs text-white">2</span>
                  Detail Insiden
                </h3>

                <div id="field-title" className="mb-5">
                  <label className="block">
                    <Label text="Judul Insiden" />
                    <input
                      type="text"
                      value={form.title}
                      onChange={(e) => set('title', e.target.value)}
                      placeholder="mis. File server keuangan terenkripsi ransomware sejak dini hari"
                      className={`${inputBase} ${errors.title ? inputErr : inputOk}`}
                    />
                  </label>
                  <FieldError msg={errors.title} />
                </div>

                <div className="mb-5 grid gap-5 sm:grid-cols-2">
                  <div id="field-category">
                    <label className="block">
                      <Label text="Kategori Insiden" />
                      <select
                        value={form.category}
                        onChange={(e) => set('category', e.target.value)}
                        className={`${inputBase} appearance-none ${errors.category ? inputErr : inputOk} ${form.category === '' ? 'text-slate-400' : ''}`}
                      >
                        <option value="" disabled>— Pilih kategori —</option>
                        {INCIDENT_CATEGORIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </label>
                    <FieldError msg={errors.category} />
                  </div>
                  <div id="field-incidentDate">
                    <label className="block">
                      <Label text="Tanggal & Waktu Kejadian (WIB)" />
                      <input
                        type="datetime-local"
                        value={form.incidentDate}
                        onChange={(e) => set('incidentDate', e.target.value)}
                        className={`${inputBase} ${errors.incidentDate ? inputErr : inputOk}`}
                      />
                    </label>
                    <FieldError msg={errors.incidentDate} />
                  </div>
                </div>

                <div id="field-severity" className="mb-5">
                  <Label text="Tingkat Urgensi" />
                  <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
                    {INCIDENT_SEVERITIES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => set('severity', s)}
                        className={`rounded-lg border-2 p-3 text-left transition-all ${
                          form.severity === s
                            ? s === 'CRITICAL'
                              ? 'border-brand bg-brand text-white shadow-md shadow-brand/30'
                              : s === 'HIGH'
                                ? 'border-ink bg-ink text-white'
                                : s === 'MEDIUM'
                                  ? 'border-slate-600 bg-slate-600 text-white'
                                  : 'border-slate-400 bg-slate-200 text-ink'
                            : 'border-line bg-white hover:border-slate-400'
                        }`}
                      >
                        <span className="flex items-center gap-1.5 font-mono text-xs font-bold tracking-wider">
                          {s === 'CRITICAL' && <ShieldAlert size={13} />}
                          {s}
                        </span>
                        <span className={`mt-1 block text-[10px] leading-snug ${form.severity === s ? 'opacity-80' : 'text-slate-500'}`}>
                          {SEVERITY_HINT[s]}
                        </span>
                      </button>
                    ))}
                  </div>
                  <FieldError msg={errors.severity} />
                </div>

                <div id="field-targetSystem" className="mb-5">
                  <label className="block">
                    <Label text="URL / IP / Sistem Terdampak (dalam cakupan KCIC/Whoosh)" />
                    <input
                      type="text"
                      value={form.targetSystem}
                      onChange={(e) => set('targetSystem', e.target.value)}
                      placeholder="mis. https://ticketing.kcic.co.id — 103.28.148.22 (aset KCIC/Whoosh)"
                      className={`${inputBase} font-mono text-[13px] ${errors.targetSystem ? inputErr : inputOk}`}
                    />
                  </label>
                  <FieldError msg={errors.targetSystem} />
                </div>

                <div id="field-description" className="mb-5">
                  <label className="block">
                    <Label text="Kronologi Lengkap" />
                    <textarea
                      rows={5}
                      value={form.description}
                      onChange={(e) => set('description', e.target.value)}
                      placeholder="Jelaskan urutan kejadian: kapan pertama terdeteksi, gejala yang terlihat, sistem terdampak, tindakan yang sudah dilakukan, dan dampak terhadap layanan…"
                      className={`${inputBase} resize-y leading-relaxed ${errors.description ? inputErr : inputOk}`}
                    />
                  </label>
                  <div className="mt-1 flex items-center justify-between">
                    <FieldError msg={errors.description} />
                    <span className={`ml-auto font-mono text-[10px] ${form.description.trim().length < 30 ? 'text-slate-400' : 'text-green-600'}`}>
                      {form.description.trim().length}/30 karakter minimum
                    </span>
                  </div>
                </div>

                {/* Evidence upload */}
                <div className="mb-2">
                  <Label text="File Bukti Pendukung (opsional)" required={false} />
                  <input
                    ref={fileRef}
                    type="file"
                    multiple
                    onChange={onFile}
                    className="hidden"
                    id="evidence-input"
                    accept=".png,.jpg,.jpeg,.webp,.gif,.pdf,.doc,.docx,.txt,.csv,.log,.eml,.zip,.pcap"
                  />
                  {fileErr && (
                    <p className="mb-2 flex items-center gap-1.5 rounded-md border border-brand/30 bg-brand-soft px-3 py-2 text-[11.5px] font-bold text-brand-deep">
                      <AlertTriangle size={13} className="shrink-0" /> {fileErr}
                    </p>
                  )}
                  {attachments.length > 0 && (
                    <ul className="mb-2 space-y-1.5">
                      {attachments.map((att) => (
                        <li
                          key={att.id}
                          className="flex items-center justify-between gap-3 rounded-md border border-green-300 bg-green-50 px-4 py-2.5"
                        >
                          <span className="flex min-w-0 items-center gap-2.5 text-sm font-semibold text-green-800">
                            {att.mime.startsWith('image/') ? (
                              <ImageIcon size={15} className="shrink-0" />
                            ) : (
                              <Paperclip size={15} className="shrink-0" />
                            )}
                            <span className="truncate font-mono text-[12px]">{att.name}</span>
                            <span className="shrink-0 font-mono text-[10px] text-green-600">
                              {(att.size / 1024).toFixed(1)} KB
                            </span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setAttachments((prev) => prev.filter((p) => p.id !== att.id))}
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-green-700 transition-colors hover:bg-green-100"
                            aria-label={`Hapus lampiran ${att.name}`}
                          >
                            <X size={14} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  <label
                    htmlFor="evidence-input"
                    className="flex cursor-pointer items-center justify-center gap-2.5 rounded-md border-2 border-dashed border-slate-300 bg-paper px-4 py-5 text-sm font-semibold text-slate-500 transition-all hover:border-brand hover:bg-brand-soft/40 hover:text-brand"
                  >
                    <FileUp size={18} />
                    {attachments.length > 0
                      ? 'Tambah file bukti lain'
                      : 'Klik untuk unggah bukti (foto / PDF / DOCX / log / ZIP — maks 4 file @ 2 MB)'}
                  </label>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-start gap-2 text-[11px] leading-relaxed text-slate-500 sm:max-w-sm">
                  <ShieldAlert size={14} className="mt-0.5 shrink-0 text-brand" />
                  Data dikirim melalui kanal terenkripsi dan diperlakukan sesuai kebijakan
                  kerahasiaan TLP:AMBER WHOOSH CSIRT.
                </p>
                <button
                  type="submit"
                  disabled={sending}
                  className="group flex items-center justify-center gap-2 rounded-md bg-brand px-8 py-3.5 text-[15px] font-bold text-white shadow-lg shadow-brand/30 transition-all hover:bg-brand-deep hover:shadow-xl hover:shadow-brand/40 disabled:cursor-wait disabled:opacity-70"
                >
                  {sending ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Mengirim Laporan…
                    </>
                  ) : (
                    <>
                      <Send size={17} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      Kirim Laporan / Temuan VDP
                      <Zap size={15} />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type {
  AdminRole,
  AuditAction,
  AuditLogEntry,
  EvidenceFile,
  IncidentReport,
  IncidentUpdatePayload,
  NewAdvisoryInput,
  NewIncidentInput,
  SecurityAdvisory,
  ThreatLevel,
} from '../types/csirt'
import { THREAT_LEVELS } from '../types/csirt'
import {
  INITIAL_ADVISORIES,
  INITIAL_INCIDENTS,
  STATUS_TIMELINE_NOTE,
} from '../data/mockData'

const STORAGE_KEY = 'whoosh-csirt:incidents:v1'
const LAST_TICKET_KEY = 'whoosh-csirt:last-ticket:v1'
const THREAT_KEY = 'whoosh-csirt:threat-level:v1'
const ADVISORY_KEY = 'whoosh-csirt:advisories:v1'
const AUDIT_KEY = 'whoosh-csirt:audit-log:v1'
// isi (data URL) tiap lampiran disimpan di kunci terpisah agar JSON insiden tetap kecil
const ATT_KEY_PREFIX = 'whoosh-csirt:att:v1:'
const SYNC_CLOCK_KEY = 'whoosh-csirt:sync-clock:v1'
const STATE_API = '/api/whoosh-state'

const AUDIT_LIMIT = 300

// snapshot state bersama yang disimpan di file server (lintas browser)
interface ServerState {
  v: number
  savedAt: number
  incidents: IncidentReport[]
  advisories: SecurityAdvisory[]
  threatLevel: ThreatLevel
  auditLog: AuditLogEntry[]
  lastTicket: string | null
}

export interface AuditActor {
  name: string
  role: AdminRole | 'SYSTEM'
}

interface CsirtContextValue {
  incidents: IncidentReport[]
  advisories: SecurityAdvisory[]
  threatLevel: ThreatLevel
  auditLog: AuditLogEntry[]
  lastCreatedTicketId: string | null
  submitIncident: (data: NewIncidentInput) => IncidentReport
  updateIncident: (
    ticketId: string,
    payload: IncidentUpdatePayload,
    actor: AuditActor,
  ) => IncidentReport | null
  getIncidentByTicketId: (ticketId: string) => IncidentReport | undefined
  setThreatLevel: (level: ThreatLevel, actor: AuditActor) => void
  publishAdvisory: (data: NewAdvisoryInput, actor: AuditActor) => SecurityAdvisory
  recordAudit: (action: AuditAction, detail: string, actor: AuditActor, ticketId?: string) => void
  resetDemoData: (actor?: AuditActor) => void
}

const CsirtContext = createContext<CsirtContextValue | null>(null)

function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

// data lama (sebelum fitur TLP/IoC) dilengkapi nilai default agar tetap kompatibel
function normalizeIncident(raw: IncidentReport): IncidentReport {
  return {
    ...raw,
    tlp: raw.tlp ?? 'TLP:AMBER',
    assignedTo: raw.assignedTo ?? null,
    iocs: Array.isArray(raw.iocs) ? raw.iocs : [],
    internalNotes: Array.isArray(raw.internalNotes) ? raw.internalNotes : [],
    cveRefs: Array.isArray(raw.cveRefs) ? raw.cveRefs : [],
    attachments: Array.isArray(raw.attachments) ? raw.attachments : undefined,
    timeline: Array.isArray(raw.timeline) ? raw.timeline : [],
  }
}

// metadata lampiran saja (tanpa data URL) — inilah yang masuk ke JSON insiden
type AttachmentMeta = Omit<EvidenceFile, 'dataUrl'> & { evicted?: boolean }

// tulis isi (data URL) tiap lampiran ke kunci terpisah; kembalikan metadata + flag evicted
function saveAttachmentBodies(attachments: EvidenceFile[] | undefined): AttachmentMeta[] | undefined {
  if (!attachments || attachments.length === 0) return undefined
  return attachments.map((att) => {
    let evicted = true
    if (att.dataUrl) {
      try {
        localStorage.setItem(ATT_KEY_PREFIX + att.id, att.dataUrl)
        evicted = false
      } catch {
        // kuota penuh untuk berkas ini — tandai evicted agar UI tahu
        evicted = true
      }
    }
    return { id: att.id, name: att.name, mime: att.mime, size: att.size, evicted }
  })
}

// baca kembali isi lampiran dari kunci terpisah; bila hilang tandai evicted
function rehydrateAttachments(incidents: IncidentReport[]): IncidentReport[] {
  return incidents.map((inc) => {
    if (!inc.attachments || inc.attachments.length === 0) return inc
    const attachments = inc.attachments.map((att) => {
      // isi masih ada di memori (mis. adopsi dari server) — pertahankan
      if (att.dataUrl) return att
      try {
        const dataUrl = localStorage.getItem(ATT_KEY_PREFIX + att.id)
        if (dataUrl) return { ...att, dataUrl, evicted: false }
      } catch {
        // abaikan — jatuh ke evicted
      }
      const { dataUrl: _drop, ...meta } = att
      void _drop
      return { ...meta, evicted: true }
    })
    return { ...inc, attachments }
  })
}

// buang data URL dari insiden agar JSON yang dipersist tetap ringkas
function stripAttachmentBodies(incidents: IncidentReport[]): IncidentReport[] {
  return incidents.map((inc) => {
    if (!inc.attachments || inc.attachments.length === 0) return inc
    const attachments = inc.attachments.map((att) => {
      const { dataUrl: _drop, ...meta } = att
      void _drop
      return meta
    })
    return { ...inc, attachments }
  })
}


function loadIncidents(): IncidentReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as IncidentReport[]
      if (Array.isArray(parsed) && parsed.length > 0) {
        return rehydrateAttachments(parsed.map(normalizeIncident))
      }
    }
  } catch {
    // storage korup / tidak tersedia — gunakan data awal
  }
  // seed pertama kali: simpan isi lampiran bawaan ke kunci terpisah
  const seeded = INITIAL_INCIDENTS.map(normalizeIncident)
  seeded.forEach((inc) => saveAttachmentBodies(inc.attachments))
  return seeded
}

function loadAdvisories(): SecurityAdvisory[] {
  try {
    const raw = localStorage.getItem(ADVISORY_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as SecurityAdvisory[]
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {
    // abaikan
  }
  return INITIAL_ADVISORIES
}

function loadThreatLevel(): ThreatLevel {
  try {
    const raw = localStorage.getItem(THREAT_KEY) as ThreatLevel | null
    if (raw && THREAT_LEVELS.includes(raw)) return raw
  } catch {
    // abaikan
  }
  return 'ELEVATED'
}

function loadAuditLog(): AuditLogEntry[] {
  try {
    const raw = localStorage.getItem(AUDIT_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as AuditLogEntry[]
      if (Array.isArray(parsed)) return parsed
    }
  } catch {
    // abaikan
  }
  return []
}

function loadLastTicket(): string | null {
  try {
    return localStorage.getItem(LAST_TICKET_KEY)
  } catch {
    return null
  }
}

function generateTicketId(existing: IncidentReport[]): string {
  const used = new Set(existing.map((i) => i.ticketId.toUpperCase()))
  for (let attempt = 0; attempt < 500; attempt++) {
    const num = Math.floor(1000 + Math.random() * 9000)
    const id = `WSH-2026-${num}`
    if (!used.has(id)) return id
  }
  return `WSH-2026-${Date.now().toString().slice(-6)}`
}

function nextAdvisoryId(existing: SecurityAdvisory[]): string {
  const nums = existing
    .map((a) => /^ADV-2026-(\d+)$/.exec(a.id)?.[1])
    .filter((n): n is string => n !== undefined)
    .map(Number)
  const next = (nums.length > 0 ? Math.max(...nums) : 0) + 1
  return `ADV-2026-${String(next).padStart(3, '0')}`
}

function makeAudit(
  action: AuditAction,
  detail: string,
  actor: AuditActor,
  ticketId?: string,
): AuditLogEntry {
  return {
    id: uid('aud'),
    timestamp: new Date().toISOString(),
    actor: actor.name,
    role: actor.role,
    action,
    detail,
    ticketId,
  }
}

// tulis hanya bila nilai berubah — mencegah loop echo storage antar-tab
function persist(key: string, value: string) {
  try {
    if (localStorage.getItem(key) !== value) localStorage.setItem(key, value)
  } catch {
    // penyimpanan penuh / private mode — state tetap berjalan di memori
  }
}

export function CsirtProvider({ children }: { children: ReactNode }) {
  const [incidents, setIncidents] = useState<IncidentReport[]>(loadIncidents)
  const [advisories, setAdvisories] = useState<SecurityAdvisory[]>(loadAdvisories)
  const [threatLevel, setThreatLevelState] = useState<ThreatLevel>(loadThreatLevel)
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>(loadAuditLog)
  const [lastCreatedTicketId, setLastCreatedTicketId] = useState<string | null>(loadLastTicket)
  // 'boot' = belum tahu server ada; 'on' = sinkron file server aktif; 'off' = localStorage saja
  const [syncState, setSyncState] = useState<'boot' | 'on' | 'off'>('boot')

  useEffect(() => {
    // JSON insiden disimpan tanpa isi lampiran (data URL) agar selalu muat kuota —
    // isi berkas hidup di kunci ATT_KEY_PREFIX masing-masing.
    persist(STORAGE_KEY, JSON.stringify(stripAttachmentBodies(incidents)))
  }, [incidents])

  useEffect(() => {
    persist(ADVISORY_KEY, JSON.stringify(advisories))
  }, [advisories])

  useEffect(() => {
    persist(THREAT_KEY, threatLevel)
  }, [threatLevel])

  useEffect(() => {
    persist(AUDIT_KEY, JSON.stringify(auditLog))
  }, [auditLog])

  useEffect(() => {
    try {
      if (lastCreatedTicketId) localStorage.setItem(LAST_TICKET_KEY, lastCreatedTicketId)
      else localStorage.removeItem(LAST_TICKET_KEY)
    } catch {
      // abaikan
    }
  }, [lastCreatedTicketId])

  // sinkronisasi real-time antar-tab (publik ↔ admin)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      try {
        if (e.key === STORAGE_KEY && e.newValue) {
          const parsed = JSON.parse(e.newValue) as IncidentReport[]
          if (Array.isArray(parsed)) setIncidents(rehydrateAttachments(parsed.map(normalizeIncident)))
        }
        if (e.key === ADVISORY_KEY && e.newValue) {
          const parsed = JSON.parse(e.newValue) as SecurityAdvisory[]
          if (Array.isArray(parsed)) setAdvisories(parsed)
        }
        if (e.key === THREAT_KEY && e.newValue && THREAT_LEVELS.includes(e.newValue as ThreatLevel)) {
          setThreatLevelState(e.newValue as ThreatLevel)
        }
        if (e.key === AUDIT_KEY && e.newValue) {
          const parsed = JSON.parse(e.newValue) as AuditLogEntry[]
          if (Array.isArray(parsed)) setAuditLog(parsed)
        }
        if (e.key === LAST_TICKET_KEY) setLastCreatedTicketId(e.newValue)
      } catch {
        // abaikan payload tidak valid dari tab lain
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  // adopsi state bersama dari file server saat aplikasi dibuka — inilah yang membuat
  // laporan yang diinput di browser lain (mis. Edge) tetap ada saat dibuka di Chrome
  useEffect(() => {
    let alive = true
    fetch(STATE_API)
      .then((r) => {
        const ct = r.headers.get('content-type') ?? ''
        if (!r.ok || !ct.includes('application/json')) throw new Error('sync server tidak tersedia')
        return r.json() as Promise<Partial<ServerState> | null>
      })
      .then((state) => {
        if (!alive) return
        if (state && Array.isArray(state.incidents) && state.incidents.length > 0) {
          let localClock = 0
          try {
            localClock = Number(localStorage.getItem(SYNC_CLOCK_KEY) ?? '0') || 0
          } catch {
            localClock = 0
          }
          // server hanya menang bila snapshot-nya tidak lebih tua dari push lokal terakhir
          if ((state.savedAt ?? 0) >= localClock) {
            const adopted = rehydrateAttachments(state.incidents.map(normalizeIncident))
            // simpan juga isi lampiran adopsi ke kunci lokal browser ini
            adopted.forEach((inc) => saveAttachmentBodies(inc.attachments))
            setIncidents(adopted)
            if (Array.isArray(state.advisories) && state.advisories.length > 0) setAdvisories(state.advisories)
            if (state.threatLevel && THREAT_LEVELS.includes(state.threatLevel)) {
              setThreatLevelState(state.threatLevel)
            }
            if (Array.isArray(state.auditLog) && state.auditLog.length > 0) setAuditLog(state.auditLog)
            setLastCreatedTicketId(state.lastTicket ?? null)
          }
        }
        setSyncState('on')
      })
      .catch(() => {
        if (alive) setSyncState('off')
      })
    return () => {
      alive = false
    }
  }, [])

  const snapshot = useCallback(
    (): string =>
      JSON.stringify({
        v: 1,
        savedAt: Date.now(),
        incidents,
        advisories,
        threatLevel,
        auditLog,
        lastTicket: lastCreatedTicketId,
      }),
    [incidents, advisories, threatLevel, auditLog, lastCreatedTicketId],
  )

  // dorong setiap perubahan state ke file server (debounce) agar terbaca browser lain
  useEffect(() => {
    if (syncState !== 'on') return
    const timer = setTimeout(() => {
      const body = snapshot()
      fetch(STATE_API, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body })
        .then((r) => {
          if (!r.ok) throw new Error('sync gagal')
          try {
            localStorage.setItem(SYNC_CLOCK_KEY, String((JSON.parse(body) as ServerState).savedAt))
          } catch {
            // abaikan
          }
        })
        .catch(() => setSyncState('off'))
    }, 350)
    return () => clearTimeout(timer)
  }, [syncState, snapshot])

  const appendAudit = useCallback((entries: AuditLogEntry[]) => {
    if (entries.length === 0) return
    setAuditLog((prev) => [...entries, ...prev].slice(0, AUDIT_LIMIT))
  }, [])

  const recordAudit = useCallback(
    (action: AuditAction, detail: string, actor: AuditActor, ticketId?: string) => {
      appendAudit([makeAudit(action, detail, actor, ticketId)])
    },
    [appendAudit],
  )

  const submitIncident = useCallback(
    (data: NewIncidentInput): IncidentReport => {
      const now = new Date().toISOString()
      const ticketId = generateTicketId(incidents)
      // simpan isi lampiran ke kunci terpisah, simpan hanya metadata di insiden
      const savedAttachments = saveAttachmentBodies(data.attachments)
      const liveAttachments = savedAttachments
        ? savedAttachments.map((meta, idx) => {
            const original = data.attachments?.[idx]
            return meta.evicted || !original?.dataUrl
              ? meta
              : { ...meta, dataUrl: original.dataUrl }
          })
        : undefined
      const report: IncidentReport = {
        ...data,
        attachments: liveAttachments,
        ticketId,
        status: 'OPEN',
        tlp: 'TLP:AMBER',
        assignedTo: null,
        iocs: [],
        internalNotes: [],
        cveRefs: [],
        createdAt: now,
        updatedAt: now,
        timeline: [
          {
            timestamp: now,
            status: 'OPEN',
            note: 'Laporan diterima melalui formulir portal WHOOSH CSIRT. Tiket dibuat otomatis dan masuk antrean triase sesuai tingkat urgensi.',
            officer: 'Sistem WHOOSH',
          },
        ],
      }
      setIncidents((prev) => [report, ...prev])
      setLastCreatedTicketId(ticketId)
      return report
    },
    [incidents],
  )

  const updateIncident = useCallback(
    (ticketId: string, payload: IncidentUpdatePayload, actor: AuditActor): IncidentReport | null => {
      const target = incidents.find(
        (i) => i.ticketId.toUpperCase() === ticketId.toUpperCase(),
      )
      if (!target) return null

      const now = new Date().toISOString()
      const timeline = [...target.timeline]
      const internalNotes = [...target.internalNotes]
      const iocs = [...target.iocs]
      let cveRefs = [...target.cveRefs]
      const audits: AuditLogEntry[] = []
      let changed = false

      const nextStatus = payload.status ?? target.status
      if (payload.status && payload.status !== target.status) {
        timeline.push({
          timestamp: now,
          status: payload.status,
          note: STATUS_TIMELINE_NOTE[payload.status],
          officer: actor.name,
        })
        audits.push(
          makeAudit(
            'STATUS_CHANGE',
            `${target.ticketId}: status ${target.status} → ${payload.status}`,
            actor,
            target.ticketId,
          ),
        )
        changed = true
      }

      const triageChanges: string[] = []
      if (payload.severity && payload.severity !== target.severity) {
        triageChanges.push(`urgensi ${target.severity} → ${payload.severity}`)
      }
      if (payload.tlp && payload.tlp !== target.tlp) {
        triageChanges.push(`klasifikasi ${target.tlp} → ${payload.tlp}`)
      }
      if (payload.assignedTo !== undefined && payload.assignedTo !== target.assignedTo) {
        triageChanges.push(
          payload.assignedTo
            ? `penanggung jawab: ${payload.assignedTo}`
            : 'penanggung jawab dilepas',
        )
      }
      if (triageChanges.length > 0) {
        audits.push(
          makeAudit('TRIAGE', `${target.ticketId}: ${triageChanges.join('; ')}`, actor, target.ticketId),
        )
        changed = true
      }

      if (payload.publicNote && payload.publicNote.trim()) {
        timeline.push({
          timestamp: now,
          status: nextStatus,
          note: payload.publicNote.trim(),
          officer: actor.name,
        })
        audits.push(
          makeAudit(
            'PUBLIC_NOTE',
            `${target.ticketId}: catatan publik untuk pelapor ditambahkan (${payload.publicNote.trim().length} karakter)`,
            actor,
            target.ticketId,
          ),
        )
        changed = true
      }

      if (payload.internalNote && payload.internalNote.trim()) {
        internalNotes.push({
          id: uid('int'),
          author: actor.name,
          role: actor.role === 'SYSTEM' ? 'ANALYST' : actor.role,
          text: payload.internalNote.trim(),
          createdAt: now,
        })
        audits.push(
          makeAudit(
            'INTERNAL_NOTE',
            `${target.ticketId}: catatan internal SOC ditambahkan`,
            actor,
            target.ticketId,
          ),
        )
        changed = true
      }

      if (payload.ioc && payload.ioc.value.trim()) {
        const ioc = {
          id: uid('ioc'),
          type: payload.ioc.type,
          value: payload.ioc.value.trim(),
          note: payload.ioc.note?.trim() || undefined,
          addedBy: actor.name,
          addedAt: now,
        }
        iocs.push(ioc)
        audits.push(
          makeAudit(
            'IOC_ADDED',
            `${target.ticketId}: IoC ${ioc.type} ${ioc.value} dicatat`,
            actor,
            target.ticketId,
          ),
        )
        changed = true
      }

      if (payload.cveRef && payload.cveRef.cveId.trim()) {
        const refId = payload.cveRef.cveId.trim().toUpperCase()
        if (!cveRefs.some((r) => r.cveId === refId)) {
          cveRefs.push({
            ...payload.cveRef,
            cveId: refId,
            linkedBy: actor.name,
            linkedAt: now,
          })
          audits.push(
            makeAudit(
              'CVE_LINKED',
              `${target.ticketId}: referensi ${refId} dilampirkan dari NVD (${payload.cveRef.source === 'LIVE' ? 'live' : 'demo offline'}${payload.cveRef.score !== null ? `, CVSS ${payload.cveRef.score}` : ''})`,
              actor,
              target.ticketId,
            ),
          )
          changed = true
        }
      }

      if (payload.removeCveRef) {
        const removeId = payload.removeCveRef.toUpperCase()
        if (cveRefs.some((r) => r.cveId === removeId)) {
          cveRefs = cveRefs.filter((r) => r.cveId !== removeId)
          audits.push(
            makeAudit(
              'CVE_UNLINKED',
              `${target.ticketId}: referensi ${removeId} dilepas dari tiket`,
              actor,
              target.ticketId,
            ),
          )
          changed = true
        }
      }

      if (!changed) return target

      const updated: IncidentReport = {
        ...target,
        status: nextStatus,
        severity: payload.severity ?? target.severity,
        tlp: payload.tlp ?? target.tlp,
        assignedTo: payload.assignedTo !== undefined ? payload.assignedTo : target.assignedTo,
        iocs,
        internalNotes,
        cveRefs,
        timeline,
        updatedAt: now,
      }
      setIncidents((prev) => prev.map((i) => (i.ticketId === target.ticketId ? updated : i)))
      appendAudit(audits)
      return updated
    },
    [incidents, appendAudit],
  )

  const getIncidentByTicketId = useCallback(
    (ticketId: string): IncidentReport | undefined => {
      const needle = ticketId.trim().toUpperCase()
      return incidents.find((i) => i.ticketId.toUpperCase() === needle)
    },
    [incidents],
  )

  const setThreatLevel = useCallback(
    (level: ThreatLevel, actor: AuditActor) => {
      if (level === threatLevel) return
      appendAudit([
        makeAudit('THREAT_LEVEL', `Level ancaman global: ${threatLevel} → ${level}`, actor),
      ])
      setThreatLevelState(level)
    },
    [threatLevel, appendAudit],
  )

  const publishAdvisory = useCallback(
    (data: NewAdvisoryInput, actor: AuditActor): SecurityAdvisory => {
      const advisory: SecurityAdvisory = {
        ...data,
        id: nextAdvisoryId(advisories),
        publishedDate: new Date().toISOString().slice(0, 10),
      }
      setAdvisories((prev) => [advisory, ...prev])
      appendAudit([
        makeAudit(
          'ADVISORY_PUBLISHED',
          `${advisory.id} · ${advisory.cveId} — ${advisory.title} (${advisory.severity}, CVSS ${advisory.cvssScore})`,
          actor,
        ),
      ])
      return advisory
    },
    [advisories, appendAudit],
  )

  const resetDemoData = useCallback(
    (actor?: AuditActor) => {
      const seeded = INITIAL_INCIDENTS.map(normalizeIncident)
      seeded.forEach((inc) => saveAttachmentBodies(inc.attachments))
      setIncidents(seeded)
      setAdvisories(INITIAL_ADVISORIES)
      setThreatLevelState('ELEVATED')
      setLastCreatedTicketId(null)
      const entry = makeAudit(
        'RESET_DEMO',
        'Data demo dikembalikan ke kondisi awal: 3 tiket contoh, 7 advisory, threat level ELEVATED.',
        actor ?? { name: 'Sistem WHOOSH', role: 'SYSTEM' },
      )
      setAuditLog([entry])
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stripAttachmentBodies(seeded)))
        localStorage.setItem(ADVISORY_KEY, JSON.stringify(INITIAL_ADVISORIES))
        localStorage.setItem(THREAT_KEY, 'ELEVATED')
        localStorage.setItem(AUDIT_KEY, JSON.stringify([entry]))
        localStorage.removeItem(LAST_TICKET_KEY)
      } catch {
        // abaikan
      }
    },
    [],
  )

  const value = useMemo<CsirtContextValue>(
    () => ({
      incidents,
      advisories,
      threatLevel,
      auditLog,
      lastCreatedTicketId,
      submitIncident,
      updateIncident,
      getIncidentByTicketId,
      setThreatLevel,
      publishAdvisory,
      recordAudit,
      resetDemoData,
    }),
    [
      incidents,
      advisories,
      threatLevel,
      auditLog,
      lastCreatedTicketId,
      submitIncident,
      updateIncident,
      getIncidentByTicketId,
      setThreatLevel,
      publishAdvisory,
      recordAudit,
      resetDemoData,
    ],
  )

  return <CsirtContext.Provider value={value}>{children}</CsirtContext.Provider>
}

export function useCsirt(): CsirtContextValue {
  const ctx = useContext(CsirtContext)
  if (!ctx) throw new Error('useCsirt harus dipakai di dalam CsirtProvider')
  return ctx
}
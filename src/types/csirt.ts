export type IncidentSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'

export type IncidentStatus = 'OPEN' | 'TRIAGED' | 'INVESTIGATING' | 'CONTAINMENT' | 'RESOLVED'

export type IncidentCategory =
  | 'Ransomware / Malware'
  | 'Phishing / Social Engineering'
  | 'Web Defacement'
  | 'DDoS Attack'
  | 'Kebocoran Data / Data Breach'
  | 'Akses Ilegal / Unauthorized Access'
  | 'Kerentanan / Temuan VDP'
  | 'Lainnya'

export const INCIDENT_CATEGORIES: IncidentCategory[] = [
  'Ransomware / Malware',
  'Phishing / Social Engineering',
  'Web Defacement',
  'DDoS Attack',
  'Kebocoran Data / Data Breach',
  'Akses Ilegal / Unauthorized Access',
  'Kerentanan / Temuan VDP',
  'Lainnya',
]

export const INCIDENT_SEVERITIES: IncidentSeverity[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']

export const INCIDENT_STATUSES: IncidentStatus[] = ['OPEN', 'TRIAGED', 'INVESTIGATING', 'CONTAINMENT', 'RESOLVED']

export type TlpCode = 'TLP:RED' | 'TLP:AMBER' | 'TLP:GREEN'

export const TLP_CODES: TlpCode[] = ['TLP:RED', 'TLP:AMBER', 'TLP:GREEN']

export type IocType = 'IP' | 'DOMAIN' | 'URL' | 'HASH' | 'EMAIL'

export const IOC_TYPES: IocType[] = ['IP', 'DOMAIN', 'URL', 'HASH', 'EMAIL']

export interface IncidentIoc {
  id: string
  type: IocType
  value: string
  note?: string
  addedBy: string
  addedAt: string
}

export type AdminRole = 'LEAD' | 'ANALYST'

export const ADMIN_ROLE_LABEL: Record<AdminRole, string> = {
  LEAD: 'Lead Incident Handler',
  ANALYST: 'SOC Analyst Tier-1',
}

export interface AdminSession {
  name: string
  email: string
  role: AdminRole
  loginAt: string
}

export interface InternalNote {
  id: string
  author: string
  role: AdminRole
  text: string
  createdAt: string
}

export interface IncidentCveRef {
  cveId: string
  score: number | null
  severity: string | null
  cvssVersion: string | null
  summary: string
  vector: string | null
  source: 'LIVE' | 'DEMO'
  linkedBy: string
  linkedAt: string
}

export interface AdminAccount {
  email: string
  pin: string
  role: AdminRole
  name: string
}

export interface IncidentTimelineItem {
  timestamp: string
  status: IncidentStatus
  note: string
  officer: string
}

export interface EvidenceFile {
  id: string
  name: string
  mime: string
  size: number
  /** isi berkas (data URL) — disimpan di kunci localStorage terpisah, hilang bila kuota penuh */
  dataUrl?: string
  /** true bila isi berkas gagal/tidak lagi tersedia di penyimpanan lokal */
  evicted?: boolean
}

export interface IncidentReport {
  ticketId: string
  reporterName: string
  organization: string
  email: string
  phone: string
  title: string
  category: IncidentCategory
  severity: IncidentSeverity
  incidentDate: string
  targetSystem: string
  description: string
  evidenceFileName?: string
  attachments?: EvidenceFile[]
  status: IncidentStatus
  tlp: TlpCode
  assignedTo: string | null
  iocs: IncidentIoc[]
  internalNotes: InternalNote[]
  cveRefs: IncidentCveRef[]
  createdAt: string
  updatedAt: string
  timeline: IncidentTimelineItem[]
}

export type NewIncidentInput = Omit<
  IncidentReport,
  | 'ticketId'
  | 'status'
  | 'tlp'
  | 'assignedTo'
  | 'iocs'
  | 'internalNotes'
  | 'cveRefs'
  | 'createdAt'
  | 'updatedAt'
  | 'timeline'
>

export interface IncidentUpdatePayload {
  status?: IncidentStatus
  severity?: IncidentSeverity
  tlp?: TlpCode
  assignedTo?: string | null
  publicNote?: string
  internalNote?: string
  ioc?: { type: IocType; value: string; note?: string }
  cveRef?: Omit<IncidentCveRef, 'linkedBy' | 'linkedAt'>
  removeCveRef?: string
}

export type ThreatLevel = 'LOW' | 'GUARDED' | 'ELEVATED' | 'CRITICAL'

export const THREAT_LEVELS: ThreatLevel[] = ['LOW', 'GUARDED', 'ELEVATED', 'CRITICAL']

export type AuditAction =
  | 'LOGIN'
  | 'LOGOUT'
  | 'THREAT_LEVEL'
  | 'TRIAGE'
  | 'STATUS_CHANGE'
  | 'PUBLIC_NOTE'
  | 'INTERNAL_NOTE'
  | 'IOC_ADDED'
  | 'ADVISORY_PUBLISHED'
  | 'NVD_IMPORT'
  | 'CVE_LINKED'
  | 'CVE_UNLINKED'
  | 'EXPORT_CSV'
  | 'RESET_DEMO'

export interface AuditLogEntry {
  id: string
  timestamp: string
  actor: string
  role: AdminRole | 'SYSTEM'
  action: AuditAction
  detail: string
  ticketId?: string
}

export type AdvisorySeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'INFO'

export interface SecurityAdvisory {
  id: string
  cveId: string
  cvssScore: string
  severity: AdvisorySeverity
  title: string
  publishedDate: string
  affectedSystems: string[]
  summary: string
  technicalDetails: string
  mitigationSteps: string[]
}

export type NewAdvisoryInput = Omit<SecurityAdvisory, 'id' | 'publishedDate'>

export interface FaqItem {
  id: string
  category: string
  question: string
  answer: string
}

export interface EmergencyGuide {
  step: number
  title: string
  description: string
}
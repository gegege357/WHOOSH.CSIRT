export interface NvdCvss {
  version: '3.1' | '3.0' | '2.0'
  score: number
  severity: string
  vector: string | null
  exploitability?: number | null
  impact?: number | null
}

export interface NvdReference {
  url: string
  source: string | null
  tags: string[]
}

export interface NvdCve {
  id: string
  published: string
  lastModified: string
  description: string
  cvss: NvdCvss | null
  references: NvdReference[]
  weaknesses: string[]
}

export type NvdSeverityFilter = 'CRITICAL' | 'HIGH' | 'MEDIUM'

export interface NvdFeedResult {
  cves: NvdCve[]
  total: number
  source: 'LIVE' | 'DEMO'
  range?: { pubStartDate: string; pubEndDate: string; days: number }
  page?: number
  perPage?: number
}
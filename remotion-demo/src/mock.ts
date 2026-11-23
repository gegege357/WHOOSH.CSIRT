export const TICKET_ID = 'WSH-2026-7842'

export const REPORT = {
  nama: 'Riset Keamanan Publik',
  email: 'riset.publik@gmail.com',
  judul: 'Temuan VDP: refleksi parameter pada portal ticketing KCIC',
  kategori: 'Kerentanan / Temuan VDP',
  sistem: 'https://ticketing.kcic.co.id/search?q=',
  deskripsi:
    'Uji keamanan beritikad baik pada aset cakupan KCIC: parameter q memantulkan input tanpa encoding sehingga berpotensi XSS. Proof minimal disertakan, tanpa eksploitasi lanjutan.',
}

export const CATEGORY_OPTIONS = [
  'Phishing / Rekayasa Sosial',
  'Malware / Ransomware',
  'Kerentanan / Temuan VDP',
  'Gangguan Sistem Operasional',
  'Lainnya',
]

export const TIMELINE = [
  { status: 'OPEN', label: 'Laporan Diterima', time: '21 Nov 2026 · 09:31 WIB', note: 'Tiket otomatis dibuat, notifikasi ke shift 1.' },
  { status: 'TRIAGED', label: 'Triase Awal', time: '21 Nov 2026 · 09:42 WIB', note: 'Urgensi MEDIUM · TLP:AMBER · analis ditugaskan.' },
  { status: 'INVESTIGATING', label: 'Investigasi', time: '21 Nov 2026 · 10:05 WIB', note: 'Verifikasi refleksi parameter & dampak cakupan.' },
  { status: 'CONTAINMENT', label: 'Containment', time: 'Menunggu', note: 'Koordinasi remediasi dengan pemilik sistem KCIC.' },
]

export const CVES = [
  {
    id: 'CVE-2026-123488',
    score: 9.8,
    severity: 'CRITICAL',
    cwe: 'CWE-78',
    published: '20 Nov 2026',
    desc: 'OS command injection pada appliance gateway memungkinkan eksekusi perintah tanpa autentikasi via paket ter crafted.',
  },
  {
    id: 'CVE-2026-123470',
    score: 7.5,
    severity: 'HIGH',
    cwe: 'CWE-22',
    published: '19 Nov 2026',
    desc: 'Path traversal pada modul ekspor arsip memungkinkan pembacaan berkas konfigurasi di luar direktori yang diizinkan.',
  },
  {
    id: 'CVE-2026-123506',
    score: 5.4,
    severity: 'MEDIUM',
    cwe: 'CWE-863',
    published: '18 Nov 2026',
    desc: 'Otorisasi tidak tepat pada webhook proyek memungkinkan pengguna berperan rendah mengubah resource milik proyek lain.',
  },
]

export const INCIDENT_ROWS = [
  { id: 'WSH-2026-7842', title: 'Temuan VDP: refleksi parameter ticketing', sev: 'MEDIUM', status: 'INVESTIGATING', analyst: 'Analis N. Pratama' },
  { id: 'WSH-2026-7839', title: 'Percobaan phishing kredensial OCC', sev: 'HIGH', status: 'TRIAGED', analyst: 'Analis S. Wibowo' },
  { id: 'WSH-2026-7835', title: 'Anomali trafik Wi-Fi Stasiun Halim', sev: 'CRITICAL', status: 'CONTAINMENT', analyst: 'Analis R. Putri' },
]

export const STATS = [
  { label: 'Tiket Aktif', value: '4', tone: 'ink' },
  { label: 'CRITICAL Terbuka', value: '1', tone: 'brand' },
  { label: 'Advisory Terbit', value: '8', tone: 'green' },
  { label: 'Entri Audit', value: '24', tone: 'blue' },
]
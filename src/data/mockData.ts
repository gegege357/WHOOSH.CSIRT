import type {
  AdminAccount,
  EmergencyGuide,
  FaqItem,
  IncidentReport,
  IncidentStatus,
  SecurityAdvisory,
  ThreatLevel,
} from '../types/csirt'

export const HOTLINE = '+62 21 500-911'
export const CSIRT_EMAIL = 'csirt@kcic.co.id'
export const ADMIN_PIN = '2026'
export const ADMIN_DEMO_EMAIL = 'handler@kcic.co.id'
export const ANALYST_DEMO_EMAIL = 'analyst@kcic.co.id'
export const ANALYST_PIN = '1122'

export const ADMIN_ACCOUNTS: AdminAccount[] = [
  {
    email: ADMIN_DEMO_EMAIL,
    pin: ADMIN_PIN,
    role: 'LEAD',
    name: 'Koordinator Yusuf Hakim',
  },
  {
    email: ANALYST_DEMO_EMAIL,
    pin: ANALYST_PIN,
    role: 'ANALYST',
    name: 'Analis Dita Maharani',
  },
]

export const ANALYST_ROSTER = [
  'Analis Raka Pratama',
  'Analis Dita Maharani',
  'Analis Sinta Prameswari',
  'Analis Bagas Nugroho',
  'Koordinator Yusuf Hakim',
]

export const STATUS_TIMELINE_NOTE: Record<IncidentStatus, string> = {
  OPEN: 'Tiket dibuka kembali untuk peninjauan ulang oleh tim analis.',
  TRIAGED:
    'Triase awal selesai. Laporan terverifikasi, tingkat keparahan dan klasifikasi kerahasiaan (TLP) ditetapkan, serta analis penanggung jawab ditugaskan.',
  INVESTIGATING:
    'Investigasi mendalam dimulai: analisis log, artefak, dan jejak serangan untuk menentukan akar masalah serta cakupan dampak.',
  CONTAINMENT:
    'Tahap containment: penyebaran dibatasi, sistem terdampak diisolasi, dan eradikasi ancaman dilakukan bertahap bersama tim instansi.',
  RESOLVED:
    'Insiden selesai ditangani. Sistem pulih, validasi pasca-insiden dilakukan, dan tiket ditutup. Laporan akhir (RCA) akan menyusul melalui email terdaftar.',
}

export const THREAT_LEVEL_DESC: Record<ThreatLevel, string> = {
  LOW: 'Aktivitas ancaman normal. Pemantauan rutin dan hardening berkala berjalan sesuai jadwal.',
  GUARDED: 'Ada indikasi peningkatan aktivitas ancaman. Pemantauan diperketat, belum ada eksploitasi aktif terhadap aset KCIC/Whoosh.',
  ELEVATED: 'Eksploitasi aktif terpantau pada beberapa kerentanan kritis. Tim internal KCIC diminta mempercepat patching dan verifikasi IOC.',
  CRITICAL: 'Serangan berdampak luas sedang berlangsung. Seluruh kanal siaga penuh — respons triase CRITICAL diprioritaskan di atas semua antrean.',
}

export const PGP_FINGERPRINT = '4F9A 88C1 2026 WHOO SHCS IRT9 77B2 E104'
export const PGP_KEY_ID = '0x77B2E104'
export const PGP_VALIDITY = '2026-01-01 s.d. 2028-12-31 (RSA 4096-bit)'

export const PUBLIC_PGP_KEY = `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: WHOOSH CSIRT Key Server v2.6
Comment: WHOOSH CSIRT Official Communication Key (2026-2028)
Comment: Fingerprint: 4F9A 88C1 2026 WHOO SHCS IRT9 77B2 E104

mQINBGWqHxkBEADKv8ZrT4mXqP1yNcJdW5sE7bRfL0gU3hAiK6oM9pQ2tVwXyZc
B4nD8eF1gH5jK7lM0nP3qR6sT9uW2vY5xAbCdEfGhIjKlMnOpQrStUvWxYz012
3456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz+/=
aB3dE6gH9jK2lM5nP8qR1sT4uW7vY0xZcBfGhJkLmNpQrStUvWxYz123456789
WhOoShCsIrT2026RapidResponseKeyBlockSegmentAlpha01xQ7vBn3MzK9pL2
JdW5sE7bRfL0gU3hAiK6oM9pQ2tVwXyZcB4nD8eF1gH5jK7lM0nP3qR6sT9uW2
vY5xAbCdEfGhIjKlMnOpQrStUvWxYz0123456789ABCDEFGHJKLMNPQRSTUVWX
Yzabcdefghijkmnopqrstuvwxyz+/aB3dE6gH9jK2lM5nP8qR1sT4uW7vY0xZ
cBfGhJkLmNpQrStUvWxYz123456789WhOoShCsIrT2026SegmentBravo02yR8
wCo4NaL0qM3rS6tV9wY2zB5cE8fH1jK4lN7pQ0sT3uW6vZ9xA2dG5hJ8kM1nP4
qR7tU0wX3zC6eI9lO2rV5yB8bE1gH4jK7mP0sS3vY6xAbDfGhJkLmNoQrTuVwX
z0123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuv+/=
mQINBGWqHxkBEADKv8ZrT4mXqP1yNcJdW5sE7bRfL0gU3hAiK6oM9pQ2tVwXyZ
cB4nD8eF1gH5jK7lM0nP3qR6sT9uW2vY5xAbCdEfGhIjKlMnOpQrStUvWxYz01
23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz+/a
B3dE6gH9jK2lM5nP8qR1sT4uW7vY0xZcBfGhJkLmNpQrStUvWxYz1234567890
WhOoShCsIrT2026SegmentCharlie03zS9xDp5OqL1rN4uW7xZ0bE3gJ6kM9p
Q2tVwXyZcB4nD8eF1gH5jK7lM0nP3qR6sT9uW2vY5xAbCdEfGhIjKlMnOpQrS
tUvWxYz0123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstu
vwx+/aB3dE6gH9jK2lM5nP8qR1sT4uW7vY0xZcBfGhJkLmNpQrStUvWxYz1234
=K7wT
-----END PGP PUBLIC KEY BLOCK-----`

export const RFC2350_CONTENT = `=====================================================================
              WHOOSH CSIRT — DOKUMEN RFC 2350
   PT Kereta Cepat Indonesia China (KCIC) — Operator Kereta Cepat
   Whoosh (Waktu Hemat, Operasi Optimal, Sistem Handal)
        Computer Security Incident Response Team — Profil Resmi
=====================================================================

1. INFORMASI DOKUMEN
---------------------------------------------------------------------
1.1 Tanggal Pembaruan Terakhir : 12 Januari 2026
1.2 Versi Dokumen              : 3.2
1.3 Distribusi                 : Publik (TLP:CLEAR)
1.4 Bahasa                     : Bahasa Indonesia / English
1.5 Lokasi Dokumen             : https://csirt.kcic.co.id/rfc2350.txt
1.6 Kepatuhan                  : RFC 2350, pedoman BSSN, FIRST CSIRT
                                 Services Framework v1.1, regulasi
                                 Infrastruktur Informasi Vital (IIV)
                                 sektor transportasi

2. INFORMASI KONTAK
---------------------------------------------------------------------
2.1 Nama Tim        : WHOOSH CSIRT — tim tanggap insiden siber
                      PT Kereta Cepat Indonesia China (KCIC)
2.2 Alamat          : Gedung KCIC Cyber Operations Center, Jl. Jenderal
                      Sudirman Kav. 52-53, Jakarta Selatan 12190
2.3 Zona Waktu      : WIB (UTC+7)
2.4 Hotline Darurat : +62 21 500-911 (24/7/365)
2.5 Email Umum      : csirt@kcic.co.id
2.6 Email Insiden   : incident@kcic.co.id (terenkripsi PGP)
2.7 Kunci PGP       : Key ID 0x77B2E104
                      Fingerprint: 4F9A 88C1 2026 WHOO SHCS IRT9 77B2 E104
2.8 Jam Operasional : 24 jam / 7 hari / 365 hari (shift analis)

3. MENGENAI WHOOSH CSIRT & KONSTITUEN
---------------------------------------------------------------------
3.1 Visi
    Menjamin ketahanan ekosistem digital kereta cepat Whoosh
    (koridor Jakarta-Bandung) dan ruang digital nasional melalui
    respons cepat, presisi, dan terukur.

3.2 Misi
    a. Menyediakan layanan triase dan penanganan insiden siber
       dengan waktu respons awal di bawah 15 menit.
    b. Mengoordinasikan pemulihan sistem dan mitigasi dampak
       bersama pemilik infrastruktur.
    c. Menerbitkan peringatan dini dan advisory kerentanan
       secara berkala kepada konstituen.
    d. Meningkatkan kapabilitas keamanan konstituen melalui
       edukasi, asesmen, dan latihan tanggap insiden.

3.3 Konstituen & Cakupan Aset
    - Seluruh unit internal PT KCIC: operasi stasiun (Halim,
      Karawang, Padalarang, Tegalluar), Operation Control Center
      (OCC), depo, dan kantor pusat.
    - Sistem digital operasional kereta cepat Whoosh: ticketing
      & AFC gate, passenger information system, Wi-Fi stasiun
      dan kereta, portal korporat, serta sistem pendukung operasi.
    - Web & portal KCIC: kcic.co.id beserta subdomain resmi dan
      layanan web publik KCIC (sasaran uji keamanan publik/VDP).
    - Kanal publik: peneliti keamanan dan masyarakat yang menguji
      aset cakupan secara beritikad baik lalu melaporkan temuan.

3.4 Batas Cakupan (Scope)
    WHOOSH CSIRT HANYA menangani aset digital PT KCIC dan kereta
    cepat Whoosh. Tim TIDAK menangani, memperbaiki, atau memulihkan
    web/sistem milik organisasi lain (mitra, vendor, ISP, hosting,
    maupun instansi di luar KCIC). Laporan di luar cakupan tidak
    diremediasi; pelapor diarahkan ke pemilik sistem atau CSIRT
    berwenang (BSSN / Id-SIRTII/CC / CSIRT sektoral terkait).
    Portal ini adalah wadah publik untuk uji keamanan dan
    pelaporan kerentanan/insiden (coordinated vulnerability
    disclosure), BUKAN penawaran layanan CSIRT komersial.

3.5 Otoritas
    WHOOSH CSIRT beroperasi di bawah mandat PT Kereta Cepat
    Indonesia China (KCIC) selaku penyelenggara Infrastruktur
    Informasi Vital (IIV) sektor transportasi, berkoordinasi
    dengan BSSN dan Id-SIRTII/CC sesuai regulasi IIV dan pedoman
    keamanan siber nasional. Tim berwenang melakukan koordinasi
    lintas sektor pada insiden aset KCIC/Whoosh yang berdampak
    luas, tanpa mengambil alih kepemilikan sistem milik konstituen.

4. KEBIJAKAN & KLASIFIKASI INSIDEN
---------------------------------------------------------------------
4.1 Klasifikasi Tingkat Urgensi
    CRITICAL : Gangguan aktif pada layanan vital, ransomware
               menyebar, kebocoran data masif, eksploitasi
               zero-day aktif. Respons awal < 15 menit.
    HIGH     : Kompromi terkonfirmasi pada sistem penting,
               defacement portal publik, phishing bertarget.
               Respons awal < 30 menit.
    MEDIUM   : Indikasi kompromi tanpa dampak langsung,
               kerentanan berisiko tinggi belum dieksploitasi.
               Respons awal < 2 jam kerja.
    LOW      : Pertanyaan keamanan, pemindaian terdeteksi,
               laporan informatif. Respons awal < 1 hari kerja.

4.2 Kebijakan Kerahasiaan
    Seluruh informasi pelapor diperlakukan dengan klasifikasi
    minimum TLP:AMBER. Identitas pelapor tidak pernah dibagikan
    tanpa persetujuan tertulis. Komunikasi sensitif wajib
    menggunakan PGP (Key ID 0x77B2E104).

4.3 Traffic Light Protocol (TLP)
    TLP:RED   : Hanya untuk pihak yang disebut dalam laporan.
    TLP:AMBER : Terbatas pada organisasi yang perlu tahu.
    TLP:GREEN : Dapat dibagikan dalam komunitas/konstituen.
    TLP:CLEAR : Dapat dipublikasikan secara umum.

5. MANDAT & RUANG LINGKUP OPERASIONAL
---------------------------------------------------------------------
    Cakupan penanganan HANYA aset digital PT KCIC / kereta cepat
    Whoosh (lihat 3.4). Web/sistem pihak lain tidak ditangani atau
    diperbaiki; laporan di luar cakupan diarahkan ke pemilik
    sistem atau CSIRT berwenang. Seluruh kegiatan bersifat
    prosedural dan NON-KOMERSIAL: portal ini wadah publik uji
    keamanan & pelaporan, bukan penawaran layanan CSIRT berbayar.

5.1 Triase Insiden
    - Verifikasi keaslian laporan dan kelengkapan bukti 24/7.
    - Klasifikasi urgensi (CRITICAL-LOW) dan kerahasiaan (TLP).
    - Pembukaan tiket investigasi dan penugasan analis.

5.2 Koordinasi Penanganan
    - Orkestrasi koordinasi insiden aset KCIC/Whoosh bersama
      pemilik sistem internal dan otoritas (ISP, hosting, CSIRT
      sektoral, BSSN) selaku mitra koordinasi, bukan cakupan
      remediasi sistem pihak lain.
    - Distribusi IoC dan temuan teknis sesuai klasifikasi TLP.
    - Pencatatan keputusan pada audit log operasional.

5.3 Pemulihan Sistem Terdampak
    - Isolasi sistem KCIC/Whoosh dan pengamanan bukti forensik.
    - Eradikasi akar penyebab dan restore dari backup bersih
      bersama pemilik sistem internal KCIC.
    - Validasi pasca-pemulihan dan laporan akhir (RCA).

5.4 Penerbitan Peringatan Dini
    - Pemantauan feed CVE NVD (API v2.0) dan kampanye aktif.
    - Penilaian dampak terhadap infrastruktur konstituen.
    - Penerbitan security advisory publik (TLP:CLEAR). Tingkat
      ancaman global (Global Threat Level) dikelola internal SOC
      dan tidak dipublikasikan ke portal publik.

5.5 Edukasi & Kesadaran Keamanan
    - Panduan pelaporan, baseline hardening, prosedur eskalasi.
    - Sesi awareness dan simulasi phishing bagi staf internal KCIC.
    - Tabletop exercise tanggap insiden bersama mitra koordinasi.

6. PELAPORAN INSIDEN & FORMULIR
---------------------------------------------------------------------
6.1 Kanal Pelaporan
    a. Formulir web   : https://csirt.kcic.co.id/#lapor
    b. Email          : incident@kcic.co.id (enkripsi PGP)
    c. Hotline darurat: +62 21 500-911 (khusus CRITICAL)

6.2 Data Minimum Laporan
    - Identitas pelapor: nama, instansi, email resmi, telepon.
    - Judul dan kategori insiden (temuan uji keamanan memakai
      kategori "Kerentanan / Temuan VDP").
    - Tingkat urgensi (CRITICAL/HIGH/MEDIUM/LOW).
    - Tanggal & waktu kejadian (WIB).
    - URL / IP / sistem terdampak (harus aset dalam cakupan
      KCIC/Whoosh; laporan di luar cakupan diarahkan ke pemilik
      sistem atau CSIRT berwenang, tidak diremediasi tim ini).
    - Kronologi lengkap dan bukti pendukung (log, tangkapan layar).

6.3 Alur Penanganan
    OPEN -> TRIAGED -> INVESTIGATING -> CONTAINMENT -> RESOLVED
    Setiap perubahan status tercatat dalam timeline tiket dan
    dapat dipantau pelapor melalui fitur Lacak Tiket dengan
    nomor tiket format WSH-2026-XXXX.

6.4 SLA Ringkas
    - Konfirmasi penerimaan tiket : otomatis, seketika.
    - Triase awal                 : < 15 menit (CRITICAL).
    - Pembaruan berkala           : setiap 4 jam selama insiden aktif.
    - Laporan akhir (RCA)         : maksimal 5 hari kerja setelah RESOLVED.

=====================================================================
Dokumen ini diterbitkan WHOOSH CSIRT sesuai RFC 2350.
Pertanyaan mengenai dokumen: csirt@kcic.co.id | +62 21 500-911
=====================================================================`

export const INITIAL_ADVISORIES: SecurityAdvisory[] = [
  {
    id: 'ADV-2026-011',
    cveId: 'CVE-2026-21841',
    cvssScore: '9.8',
    severity: 'CRITICAL',
    title: 'Remote Code Execution pada Web Server HTTP/3 Stack',
    publishedDate: '2026-11-18',
    affectedSystems: [
      'Web server NXServe 2.4.0 – 2.4.7',
      'Reverse proxy NXEdge < 1.9.3',
      'Container image nxserve:2.4 (semua tag sebelum 2026-11-15)',
    ],
    summary:
      'Kerentanan heap overflow pada parsing frame HTTP/3 memungkinkan penyerang jarak jauh mengeksekusi kode arbitrer dengan hak proses web server tanpa autentikasi. Eksploitasi aktif terpantau menargetkan portal pemerintah sejak 16 November 2026.',
    technicalDetails:
      'Cacat berada pada fungsi ngx_h3_parse_qpack() ketika menangani tabel dinamis QPACK dengan ukuran entri melebihi batas yang dinegosiasikan. Paket QPACK terfragmentasi khusus menyebabkan penulisan di luar buffer heap sebesar 64 byte, cukup untuk menimpa pointer fungsi pada allocator tcache. Proof-of-concept publik tersedia dan modul eksploitasi Metasploit telah beredar. WHOOSH CSIRT mengonfirmasi minimal 14 host internal KCIC menjalankan versi terdampak yang terekspos ke internet.',
    mitigationSteps: [
      'Segera upgrade NXServe ke versi 2.4.8 atau lebih baru (rilis 15 November 2026).',
      'Jika upgrade tertunda, nonaktifkan listener HTTP/3 (QUIC) dan batasi akses ke HTTP/2.',
      'Terapkan aturan WAF untuk memblokir frame QPACK dengan dynamic table size > 4096 byte.',
      'Audit log akses untuk pola request HTTP/3 anomali sejak 10 November 2026.',
      'Rotasi seluruh kredensial dan session secret pada host yang terekspos.',
    ],
  },
  {
    id: 'ADV-2026-010',
    cveId: 'CVE-2026-19907',
    cvssScore: '9.1',
    severity: 'CRITICAL',
    title: 'Zero-Day Authentication Bypass pada VPN Gateway SSL',
    publishedDate: '2026-11-12',
    affectedSystems: [
      'SecureGate VPN Gateway 9.1R1 – 9.1R6',
      'SecureGate Virtual Appliance 9.1.x',
    ],
    summary:
      'Cacat validasi token SAML pada portal SSL VPN memungkinkan bypass autentikasi penuh. Penyerang dapat membuat sesi administratif tanpa kredensial. Kerentanan dieksploitasi in-the-wild sebelum patch tersedia (zero-day).',
    technicalDetails:
      'Endpoint /dana-na/auth/saml-endpoint.cgi menerima assertion SAML yang ditandatangani dengan kunci yang diambil dari parameter URL milik penyerang (key confusion). Dengan menanam kunci publik penyerang pada parameter "sigkey", assertion palsu diterima sebagai valid. Actor yang terindikasi APT menggunakan akses ini untuk menanam webshell dan melakukan lateral movement ke jaringan internal melalui tunnel VPN.',
    mitigationSteps: [
      'Terapkan hotfix SG-9.1R6-HF3 dari vendor sesegera mungkin.',
      'Batasi akses portal SSL VPN hanya dari IP allowlist / jaringan manajemen.',
      'Nonaktifkan sementara autentikasi SAML dan gunakan autentikasi lokal + MFA.',
      'Periksa log sesi administratif anomali: cari user-agent kosong dan sesi tanpa event login.',
      'Lakukan threat hunting webshell pada direktori web appliance dan reset seluruh konfigurasi jika ditemukan IOC.',
    ],
  },
  {
    id: 'ADV-2026-009',
    cveId: 'TLP-AMBER / No-CVE',
    cvssScore: '—',
    severity: 'HIGH',
    title: 'Kampanye Phishing Mengatasnamakan Direksi KCIC & Portal Pengadaan',
    publishedDate: '2026-11-08',
    affectedSystems: [
      'Pengguna email korporat KCIC & mitra vendor',
      'Kredensial portal pengadaan / e-Procurement KCIC',
      'Perangkat Windows dengan macro Office aktif',
    ],
    summary:
      'Kampanye phishing bertarget berbahasa Indonesia mengirimkan lampiran "Dokumen_Pengadaan_KCIC_2026.xlsm" dan tautan portal palsu bertema verifikasi vendor e-Procurement. Payload mencuri kredensial dan memasang infostealer.',
    technicalDetails:
      'Email dikirim dari domain look-alike (kcic-procurement[.]id, vendor-verifikasi[.]net) dengan SPF lolos karena abuse layanan email marketing. Lampiran XLSM menjalankan macro yang mengunduh DLL loader dari CDN yang disalahgunakan, lalu memuat stealer keluarga LummaC2 varian 2026. Halaman phishing meniru sempurna halaman login e-Procurement KCIC termasuk CAPTCHA, dan meneruskan kredensial secara real-time (AiTM) untuk melewati MFA berbasis OTP.',
    mitigationSteps: [
      'Blokir domain IOC pada DNS firewall dan secure web gateway (daftar IOC lengkap tersedia via email TLP:AMBER).',
      'Terapkan kebijakan blokir macro Office dari file berasal internet (Mark-of-the-Web).',
      'Aktifkan MFA phishing-resistant (FIDO2) untuk seluruh akun portal pengadaan dan keuangan.',
      'Sosialisasikan kepada unit keuangan & pengadaan: direksi KCIC tidak pernah mengirim lampiran XLSM via email.',
      'Laporkan email mencurigakan ke incident@kcic.co.id beserta header lengkap.',
    ],
  },
  {
    id: 'ADV-2026-008',
    cveId: 'CVE-2026-17355',
    cvssScore: '8.6',
    severity: 'HIGH',
    title: 'SQL Injection Tidak Terautentikasi pada API Gateway Layanan Publik',
    publishedDate: '2026-10-30',
    affectedSystems: [
      'APIFlow Gateway 3.2.x < 3.2.9',
      'Modul rate-limit & analytics APIFlow',
    ],
    summary:
      'Parameter "sort_by" pada endpoint analytics API gateway tidak disanitasi dan diteruskan langsung ke kueri ORDER BY, memungkinkan blind SQL injection tanpa autentikasi pada konfigurasi default.',
    technicalDetails:
      'Endpoint /api/v2/analytics/usage menyusun kueri dengan konkatenasi string. Karena posisi injeksi berada pada klausa ORDER BY, UNION tidak dapat digunakan, namun boolean-based dan time-based blind injection (pg_sleep / WAITFOR) terbukti bekerja. Penyerang dapat mengekstrak tabel api_keys yang berisi kunci API seluruh tenant. Database yang didukung: PostgreSQL dan MSSQL. Eksploitasi meninggalkan pola kueri pg_sleep berdurasi ganjil pada log database.',
    mitigationSteps: [
      'Upgrade APIFlow Gateway ke 3.2.9 yang menerapkan whitelist kolom sorting.',
      'Terapkan WAF rule untuk menolak karakter titik-koma, komentar SQL, dan fungsi waktu pada parameter sort_by.',
      'Rotasi seluruh API key tenant bila log menunjukkan indikasi ekstraksi.',
      'Batasi endpoint analytics ke jaringan internal atau wajibkan autentikasi.',
      'Aktifkan logging kueri lambat dan buat alert untuk pg_sleep/WAITFOR dari koneksi aplikasi.',
    ],
  },
  {
    id: 'ADV-2026-007',
    cveId: 'TLP-AMBER / No-CVE',
    cvssScore: '—',
    severity: 'HIGH',
    title: 'Ransomware LockBit Varian "Crimson" Menargetkan Sektor Kesehatan',
    publishedDate: '2026-10-22',
    affectedSystems: [
      'Windows Server 2016 – 2025 tanpa patch terbaru',
      'Perangkat NAS dengan SMB terbuka',
      'Backup yang terhubung jaringan produksi',
    ],
    summary:
      'Varian baru keluarga LockBit dengan ekstensi .crimson teridentifikasi menyerang rumah sakit dan laboratorium di Asia Tenggara. Enkripsi ganda (file + shadow copy) dan exfiltration sebelum enkripsi membuat pemulihan tanpa backup offline hampir mustahil.',
    technicalDetails:
      'Akses awal melalui kredensial RDP hasil pembelian di initial access broker, disusul eskalasi dengan tool BYOVD (driver rentan tertandatangani) untuk mematikan EDR. Enkripsi menggunakan kurva Curve25519 + ChaCha20 dengan mode intermiten (encrypt 16 byte tiap 4KB) sehingga proses sangat cepat dan sulit dideteksi berbasis I/O. Sebelum enkripsi, data dieksfiltrasi via rclone ke penyimpanan cloud. Ransom note berbahasa Indonesia hasil terjemahan mesin menuntut pembayaran dalam 72 jam.',
    mitigationSteps: [
      'Terapkan MFA pada seluruh akses RDP/VPN dan hapus eksposur RDP langsung ke internet.',
      'Aktifkan tamper protection EDR dan blokir driver rentan melalui WDAC / Microsoft vulnerable driver blocklist.',
      'Pastikan backup mengikuti kaidah 3-2-1-1-0: satu salinan offline/immutable, uji restore berkala.',
      'Segmentasikan jaringan NAS/backup dari jaringan pengguna dan server produksi.',
      'Buat alert untuk pembuatan scheduled task anomali, penggunaan rclone, dan penghapusan shadow copy (vssadmin delete shadows).',
    ],
  },
  {
    id: 'ADV-2026-006',
    cveId: 'CVE-2026-15021',
    cvssScore: '6.5',
    severity: 'MEDIUM',
    title: 'Privilege Escalation Lokal pada Agen Manajemen Endpoint',
    publishedDate: '2026-10-15',
    affectedSystems: [
      'EndpointGuard Agent 5.0 – 5.3.2 (Windows)',
      'Layanan EGSvc dengan konfigurasi default',
    ],
    summary:
      'Layanan agen manajemen endpoint memuat DLL dari direktori yang dapat ditulis pengguna biasa, memungkinkan privilege escalation lokal ke NT AUTHORITY\\SYSTEM melalui DLL search-order hijacking.',
    technicalDetails:
      'EGSvc.exe memanggil LoadLibrary("eghelper.dll") tanpa jalur absolut dan tanpa SetDllDirectory. Direktori C:\\ProgramData\\EndpointGuard\\plugins memiliki ACL yang mengizinkan grup Users menulis. Pengguna lokal berprivilege rendah dapat menempatkan DLL jahat yang dimuat saat layanan restart (dipicu rutin setiap pembaruan kebijakan). Kerentanan memerlukan akses lokal sehingga skor CVSS 6.5, namun relevan sebagai tahap pasca-kompromi pada rantai serangan phishing.',
    mitigationSteps: [
      'Upgrade agen ke versi 5.3.3 yang memuat DLL dengan jalur absolut.',
      'Perketat ACL direktori plugins: hanya SYSTEM dan Administrators dengan hak tulis.',
      'Aktifkan aturan ASR "Block process creations originating from PSExec and WMI" dan pantau image load tak bertanda tangan pada EGSvc.',
      'Prioritaskan patch pada server yang dapat diakses banyak pengguna (RDS/jump host).',
    ],
  },
  {
    id: 'ADV-2026-005',
    cveId: 'INFO / Best-Practice',
    cvssScore: '—',
    severity: 'INFO',
    title: 'Panduan Hardening Active Directory Menjelang Audit Akhir Tahun',
    publishedDate: '2026-10-05',
    affectedSystems: [
      'Domain Controller Windows Server 2016+',
      'Akun layanan (service account) dan akun administrator domain',
    ],
    summary:
      'Buletin panduan praktis memperkuat Active Directory menghadapi musim audit dan libur akhir tahun, saat tim IT minim personel namun aktivitas serangan meningkat. Mencakup tiering administratif, LAPS, dan deteksi Kerberoasting.',
    technicalDetails:
      'Rekomendasi utama: (1) terapkan model tiering Tier-0/Tier-1/Tier-2 sehingga kredensial Domain Admin tidak pernah menyentuh workstation; (2) migrasikan seluruh akun layanan ke gMSA (Group Managed Service Account) untuk menghilangkan password statis yang rentan Kerberoasting; (3) aktifkan Windows LAPS untuk password administrator lokal unik per mesin; (4) audit anggota grup privileged (Domain Admins, Enterprise Admins, Account Operators) dan hapus keanggotaan tidak diperlukan; (5) pantau event ID 4769 dengan tipe enkripsi RC4 (0x17) sebagai indikator permintaan tiket Kerberoasting.',
    mitigationSteps: [
      'Jalankan audit grup privileged dan dokumentasikan seluruh akun layanan beserta pemiliknya.',
      'Aktifkan Windows LAPS melalui GPO dan simpan password di atribut terenkripsi AD.',
      'Migrasikan akun layanan bernilai tinggi ke gMSA secara bertahap.',
      'Buat alert SIEM untuk event 4769 RC4 dan penambahan anggota grup admin (4728/4732/4756).',
      'Uji prosedur pemulihan DC dari backup system state sebelum periode libur akhir tahun.',
    ],
  },
]

export const INITIAL_INCIDENTS: IncidentReport[] = [
  {
    ticketId: 'WSH-2026-1001',
    reporterName: 'Bima Anggara',
    organization: 'PT KCIC — Direktorat Operasi Stasiun Halim',
    email: 'bima.anggara@kcic.co.id',
    phone: '+62 812-2045-7781',
    title: 'Portal informasi penumpang Stasiun Halim menampilkan halaman defacement bermuatan judi online',
    category: 'Web Defacement',
    severity: 'HIGH',
    incidentDate: '2026-11-19T06:40',
    targetSystem: 'https://halim-info.kcic.co.id — 103.28.148.22',
    description:
      'Sejak pukul 06.40 WIB halaman utama portal informasi penumpang (jadwal, tarif, dan pengumuman operasional) Stasiun Halim menampilkan konten judi online dengan teks "Hacked by GhostRider". Halaman lain (subpath /berita dan /pengumuman) masih normal. Tim kami sudah memutus akses tulis CMS dan mengganti kredensial admin. Diduga masuk melalui plugin upload pihak ketiga yang belum diperbarui. Mohon bantuan analisis jalur masuk dan verifikasi pembersihan.',
    evidenceFileName: 'defacement-screenshot-0640.png',
    attachments: [
      {
        id: 'seed-att-1001-1',
        name: 'defacement-screenshot-0640.svg',
        mime: 'image/svg+xml',
        size: 1240,
        dataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(
          '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360"><rect width="640" height="360" fill="#0B1220"/><rect x="24" y="24" width="592" height="60" fill="#D90429"/><text x="40" y="62" font-family="monospace" font-size="26" fill="#ffffff">DEFACED :: portal ticketing KCIC</text><text x="40" y="130" font-family="monospace" font-size="16" fill="#94A3B8">capture 19 Nov 2026 06.41 WIB</text><rect x="24" y="160" width="592" height="150" fill="#111827" stroke="#334155"/><text x="40" y="200" font-family="monospace" font-size="14" fill="#F87171">/upload/form-builder-3.1.2/ :: webshell terdeteksi</text><text x="40" y="230" font-family="monospace" font-size="14" fill="#94A3B8">hash sha256 dicatat utk threat hunting</text></svg>',
        )}`,
      },
      {
        id: 'seed-att-1001-2',
        name: 'bukti-defacement.pdf',
        mime: 'application/pdf',
        size: 610,
        dataUrl:
          'data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PCAvVHlwZSAvQ2F0YWxvZyAvUGFnZXMgMiAwIFIgPj4KZW5kb2JqCjIgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzIC9LaWRzIFszIDAgUl0gL0NvdW50IDEgPj4KZW5kb2JqCjMgMCBvYmoKPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvTWVkaWFCb3ggWzAgMCA2MTIgNzkyXSAvQ29udGVudHMgNCAwIFIgL1Jlc291cmNlcyA8PCAvRm9udCA8PCAvRjEgNSAwIFIgPj4gPj4gPj4KZW5kb2JqCjQgMCBvYmoKPDwgL0xlbmd0aCA3MSA+PgpzdHJlYW0KQlQgL0YxIDEzIFRmIDYwIDcyMCBUZCAoQlVLVEkgREVGQUNFTUVOVCAtIHBvcnRhbCB0aWNrZXRpbmcgS0NJQykgVGogRVQKZW5kc3RyZWFtCmVuZG9iago1IDAgb2JqCjw8IC9UeXBlIC9Gb250IC9TdWJ0eXBlIC9UeXBlMSAvQmFzZUZvbnQgL0NvdXJpZXIgPj4KZW5kb2JqCnhyZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAwOSAwMDAwMCBuIAowMDAwMDAwMDU4IDAwMDAwIG4gCjAwMDAwMDAxMTUgMDAwMDAgbiAKMDAwMDAwMDI0MSAwMDAwMCBuIAowMDAwMDAwMzYyIDAwMDAwIG4gCnRyYWlsZXIKPDwgL1NpemUgNiAvUm9vdCAxIDAgUiA+PgpzdGFydHhyZWYKNDMwCiUlRU9G',
      },
    ],
    status: 'INVESTIGATING',
    tlp: 'TLP:AMBER',
    assignedTo: 'Analis Raka Pratama',
    iocs: [
      {
        id: 'ioc-1001-a',
        type: 'HASH',
        value: 'b7c94f1e2a8d3065c9e4b7a21f0d8c36e5a94b2d7c1f0e8a39b6d4c2e1f0a7b3',
        note: 'SHA-256 webshell "form-builder/upload.php" — dipakai untuk threat hunting lintas sistem KCIC.',
        addedBy: 'Analis Raka Pratama',
        addedAt: '2026-11-20T09:20:00+07:00',
      },
      {
        id: 'ioc-1001-b',
        type: 'IP',
        value: '185.220.101.47',
        note: 'IP sumber unggahan webshell (tor exit node), teridentifikasi dari access log 19 Nov 05.58 WIB.',
        addedBy: 'Analis Raka Pratama',
        addedAt: '2026-11-20T09:22:00+07:00',
      },
    ],
    internalNotes: [
      {
        id: 'int-1001-a',
        author: 'Analis Raka Pratama',
        role: 'ANALYST',
        text: 'Plugin form-builder 3.1.2 punya CVE publik unrestricted upload. Minta tim hosting snapshot disk sebelum pembersihan total. Jangan sebut nama plugin ke publik sebelum patch merata di sistem KCIC lain.',
        createdAt: '2026-11-20T09:25:00+07:00',
      },
    ],
    cveRefs: [],
    createdAt: '2026-11-19T06:58:00+07:00',
    updatedAt: '2026-11-20T09:15:00+07:00',
    timeline: [
      {
        timestamp: '2026-11-19T06:58:00+07:00',
        status: 'OPEN',
        note: 'Laporan diterima melalui formulir portal WHOOSH CSIRT. Tiket dibuat otomatis dan masuk antrean triase.',
        officer: 'Sistem WHOOSH',
      },
      {
        timestamp: '2026-11-19T07:04:00+07:00',
        status: 'TRIAGED',
        note: 'Triase awal selesai dalam 6 menit. Defacement terkonfirmasi, urgensi HIGH ditetapkan dengan klasifikasi TLP:AMBER. Analis Raka Pratama ditugaskan sebagai penanggung jawab.',
        officer: 'Koordinator Yusuf Hakim',
      },
      {
        timestamp: '2026-11-19T07:10:00+07:00',
        status: 'INVESTIGATING',
        note: 'Subpath lain (/berita, /pengumuman) diverifikasi aman. Analis meminta akses log web server dan daftar plugin CMS untuk penelusuran jalur masuk.',
        officer: 'Analis Raka Pratama',
      },
      {
        timestamp: '2026-11-20T09:15:00+07:00',
        status: 'INVESTIGATING',
        note: 'Ditemukan webshell pada direktori upload plugin "form-builder" versi 3.1.2 (rentan unrestricted upload). Webshell diisolasi, hash dicatat untuk threat hunting. Koordinasi dengan tim hosting untuk snapshot forensik sebelum pembersihan.',
        officer: 'Analis Raka Pratama',
      },
    ],
  },
  {
    ticketId: 'WSH-2026-1002',
    reporterName: 'Sari Wulandari',
    organization: 'PT KCIC — Unit Keuangan & Pengadaan',
    email: 'sari.wulandari@kcic.co.id',
    phone: '+62 811-9902-3345',
    title: 'Karyawan menerima email phishing mengatasnamakan direksi (BEC)',
    category: 'Phishing / Social Engineering',
    severity: 'MEDIUM',
    incidentDate: '2026-11-14T10:20',
    targetSystem: 'Mail server korporat — mail.kcic.co.id',
    description:
      'Tiga staf keuangan menerima email dari alamat mirip direktur utama (direksi.kcic@gmail.com) meminta transfer dana "akuisisi mendesak" sebesar Rp 480 juta ke rekening baru. Satu staf sempat membalas namun belum melakukan transfer. Kami khawatir kredensial email sudah bocor karena staf tersebut mengklik tautan "dokumen akuisisi" pada email pertama.',
    evidenceFileName: 'email-header-bec.eml',
    status: 'RESOLVED',
    tlp: 'TLP:AMBER',
    assignedTo: 'Analis Dita Maharani',
    iocs: [
      {
        id: 'ioc-1002-a',
        type: 'DOMAIN',
        value: 'kcic-akuisisi.net',
        note: 'Domain look-alike terdaftar 12 Nov 2026, dipakai halaman credential harvesting bertema SharePoint.',
        addedBy: 'Analis Dita Maharani',
        addedAt: '2026-11-14T11:10:00+07:00',
      },
      {
        id: 'ioc-1002-b',
        type: 'EMAIL',
        value: 'direksi.kcic@gmail.com',
        note: 'Alamat pengirim BEC menyamar sebagai direktur utama KCIC.',
        addedBy: 'Analis Dita Maharani',
        addedAt: '2026-11-14T11:12:00+07:00',
      },
    ],
    internalNotes: [
      {
        id: 'int-1002-a',
        author: 'Analis Dita Maharani',
        role: 'ANALYST',
        text: 'Pola kampanye sama dengan ADV-2026-009 (infrastruktur bulletproof hosting). Teruskan IOC ke mailing list internal TLP:AMBER. Pelapor kooperatif, tidak ada dana keluar.',
        createdAt: '2026-11-14T14:25:00+07:00',
      },
    ],
    cveRefs: [
      {
        cveId: 'CVE-2023-23397',
        score: 9.8,
        severity: 'CRITICAL',
        cvssVersion: '3.1',
        summary:
          'Microsoft Outlook elevation of privilege: email crafted khusus memicu relay NTLM otomatis saat pesan diambil klien Outlook, bahkan sebelum dibuka di Preview Pane — relevan sebagai vektor email-borne pada kampanye phishing ini.',
        vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
        source: 'DEMO',
        linkedBy: 'Analis Dita Maharani',
        linkedAt: '2026-11-14T11:20:00+07:00',
      },
    ],
    createdAt: '2026-11-14T10:47:00+07:00',
    updatedAt: '2026-11-16T15:30:00+07:00',
    timeline: [
      {
        timestamp: '2026-11-14T10:47:00+07:00',
        status: 'OPEN',
        note: 'Laporan diterima. Kategori Business Email Compromise (BEC) dengan indikasi klik tautan phishing.',
        officer: 'Sistem WHOOSH',
      },
      {
        timestamp: '2026-11-14T10:58:00+07:00',
        status: 'TRIAGED',
        note: 'Triase selesai: urgensi MEDIUM, klasifikasi TLP:AMBER. Analis Dita Maharani ditugaskan. Prioritas dinaikkan bila ditemukan transaksi keluar.',
        officer: 'Koordinator Yusuf Hakim',
      },
      {
        timestamp: '2026-11-14T11:05:00+07:00',
        status: 'INVESTIGATING',
        note: 'Analisis header email: dikirim dari infrastruktur bulletproof hosting, domain look-alike terdaftar 12 November 2026. Tautan mengarah ke halaman credential harvesting bertema SharePoint.',
        officer: 'Analis Dita Maharani',
      },
      {
        timestamp: '2026-11-14T14:20:00+07:00',
        status: 'CONTAINMENT',
        note: 'Reset paksa kredensial 3 akun terdampak, revoke seluruh sesi aktif, blokir domain IOC di mail gateway. Aturan transport dibuat untuk karantina email dengan pola display-name direksi dari domain eksternal.',
        officer: 'Analis Dita Maharani',
      },
      {
        timestamp: '2026-11-16T15:30:00+07:00',
        status: 'RESOLVED',
        note: 'Tidak ditemukan akses ilegal pasca-reset dan tidak ada transaksi keluar. MFA diwajibkan untuk seluruh akun keuangan. Laporan akhir (RCA) dan materi awareness BEC dikirim ke pelapor. Tiket ditutup.',
        officer: 'Koordinator Yusuf Hakim',
      },
    ],
  },
  {
    ticketId: 'WSH-2026-1003',
    reporterName: 'Andi Prasetyo',
    organization: 'PT KCIC — Operation Control Center (OCC) Tegalluar',
    email: 'andi.prasetyo@kcic.co.id',
    phone: '+62 813-8871-0092',
    title: 'File server administrasi OCC Tegalluar terenkripsi ransomware berekstensi .crimson',
    category: 'Ransomware / Malware',
    severity: 'CRITICAL',
    incidentDate: '2026-11-21T03:15',
    targetSystem: 'FS-OCC-01 (192.168.10.15) — share \\FS-OCC-01\\keuangan',
    description:
      'Pagi ini seluruh file pada share keuangan dan kepegawaian berubah ekstensi menjadi .crimson dan tidak dapat dibuka. Ditemukan file README_RESTORE.txt berisi tebusan 2,5 BTC dengan tenggat 72 jam. Sistem aplikasi operasi kereta (train scheduling) berjalan pada jaringan terpisah dan tidak terdampak. Server backup NAS terlihat ikut terenkripsi sebagian. Kami sudah mencabut kabel jaringan file server. Mohon pendampingan segera karena data gaji dan administrasi awak kereta terdampak.',
    evidenceFileName: 'ransom-note-crimson.txt',
    status: 'OPEN',
    tlp: 'TLP:RED',
    assignedTo: null,
    iocs: [],
    internalNotes: [],
    cveRefs: [],
    createdAt: '2026-11-21T07:02:00+07:00',
    updatedAt: '2026-11-21T07:02:00+07:00',
    timeline: [
      {
        timestamp: '2026-11-21T07:02:00+07:00',
        status: 'OPEN',
        note: 'Laporan diterima melalui formulir portal WHOOSH CSIRT. Tiket dibuat otomatis dan masuk antrean triase prioritas CRITICAL.',
        officer: 'Sistem WHOOSH',
      },
    ],
  },
]

export const EMERGENCY_GUIDES: EmergencyGuide[] = [
  {
    step: 1,
    title: 'Isolasi Sistem Terdampak',
    description:
      'Cabut koneksi jaringan (kabel LAN / Wi-Fi) perangkat yang terinfeksi, namun JANGAN matikan daya — memori volatile adalah bukti forensik paling berharga. Isolasi mencegah ransomware dan malware menyebar ke server lain.',
  },
  {
    step: 2,
    title: 'Dokumentasikan Kondisi',
    description:
      'Foto layar ransom note / pesan error, catat waktu kejadian (WIB), ekstensi file berubah, dan akun yang sedang login. Simpan header email asli untuk kasus phishing. Dokumentasi mempercepat triase analis secara signifikan.',
  },
  {
    step: 3,
    title: 'Laporkan Segera ke WHOOSH',
    description:
      'Kirim laporan melalui formulir portal ini atau hotline +62 21 500-911 untuk insiden CRITICAL. Semakin cepat laporan masuk, semakin besar peluang containment sebelum dampak meluas. Respons awal kami < 15 menit.',
  },
  {
    step: 4,
    title: 'Jangan Hapus Log & Jangan Bayar',
    description:
      'Jangan menghapus log, memformat ulang, atau menjalankan "antivirus pembersih" sebelum koordinasi — jejak serangan dibutuhkan untuk analisis. Jangan membayar tebusan: tidak ada jaminan data kembali, dan pembayaran mendanai serangan berikutnya.',
  },
]

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'SLA & Respons',
    question: 'Berapa lama WHOOSH CSIRT merespons laporan insiden saya?',
    answer:
      'Konfirmasi penerimaan tiket bersifat otomatis dan seketika. Triase awal oleh analis manusia: CRITICAL < 15 menit, HIGH < 30 menit, MEDIUM < 2 jam kerja, dan LOW < 1 hari kerja. Selama insiden aktif berstatus CRITICAL/HIGH, kami memberikan pembaruan berkala setiap 4 jam melalui timeline tiket dan kontak pelapor. Laporan akhir (Root Cause Analysis) diserahkan maksimal 5 hari kerja setelah tiket RESOLVED.',
  },
  {
    id: 'faq-2',
    category: 'Kerahasiaan',
    question: 'Apakah identitas saya dan data instansi dijamin kerahasiaannya?',
    answer:
      'Ya. Seluruh laporan diperlakukan dengan klasifikasi minimum TLP:AMBER — hanya dapat diakses personel WHOOSH CSIRT yang menangani insiden dan pihak di instansi Anda yang perlu tahu. Identitas pelapor tidak pernah dipublikasikan atau dibagikan ke pihak ketiga tanpa persetujuan tertulis Anda. Untuk komunikasi sangat sensitif, gunakan email terenkripsi PGP ke incident@kcic.co.id dengan Key ID 0x77B2E104.',
  },
  {
    id: 'faq-3',
    category: 'TLP',
    question: 'Apa itu Traffic Light Protocol (TLP) dan bagaimana penerapannya?',
    answer:
      'TLP adalah standar internasional penandaan sensitivitas informasi. TLP:RED hanya untuk pihak yang disebut langsung dalam komunikasi; TLP:AMBER terbatas pada organisasi yang perlu tahu; TLP:GREEN boleh dibagikan dalam komunitas konstituen; TLP:CLEAR boleh dipublikasikan umum. Advisory di portal ini bertanda TLP:CLEAR kecuali disebut lain. Indikator kompromi (IOC) teknis umumnya dibagikan TLP:AMBER via email terdaftar.',
  },
  {
    id: 'faq-4',
    category: 'Tanggap Darurat',
    question: 'Apa langkah pertama jika kantor saya terkena ransomware?',
    answer:
      'Empat langkah kritis: (1) Isolasi — cabut kabel jaringan perangkat terinfeksi, jangan matikan daya agar bukti di memori tetap ada; (2) Dokumentasi — foto ransom note, catat waktu dan ekstensi file; (3) Laporkan — hubungi hotline +62 21 500-911 atau formulir portal dengan urgensi CRITICAL; (4) Jangan hapus log dan jangan bayar tebusan. Segera cek apakah backup offline/immutable Anda bersih sebelum memulihkan apa pun.',
  },
  {
    id: 'faq-5',
    category: 'Tanggap Darurat',
    question: 'Saya terlanjur mengklik tautan phishing dan mengisi password. Apa yang harus dilakukan?',
    answer:
      'Anggap kredensial sudah dikompromikan. Segera: (1) ganti password akun tersebut dari perangkat yang bersih, (2) aktifkan/reset MFA dan cabut seluruh sesi aktif (sign-out everywhere), (3) periksa aturan forward email dan aplikasi OAuth mencurigakan yang mungkin ditanam penyerang, (4) laporkan ke WHOOSH CSIRT dengan melampirkan header email asli (file .eml) agar kami dapat memblokir domain dan memburu korban lain di lingkungan KCIC.',
  },
  {
    id: 'faq-6',
    category: 'Pelaporan',
    question: 'Siapa saja yang boleh melapor dan apakah dipungut biaya?',
    answer:
      'Seluruh konstituen WHOOSH CSIRT — unit internal PT KCIC (stasiun Halim, Karawang, Padalarang, Tegalluar, OCC, depo, dan kantor pusat) serta penyelenggara sistem elektronik pendukung kereta cepat Whoosh — dapat melapor tanpa biaya apa pun. Masyarakat umum dan peneliti keamanan juga dipersilakan memakai portal ini sebagai wadah uji keamanan dan pelaporan kerentanan pada aset cakupan KCIC/Whoosh (coordinated vulnerability disclosure / VDP). Perlu ditegaskan: cakupan penanganan kami hanya aset KCIC/Whoosh — web/sistem organisasi lain tidak kami tangani atau perbaiki, dan laporan di luar cakupan diarahkan ke pemilik sistem atau CSIRT berwenang. Portal ini bukan penawaran layanan CSIRT komersial; kami tidak pernah meminta pembayaran untuk penanganan insiden.',
  },
  {
    id: 'faq-7',
    category: 'Pelaporan',
    question: 'Bagaimana cara memantau perkembangan tiket laporan saya?',
    answer:
      'Setiap laporan mendapat nomor tiket unik berformat WSH-2026-XXXX. Masukkan nomor tersebut pada fitur "Lacak Tiket" di portal ini untuk melihat status terkini (OPEN → TRIAGED → INVESTIGATING → CONTAINMENT → RESOLVED) beserta seluruh catatan tindakan resmi tim analis. Pembaruan bersifat real-time: setiap tindakan yang dicatat analis di dashboard langsung tampil pada pelacak tiket Anda.',
  },
  {
    id: 'faq-8',
    category: 'SLA & Respons',
    question: 'Apakah WHOOSH CSIRT menangani atau memperbaiki web/sistem organisasi lain?',
    answer:
      'Tidak. Cakupan WHOOSH CSIRT terbatas pada aset digital PT KCIC dan kereta cepat Whoosh (web/portal kcic.co.id, sistem ticketing & AFC, PIS, Wi-Fi stasiun/kereta, serta infrastruktur operasi stasiun/OCC/depo). Web atau sistem milik organisasi lain — mitra, vendor, ISP, hosting, maupun instansi di luar KCIC — tidak kami tangani, perbaiki, atau pulihkan; laporan di luar cakupan akan diarahkan ke pemilik sistem atau CSIRT berwenang (BSSN / Id-SIRTII/CC / CSIRT sektoral terkait). Bahkan pada aset dalam cakupan, kami berperan sebagai koordinator dan penasihat teknis: kepemilikan dan kendali sistem tetap di tangan pemiliknya, dan setiap tindakan perubahan (isolasi, patch, restore) dilakukan oleh tim internal KCIC atau dengan persetujuan eksplisit pemilik sistem.',
  },
  {
    id: 'faq-9',
    category: 'VDP',
    question: 'Saya peneliti keamanan yang menemukan kerentanan pada aset KCIC/Whoosh. Bagaimana melaporkannya?',
    answer:
      'Gunakan kanal Incident & Vulnerability Disclosure Center di portal ini — pilih kategori "Kerentanan / Temuan VDP", atau email PGP ke incident@kcic.co.id. Sertakan langkah reproduksi minimal, bukti secukupnya, dan perkiraan dampak. Pengujian hanya boleh dilakukan pada aset dalam cakupan KCIC/Whoosh; jangan mengeksploitasi lebih jauh, mengakses data pengguna, atau melakukan pengujian yang mengganggu layanan (DoS). WHOOSH CSIRT memverifikasi temuan, mendampingi remediasi bersama pemilik sistem internal, dan mengabari Anda pada tiap tahap. Peneliti yang beritikad baik dan mematuhi aturan cakupan ini tidak akan dituntut secara hukum atas aktivitas pengungkapannya (safe harbor). Temuan di luar cakupan KCIC/Whoosh tidak kami proses untuk remediasi — laporkan ke pemilik sistem atau CSIRT berwenang terkait.',
  },
  {
    id: 'faq-10',
    category: 'VDP',
    question: 'Aset apa saja yang boleh diuji dalam program pengungkapan kerentanan (VDP)?',
    answer:
      'Dalam cakupan: (1) web & portal KCIC — kcic.co.id beserta subdomain resmi, portal korporat, dan layanan web publik KCIC; (2) sistem digital Whoosh — ticketing & AFC gate, passenger information system, Wi-Fi stasiun/kereta, aplikasi & API pendukung operasi; (3) infrastruktur operasi KCIC — jaringan stasiun Halim/Karawang/Padalarang/Tegalluar, OCC, depo, dan kantor pusat. Di luar cakupan: web/sistem organisasi lain di luar KCIC/Whoosh, serta pengujian yang mengganggu layanan (DoS), akses atau perubahan data pengguna, dan social engineering terhadap staf. Berhenti pada proof minimal begitu kerentanan terbukti, lalu laporkan lewat formulir (kategori Kerentanan / Temuan VDP) atau email PGP. Laporan di luar cakupan diarahkan ke pemilik sistem atau CSIRT berwenang, tidak diremediasi oleh WHOOSH CSIRT.',
  },
]
# Kredensial Akses — SOC KCIC Portal WHOOSH CSIRT

Dokumen ini berisi akun demo, hak akses per peran, dan panduan konfigurasi
**National Vulnerability Database (NVD) API v2.0** untuk portal WHOOSH CSIRT —
PT Kereta Cepat Indonesia China (KCIC).

> Seluruh kredensial di bawah adalah **kredensial demo** yang sengaja dibuat
> terlihat untuk keperluan pengujian dan demonstrasi produk.

---

## 1. URL Akses (Rahasia)

| Jalur | Keterangan |
| --- | --- |
| Rute langsung **`/soc-control-wsh26`** | Mis. `http://localhost:5173/soc-control-wsh26` |

> **Rahasia:** rute ini **tidak ditautkan dari halaman publik mana pun** —
> tidak ada tombol, tautan, maupun ikon Admin di Navbar, Footer, maupun
> section publik. Akses hanya melalui URL di atas (atau bookmark internal tim).
> Rute lama `/admin` sudah tidak berlaku dan menampilkan portal publik.

Halaman login meminta **Email Petugas** + **PIN Petugas (4 digit)**.
Peran (role) ditentukan otomatis oleh akun yang dipakai — bukan dipilih manual.

---

## 2. Akun Demo

### Akun 1 — Lead Incident Handler (Akses Penuh)

| Field | Nilai |
| --- | --- |
| Email | `handler@kcic.co.id` |
| PIN | `2026` |
| Nama sesi | Koordinator Yusuf Hakim |

**Hak Akses:**

- Triase tiket (severity, klasifikasi TLP, penugasan analis).
- Mengubah **Global Threat Level** (`LOW` / `GUARDED` / `ELEVATED` / `CRITICAL`).
  **Bersifat internal SOC** — tersinkron real-time antar-sesi admin, namun
  **tidak ditampilkan di portal publik** (indikator posture disembunyikan
  dari pengunjung agar tidak membocorkan kesiagaan tim).
- **Publikasi & impor NVD Security Advisory** (tab *NVD Threat Intelligence* →
  *Import ke WHOOSH Advisory*, lalu tab *Publikasi Advisory*).
- **Ekspor CSV** rekap seluruh tiket insiden.
- Melihat **SOC Audit Log** (seluruh aksi petugas tercatat otomatis).
- Catatan publik untuk pelapor & catatan internal SOC.
- Korelasi **Referensi CVE Terkait** pada tiket (lampiran ringkasan NVD).
- Reset data demo & pengaturan API key NVD.

### Akun 2 — SOC Analyst Tier-1 (Operasional)

| Field | Nilai |
| --- | --- |
| Email | `analyst@kcic.co.id` |
| PIN | `1122` |
| Nama sesi | Analis Dita Maharani |

**Hak Akses:**

- **Triase tiket masuk** (severity, TLP, penugasan analis).
- **Tambah IoC** (Indicators of Compromise: IP / domain / URL / hash / email).
- **Update status investigasi**
  (`OPEN → TRIAGED → INVESTIGATING → CONTAINMENT → RESOLVED`).
- Korelasi **Referensi CVE Terkait** pada tiket (lampiran ringkasan NVD).
- Melihat feed **NVD Threat Intelligence** (tanpa tombol impor).

**Dibatasi untuk Analyst:** perubahan Global Threat Level (tampilan read-only),
publikasi/impor advisory, ekspor CSV, SOC Audit Log, catatan publik & internal,
reset data demo, dan pengaturan API key NVD. Panel yang dibatasi ditandai
ikon gembok beserta penjelasan peran yang diperlukan.

### Tombol cepat di layar login

- **`Isi Kredensial Lead Handler`** → mengisi `handler@kcic.co.id` + PIN `2026`.
- **`Isi Kredensial Analyst`** → mengisi `analyst@kcic.co.id` + PIN `1122`.

Kotak info di bawah formulir menampilkan kedua akun beserta ringkasan hak
aksesnya. Email yang tidak terdaftar ditolak dengan pesan error; PIN yang
salah ditolak dengan animasi shake dan pesan error.

---

## 3. Panduan Konfigurasi NVD API Key

Integrasi NVD memakai endpoint resmi NIST:
`https://services.nvd.nist.gov/rest/json/cves/2.0` dengan header `apiKey`.
Base URL dapat diganti lewat `VITE_NVD_API_BASE_URL` tanpa mengubah kode.

> **Catatan teknis CORS:** server NVD menolak *CORS preflight* (OPTIONS) dari
> browser, sehingga header `apiKey` tidak dapat dikirim langsung dari sisi
> klien. Proyek ini menyertakan **proxy dev/preview** (`/nvd-proxy` di
> `vite.config.ts`) yang meneruskan `apiKey` dari sisi server saat
> `npm run dev` / `npm run preview`. Bila aplikasi di-hosting statis tanpa
> proxy, sistem otomatis fallback ke **request live tanpa key** (simple
> request, tanpa preflight), lalu ke dataset demo offline bila tetap gagal.

### Langkah

1. Pastikan file **`.env`** tunggal berada di root proyek (sejajar
   `package.json`) — proyek ini tidak memakai `.env.local` maupun `.env.example`.
2. Isi dengan baris berikut:

   ```env
   # National Vulnerability Database (NIST NVD) API v2.0 Configuration
   VITE_NVD_API_KEY=0F010576-BEE1-49C2-BE2A-D1CB953B47AD
   VITE_NVD_API_BASE_URL=https://services.nvd.nist.gov/rest/json/cves/2.0
   ```

3. Restart dev server (`npm run dev`) agar variabel terbaca oleh Vite.
4. Alternatif tanpa file: buka **Admin → tab NVD Threat Intelligence →
   Pengaturan API Key**, tempel key, lalu **Simpan Key**. Key disimpan di
   `localStorage` browser tersebut dan diprioritaskan di atas nilai env.

### Jendela publikasi feed (pubStartDate–pubEndDate)

NVD **tidak memiliki endpoint `/latest`**. Feed rilis baru wajib ditarik dengan
parameter rentang **`pubStartDate` & `pubEndDate`** (format ISO-8601 UTC,
**maksimal rentang 120 hari** sesuai batas API NVD). Portal menyediakan preset
jendela: **HARI INI (1)**, **MINGGU INI (7)**, 14, 30, 90, dan **120 HARI (maks)**;
rentang yang ditampilkan di UI persis sama dengan parameter yang dikirim.
Hasil diurutkan **publikasi terbaru dulu**. Lookup nomor CVE presisi
(`cveId`) menelusuri seluruh riwayat NVD tanpa jendela; pencarian kata kunci
mengikuti jendela yang dipilih. Skor CVSS lengkap (v3.1/v3.0/v2.0) beserta
vektor, subskor exploitability/impact, dan rincian metrik tersedia pada kartu
CVE lewat tombol **Baca lengkap**.

### Pagination & proteksi API (per halaman, bukan sekaligus)

- Feed **tidak ditarik sekaligus**. Setiap halaman hanya mengambil
  `resultsPerPage` CVE (publik **12/halaman**, admin **18/halaman**) memakai
  parameter **`startIndex = (halaman − 1) × perPage`** — halaman 2 publik
  mengirim `startIndex=12`, admin `startIndex=18`, dan seterusnya sampai
  halaman terakhir (ribuan halaman tersedia; NVD tidak membatasi `startIndex`
  selama masih di dalam `totalResults`).
- Kontrol pagination: tombol **awal / sebelumnya / nomor halaman /
  berikutnya / terakhir** plus form **KE HAL … GO** untuk lompat langsung.
  Bar info menampilkan `HALAMAN x/y · total CVE · n/HALAMAN · STARTINDEX n`
  dan status batas laju. Ganti filter severity, kata kunci, atau jendela
  publikasi otomatis kembali ke halaman 1.
- **Antrian batas laju otomatis** di `nvdService`: maksimum **50 permintaan /
  30 detik dengan key** dan **5 permintaan / 30 detik tanpa key** (rolling
  window, bucket terpisah). Permintaan excess ditunda otomatis, bukan
  ditembakkan paralel — mengurangi risiko HTTP 403 dari NVD.
- **Cache per halaman (TTL 5 menit)**: membuka ulang halaman yang sama tidak
  menghasilkan permintaan jaringan baru. **AbortController** membatalkan
  permintaan halaman lama saat pengguna pindah halaman/filter dengan cepat,
  sehingga tidak ada respons basi yang menimpa state.
- Bila total hasil ≤ satu halaman (mis. filter CRITICAL yang hanya belasan
  CVE), kontrol pagination disembunyikan otomatis.

### Cakupan platform (scope)

- Platform ini **wadah publik untuk uji keamanan (security testing) dan
  pelaporan kerentanan/insiden** pada aset digital **PT KCIC / kereta cepat
  Whoosh** — bukan penawaran layanan CSIRT komersial.
- **Dalam cakupan:** web/portal `kcic.co.id` + subdomain resmi, sistem digital
  Whoosh (ticketing & AFC, PIS, Wi-Fi stasiun/kereta, aplikasi/API pendukung),
  dan infrastruktur operasi KCIC (stasiun, OCC, depo, kantor pusat).
- **Di luar cakupan:** web/sistem organisasi lain (mitra, vendor, ISP, hosting,
  instansi luar KCIC). WHOOSH CSIRT **tidak menangani atau memperbaiki** sistem
  tersebut; laporan di luar cakupan diarahkan ke pemilik sistem atau CSIRT
  berwenang (BSSN / Id-SIRTII/CC / CSIRT sektoral).
- Formulir laporan menyediakan kategori **Kerentanan / Temuan VDP**; banner
  batas cakupan tampil di seksi Mandat, Profil & RFC 2350, dan formulir laporan.

### Catatan keamanan

- **JANGAN mem-push `.env` ke repository publik.** File ini sudah diabaikan
  oleh `.gitignore` (`.env`, `.env.*`).
- Hanya ada **satu file environment** (`.env`); tidak ada `.env.local` atau
  `.env.example`. Bagikan konfigurasi melalui dokumentasi ini, bukan commit.
- Key NVD bersifat pribadi; tanpa key API tetap berfungsi namun dengan batas
  laju lebih ketat (±5 permintaan / 30 detik, versus ±50 permintaan / 30 detik
  dengan key).

### Perilaku fallback

- Bila NVD sibuk / rate-limit (HTTP 403) atau jaringan offline, panel admin dan
  widget publik otomatis beralih ke **dataset demo offline**
  (`src/data/nvdDemo.ts`) dengan banner peringatan yang jelas, plus tombol
  **Coba Live Lagi**.
- Bila API key belum diisi, feed tetap berjalan tanpa key dan menampilkan
  informasi batas laju pada panel pengaturan.

---

## 4. Ringkasan Alur Uji Cepat

1. Buka `http://localhost:5173/soc-control-wsh26` → klik **Isi Kredensial Lead Handler** → **Masuk Dashboard**.
2. Ubah **Global Threat Level** → status internal SOC berubah (panel admin);
   portal publik tetap netral — tidak menampilkan tingkat ancaman.
3. Tab **NVD Threat Intelligence** → cari `CVE-2024-3094` → **Import ke WHOOSH
   Advisory** → lengkapi mitigasi → **Terbitkan** → muncul di portal publik.
4. Tab **Tiket Insiden** → **Tangani / Detail** → triase, IoC, status, catatan,
   dan **Referensi CVE Terkait** → **Ekspor Laporan (CSV)**.
5. Tab **SOC Audit Log** → seluruh aksi di atas tercatat (login, threat level,
   impor NVD, triase, IoC, status, catatan, advisory, ekspor).
6. Logout → login **Isi Kredensial Analyst** → verifikasi pembatasan peran.
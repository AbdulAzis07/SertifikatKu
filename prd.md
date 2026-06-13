# PRD — Backend SertifikatKu

> **Dokumen ini khusus untuk implementasi backend.**
> Frontend sudah selesai dan **tidak boleh diubah** kecuali mengganti data dummy dengan props dari controller.

- **Versi:** 1.1 (update endpoint lengkap)
- **Tanggal:** 13 Juni 2026
- **Stack:** Laravel 13, PHP 8.3, PostgreSQL, Inertia.js

### Ringkasan Endpoint

| Modul | Jumlah Endpoint |
|---|---|
| Auth & Profile (Breeze + custom) | 3 custom (9 Breeze) |
| Dashboard | 1 |
| Event | 6 |
| Template | 5 |
| Peserta | 7 |
| Sertifikat | 8 |
| Verifikasi Publik | 2 |
| **Total endpoint custom** | **32** |

---

## 1. Tujuan

Mengimplementasikan seluruh lapisan backend agar aplikasi SertifikatKu berfungsi penuh — dari migrasi database, model Eloquent, controller CRUD, hingga fitur generate PDF, QR Code, import Excel, dan pengiriman email sertifikat.

---

## 2. Scope

| In Scope | Out of Scope |
|---|---|
| Migrasi tabel + seeder | Perubahan UI/UX frontend |
| Model Eloquent + relasi | REST API publik terpisah |
| Controller & Inertia response | Mobile app |
| 15+ endpoint (route web) | SSO / OAuth pihak ketiga |
| Generate PDF sertifikat | Fitur pembayaran |
| QR Code generation + verifikasi | Multi-tenancy |
| Import Excel peserta | |
| Kirim sertifikat via email | |
| Sistem revoke sertifikat | |

---

## 3. Database

### 3.1 Skema Migrasi

#### Tabel `events`
```
id                  BIGINT PK AUTO
user_id             BIGINT FK → users.id
nama                VARCHAR(255)
penyelenggara       VARCHAR(255)
lokasi              VARCHAR(255) NULLABLE
tanggal_mulai       DATE
tanggal_selesai     DATE NULLABLE
deskripsi           TEXT NULLABLE
kategori            VARCHAR(100)   -- seminar, workshop, pelatihan, dll
status              ENUM('upcoming','ongoing','completed')
created_at
updated_at
```

#### Tabel `templates`
```
id                  BIGINT PK AUTO
user_id             BIGINT FK → users.id
event_id            BIGINT FK → events.id NULLABLE
nama                VARCHAR(255)
orientasi           ENUM('landscape','portrait')
background_path     VARCHAR(500) NULLABLE   -- path file gambar
deskripsi_format    TEXT NULLABLE           -- format teks sertifikat
created_at
updated_at
```

#### Tabel `signers` (penandatangan)
```
id                  BIGINT PK AUTO
template_id         BIGINT FK → templates.id CASCADE DELETE
nama                VARCHAR(255)
jabatan             VARCHAR(255)
signature_path      VARCHAR(500) NULLABLE   -- path gambar tanda tangan
urutan              TINYINT DEFAULT 1       -- 1..4
created_at
updated_at
```

#### Tabel `participants`
```
id                  BIGINT PK AUTO
event_id            BIGINT FK → events.id CASCADE DELETE
nama                VARCHAR(255)
email               VARCHAR(255)
posisi              ENUM('peserta','pemateri','moderator','panitia','juri')
penghargaan         VARCHAR(255) NULLABLE   -- Best Presenter, Juara 1, dll
created_at
updated_at

INDEX (event_id, email)
```

#### Tabel `certificates`
```
id                  BIGINT PK AUTO
participant_id      BIGINT FK → participants.id CASCADE DELETE
template_id         BIGINT FK → templates.id
nomor_sertifikat    VARCHAR(100) UNIQUE     -- CERT/XX/YYYY/NNN
qr_code_path        VARCHAR(500) NULLABLE
pdf_path            VARCHAR(500) NULLABLE
status              ENUM('valid','dicabut') DEFAULT 'valid'
tanggal_terbit      DATE
dikirim_at          TIMESTAMP NULLABLE      -- kapan email dikirim
created_at
updated_at

INDEX (nomor_sertifikat)
INDEX (participant_id)
```

### 3.2 Relasi Eloquent

```
User         hasMany  Event
User         hasMany  Template
Event        hasMany  Template (opsional)
Event        hasMany  Participant
Template     hasMany  Signer (max 4)
Template     hasMany  Certificate
Participant  hasMany  Certificate
Participant  belongsTo Event
Certificate  belongsTo Participant
Certificate  belongsTo Template
Signer       belongsTo Template
```

### 3.3 Seeder

Buat `DatabaseSeeder` yang memanggil:
- `UserSeeder` — 1 akun admin: `admin@sertifikatku.com` / `password`
- `EventSeeder` — 3 event sample (upcoming, ongoing, completed)
- `TemplateSeeder` — 2 template dengan 2 signer masing-masing
- `ParticipantSeeder` — 10 peserta per event
- `CertificateSeeder` — generate sertifikat dummy untuk peserta yang sudah ada

---

## 4. Daftar Endpoint (Total 30)

> Semua route menggunakan **web routes** dengan Inertia.js response (bukan JSON API), kecuali endpoint publik `/verify` dan route yang memang perlu JSON (export, download).

### 4.1 Auth & Profile (Laravel Breeze — sebagian sudah ada)

| # | Method | Route | Controller | Keterangan |
|---|---|---|---|---|
| — | GET | `/login` | Breeze | Halaman login |
| — | POST | `/login` | Breeze | Proses login |
| — | POST | `/logout` | Breeze | Logout |
| — | GET | `/register` | Breeze | Halaman register |
| — | POST | `/register` | Breeze | Proses register |
| — | GET | `/forgot-password` | Breeze | Halaman lupa password |
| — | POST | `/forgot-password` | Breeze | Kirim link reset |
| — | GET | `/reset-password/{token}` | Breeze | Halaman reset password |
| — | POST | `/reset-password` | Breeze | Proses reset password |
| 1 | GET | `/profile` | `ProfileController@edit` | **Halaman edit profil — render Inertia dengan data user** |
| 2 | PUT/PATCH | `/profile` | `ProfileController@update` | **Update nama & email** |
| 3 | DELETE | `/profile` | `ProfileController@destroy` | **Hapus akun + logout** |

---

### 4.2 Dashboard

| # | Method | Route | Controller | Keterangan |
|---|---|---|---|---|
| 4 | GET | `/dashboard` | `DashboardController@index` | Kirim stat cards, chart data, recent certificates, activity feed ke Inertia |

**Data yang dikembalikan:**
```php
return Inertia::render('Dashboard', [
    'stats' => [
        'total_events'       => Event::count(),
        'total_participants' => Participant::count(),
        'total_certificates' => Certificate::count(),
        'active_templates'   => Template::count(),
    ],
    'chart_data'          => Certificate::perMonth(),   // 12 bulan terakhir
    'recent_certificates' => Certificate::with([...])->latest()->take(5)->get(),
    'activity_feed'       => ActivityLog::latest()->take(10)->get(),
]);
```

---

### 4.3 Event

| # | Method | Route | Controller | Keterangan |
|---|---|---|---|---|
| 5 | GET | `/events` | `EventController@index` | Daftar semua event (dengan search, filter, sort) |
| 6 | GET | `/events/create` | `EventController@create` | **Halaman form buat event baru** |
| 7 | POST | `/events` | `EventController@store` | Buat event baru |
| 8 | GET | `/events/{event}` | `EventController@show` | **Detail event: data event + jumlah peserta + jumlah sertifikat** |
| 9 | PUT | `/events/{event}` | `EventController@update` | Edit event |
| 10 | DELETE | `/events/{event}` | `EventController@destroy` | Hapus event (soft check: tidak bisa hapus jika ada sertifikat aktif) |

**Validasi `store` / `update`:**
```
nama            required|string|max:255
penyelenggara   required|string|max:255
lokasi          nullable|string|max:255
tanggal_mulai   required|date
tanggal_selesai nullable|date|after_or_equal:tanggal_mulai
deskripsi       nullable|string
kategori        required|in:seminar,workshop,pelatihan,konferensi,lainnya
```

**Auto-update status** via Eloquent accessor:
- `tanggal_mulai > today` → `upcoming`
- `tanggal_mulai <= today <= tanggal_selesai` → `ongoing`
- `tanggal_selesai < today` → `completed`

**Data `show` yang dikembalikan:**
```php
return Inertia::render('Events/Show', [
    'event'             => $event->load('participants', 'templates'),
    'participant_count' => $event->participants()->count(),
    'certificate_count' => Certificate::whereHas('participant', fn($q) => $q->where('event_id', $event->id))->count(),
    'templates'         => $event->templates()->with('signers')->get(),
]);
```

---

### 4.4 Template

| # | Method | Route | Controller | Keterangan |
|---|---|---|---|---|
| 11 | GET | `/templates` | `TemplateController@index` | Daftar template (grid view) |
| 12 | GET | `/templates/create` | `TemplateController@create` | **Halaman form buat template + data events untuk dropdown** |
| 13 | POST | `/templates` | `TemplateController@store` | Buat template + simpan signer |
| 14 | PUT | `/templates/{template}` | `TemplateController@update` | Edit template + sync signer |
| 15 | DELETE | `/templates/{template}` | `TemplateController@destroy` | Hapus template (cascade hapus signer) |

**Validasi `store` / `update`:**
```
nama                  required|string|max:255
orientasi             required|in:landscape,portrait
background            nullable|image|mimes:jpg,png,webp|max:5120
deskripsi_format      nullable|string
signers               required|array|min:1|max:4
signers.*.nama        required|string|max:255
signers.*.jabatan     required|string|max:255
signers.*.signature   nullable|image|mimes:png|max:2048
```

**Storage:** Simpan file ke `storage/app/public/templates/` dan `storage/app/public/signatures/`.

**Data `create` yang dikembalikan:**
```php
return Inertia::render('Templates/Create', [
    'events' => Event::orderBy('nama')->get(['id', 'nama', 'penyelenggara']),
]);
```

---

### 4.5 Peserta

| # | Method | Route | Controller | Keterangan |
|---|---|---|---|---|
| 16 | GET | `/participants` | `ParticipantController@index` | Daftar peserta (filter by event, search nama/email) |
| 17 | POST | `/participants` | `ParticipantController@store` | Tambah peserta manual |
| 18 | PUT | `/participants/{participant}` | `ParticipantController@update` | Edit peserta |
| 19 | DELETE | `/participants/{participant}` | `ParticipantController@destroy` | Hapus peserta |
| 20 | GET | `/participants/import` | `ParticipantController@importPage` | **Halaman form import Excel — render Inertia dengan daftar events** |
| 21 | POST | `/participants/import` | `ParticipantController@import` | Proses import massal via Excel |
| 22 | GET | `/participants/import/template` | `ParticipantController@downloadTemplate` | Download file Excel template kosong |

**Validasi `store` / `update`:**
```
event_id      required|exists:events,id
nama          required|string|max:255
email         required|email|max:255
posisi        required|in:peserta,pemateri,moderator,panitia,juri
penghargaan   nullable|string|max:255
```

**Import Page `GET /participants/import` (endpoint 20):**
```php
return Inertia::render('Participants/Import', [
    'events' => Event::orderBy('nama')->get(['id', 'nama']),
]);
```

**Import Excel (endpoint 21):**
```
file          required|file|mimes:xlsx,xls|max:10240
event_id      required|exists:events,id
```
- Gunakan package `maatwebsite/excel` (Laravel Excel)
- Kolom Excel: `Nama`, `Email`, `Posisi`, `Penghargaan`
- Validasi per baris: duplikat email dalam event yang sama akan di-skip dengan laporan error
- Return: jumlah berhasil diimpor, jumlah di-skip, detail error per baris

**Template Excel** yang bisa didownload oleh admin (endpoint 22): file `.xlsx` dengan header kolom kosong siap diisi.

---

### 4.6 Sertifikat

| # | Method | Route | Controller | Keterangan |
|---|---|---|---|---|
| 23 | GET | `/certificates` | `CertificateController@index` | Daftar sertifikat (filter, search, paginasi) |
| 24 | GET | `/certificates/{certificate}` | `CertificateController@show` | **Detail sertifikat untuk modal — return data lengkap dengan relasi** |
| 25 | GET | `/certificates/generate` | `CertificateController@generatePage` | **Halaman form generate — return daftar events + templates** |
| 26 | POST | `/certificates/generate` | `CertificateController@generate` | Proses generate sertifikat massal |
| 27 | GET | `/certificates/preview` | `CertificateController@previewPage` | **Halaman live preview — return templates + signers untuk toggle** |
| 28 | GET | `/certificates/{certificate}/download` | `CertificateController@download` | Download PDF sertifikat |
| 29 | POST | `/certificates/{certificate}/revoke` | `CertificateController@revoke` | Revoke sertifikat (status → dicabut) |
| 30 | POST | `/certificates/send-email` | `CertificateController@sendEmail` | Kirim sertifikat via email (bulk/single) |

**Data `show` (endpoint 24) yang dikembalikan:**
```php
return response()->json([
    'certificate' => $certificate->load([
        'participant.event',
        'template.signers',
    ]),
]);
```

**Data `generatePage` (endpoint 25) yang dikembalikan:**
```php
return Inertia::render('Certificates/Generate', [
    'events'    => Event::with('participants')->get(['id', 'nama', 'penyelenggara']),
    'templates' => Template::with('signers')->get(['id', 'nama', 'orientasi']),
]);
```

**Data `previewPage` (endpoint 27) yang dikembalikan:**
```php
return Inertia::render('Certificates/Preview', [
    'templates' => Template::with('signers')->get(),
    'sample'    => [
        'nama_peserta' => 'Budi Santoso',
        'event_nama'   => 'Workshop Laravel 2026',
        'nomor'        => 'CERT/WEB/2026/001',
    ],
]);
```

**Generate Sertifikat (endpoint 26):**
```
event_id      required|exists:events,id
template_id   required|exists:templates,id
```
Logic:
1. Ambil semua peserta dari `event_id` yang belum punya sertifikat untuk `template_id` ini
2. Loop setiap peserta:
   - Generate `nomor_sertifikat` unik: `CERT/{KODE_EVENT}/{TAHUN}/{COUNTER_3_DIGIT}` contoh: `CERT/WEB/2026/001`
   - Generate QR Code berisi URL `{APP_URL}/verify?code={nomor_sertifikat}` → simpan ke storage
   - Render PDF sertifikat menggunakan view Blade + Browsershot
   - Simpan record ke tabel `certificates`
3. Return: jumlah sertifikat berhasil dibuat

**Revoke (endpoint 19):**
- Hanya mengubah kolom `status` menjadi `dicabut`
- Tidak menghapus record / file PDF
- Catat di activity log

---

### 4.7 Verifikasi Publik

| # | Method | Route | Controller | Keterangan |
|---|---|---|---|---|
| — | GET | `/verify` | `VerifyController@index` | Halaman verifikasi (tanpa auth) — sudah ada di frontend |
| — | GET | `/verify/{code}` | `VerifyController@check` | Cek sertifikat by nomor — return JSON detail |

> **Catatan:** Kedua route ini sudah dihitung dalam total endpoint. Nomor tidak dilanjutkan karena di luar urutan auth-required.

**Response `/verify/{code}`:**
```json
{
  "status": "valid",          // valid | dicabut | not_found
  "certificate": {
    "nomor_sertifikat": "CERT/WEB/2026/001",
    "tanggal_terbit": "2026-06-13",
    "participant": {
      "nama": "Budi Santoso",
      "posisi": "peserta",
      "penghargaan": null
    },
    "event": {
      "nama": "Workshop Laravel 2026",
      "penyelenggara": "SertifikatKu",
      "tanggal_mulai": "2026-06-01"
    }
  }
}
```

---

## 5. Fitur Teknis Detail

### 5.1 Generate PDF Sertifikat

**Package:** `spatie/browsershot` atau `barryvdh/laravel-snappy`

Rekomendasi: gunakan **Browsershot** (lebih fleksibel untuk layout HTML/CSS kompleks).

```bash
composer require spatie/browsershot
npm install puppeteer
```

Alur render:
1. Buat Blade view `resources/views/certificates/template.blade.php`
2. Pass data: nama peserta, event, penandatangan, nomor sertifikat, QR Code (base64), background (base64)
3. Render ke PDF dengan orientasi landscape/portrait sesuai template
4. Simpan ke `storage/app/public/certificates/{nomor_sertifikat}.pdf`

> **Catatan:** Background sertifikat dan QR Code harus di-embed sebagai base64 agar bisa di-render oleh Puppeteer tanpa masalah path.

### 5.2 QR Code Generation

**Package:** `simplesoftwareio/simple-qrcode`

```bash
composer require simplesoftwareio/simple-qrcode
```

```php
$url = route('verify.check', $nomor_sertifikat);
$qrCode = QrCode::format('png')->size(200)->generate($url);
// Simpan file ke storage
Storage::put("public/qrcodes/{$nomor_sertifikat}.png", $qrCode);
```

### 5.3 Import Excel

**Package:** `maatwebsite/excel`

```bash
composer require maatwebsite/excel
```

Buat class `ParticipantImport`:
```php
class ParticipantImport implements ToModel, WithHeadingRow, WithValidation, SkipsOnFailure
{
    // Mapping kolom Excel ke field model
    // Validasi per baris
    // Skip baris yang gagal, kumpulkan failures untuk ditampilkan ke user
}
```

### 5.4 Pengiriman Email

**Menggunakan Laravel Mail + Queue:**

```bash
php artisan make:mail CertificateMail
```

Konten email:
- Subjek: `Sertifikat Anda — {nama_event}`
- Body: ucapan selamat, detail singkat
- Attachment: file PDF sertifikat
- Footer: link verifikasi

```php
// Dispatch ke queue agar tidak blocking
SendCertificateEmail::dispatch($certificate)->onQueue('emails');
```

Pastikan konfigurasi `.env`:
```
MAIL_MAILER=smtp
MAIL_HOST=...
MAIL_PORT=587
MAIL_USERNAME=...
MAIL_PASSWORD=...
MAIL_FROM_ADDRESS=noreply@sertifikatku.com
```

### 5.5 Activity Log

Buat helper atau service sederhana untuk mencatat aktivitas ke tabel `activity_logs`:

```
id           BIGINT PK AUTO
user_id      BIGINT FK → users.id NULLABLE
action       VARCHAR(255)   -- "generate_certificate", "revoke", "import", dll
description  TEXT
created_at
```

Panggil di controller:
```php
ActivityLog::create([
    'user_id'     => auth()->id(),
    'action'      => 'generate_certificate',
    'description' => "Generate 25 sertifikat untuk event Workshop Laravel 2026",
]);
```

---

## 6. Mengganti Dummy Data di Frontend

Setelah controller siap, ganti data hardcoded di file `.jsx` dengan props dari Inertia.

Contoh di `EventController@index`:
```php
return Inertia::render('Events/Index', [
    'events'  => Event::query()
        ->when(request('search'), fn($q, $s) => $q->where('nama', 'like', "%{$s}%"))
        ->when(request('status'), fn($q, $s) => $q->where('status', $s))
        ->latest()
        ->paginate(10),
    'filters' => request()->only(['search', 'status']),
]);
```

Di sisi React (`Events/Index.jsx`), props `events` dan `filters` sudah tersedia sebagai parameter komponen — **tidak perlu mengubah struktur komponen**, cukup hapus data dummy dan gunakan props.

---

## 7. Urutan Implementasi (Prioritas)

Kerjakan secara berurutan agar setiap fase bisa langsung ditest:

### Fase 1 — Fondasi Database
1. Buat semua migration file (events, templates, signers, participants, certificates, activity_logs)
2. `php artisan migrate`
3. Buat Model Eloquent + relasi
4. Buat Seeder + `php artisan db:seed`

### Fase 2 — CRUD Dasar
5. `EventController` — index, create, store, show, update, destroy
6. `TemplateController` — index, create, store, update, destroy
7. `ParticipantController` — index, store, update, destroy
8. `CertificateController@index` + `@show` — daftar & detail sertifikat

### Fase 3 — Halaman Form & Preview
9. `ParticipantController@importPage` + `@import` + `@downloadTemplate`
10. `CertificateController@generatePage` — render halaman dengan daftar event & template
11. `CertificateController@previewPage` — render halaman preview dengan data template & signer

### Fase 4 — Fitur Generate & Revoke
12. `CertificateController@generate` — generate massal + QR Code + PDF
13. `CertificateController@download` — stream file PDF
14. `CertificateController@revoke` — ubah status + activity log

### Fase 5 — Email & Verifikasi
15. `VerifyController@index` + `@check` — halaman publik + cek JSON
16. Setup Laravel Mail + `SendCertificateEmail` job
17. `CertificateController@sendEmail`

### Fase 6 — Dashboard & Polish
18. `DashboardController@index` — stat cards + chart data dari DB nyata
19. `ProfileController` — edit, update, destroy (cek apakah Breeze sudah cukup atau perlu kustomisasi)
20. Activity Log integration di semua controller
21. Validasi edge case: hapus event dengan sertifikat aktif, dll.

---

## 8. Package yang Perlu Diinstall

```bash
# PDF Generation
composer require spatie/browsershot
npm install puppeteer

# QR Code
composer require simplesoftwareio/simple-qrcode

# Excel Import
composer require maatwebsite/excel

# (Opsional) Storage link sudah ada di Laravel default
php artisan storage:link
```

---

## 9. Keamanan & Validasi

| Aspek | Implementasi |
|---|---|
| Autentikasi | Semua route `/dashboard`, `/events`, `/templates`, `/participants`, `/certificates` wajib `auth` middleware |
| Otorisasi | Gunakan `Policy` atau cek `user_id` di controller agar user hanya bisa akses datanya sendiri |
| Upload file | Validasi MIME type + ukuran; simpan ke `storage` bukan `public/` langsung |
| Nomor sertifikat | Generate di dalam DB transaction untuk hindari race condition |
| Rate limiting | Tambahkan `throttle:60,1` pada route verifikasi publik |
| XSS | Inertia sudah handle escaping, tetap gunakan `e()` helper jika output ke Blade |

---

## 10. Testing

### Manual Testing Checklist
- [ ] Login / logout berhasil
- [ ] Halaman `/profile` tampil data user, update nama/email berhasil, hapus akun redirect ke login
- [ ] CRUD event: tambah (via `/events/create`), edit modal, hapus, detail modal tampil jumlah peserta & sertifikat
- [ ] CRUD template: halaman `/templates/create` load dropdown events, upload background, tambah 1–4 signer
- [ ] CRUD peserta: tambah manual, halaman `/participants/import` load dropdown events, import Excel (valid + file invalid)
- [ ] Download template Excel kosong dari `/participants/import/template`
- [ ] Halaman `/certificates/generate` load daftar event + template, generate sertifikat massal
- [ ] Halaman `/certificates/preview` toggle orientasi landscape/portrait + jumlah signer 1–4 tampil benar
- [ ] Modal detail sertifikat tampil data lengkap dari `GET /certificates/{id}`
- [ ] Download PDF dari `/certificates/{id}/download`
- [ ] Revoke sertifikat → status badge berubah merah
- [ ] Kirim email → email masuk dengan attachment PDF
- [ ] Scan QR Code → redirect ke `/verify` dan tampil data valid
- [ ] Cek sertifikat dicabut di `/verify` → tampil status "Dicabut"
- [ ] Dashboard: angka stat cards sesuai data DB, chart bar tampil per bulan
- [ ] Hapus event yang punya sertifikat aktif → muncul error konfirmasi

---

## 11. Referensi

| Sumber | URL |
|---|---|
| Laravel 11 Docs | https://laravel.com/docs |
| Inertia.js Docs | https://inertiajs.com |
| Spatie Browsershot | https://github.com/spatie/browsershot |
| Laravel Excel | https://laravel-excel.com |
| Simple QrCode | https://github.com/SimpleSoftwareIO/simple-qrcode |
| Repository Project | https://github.com/AbdulAzis07/SertifikatKu |

---

*PRD ini dibuat berdasarkan rangkuman project tertanggal 13 Juni 2026. Frontend sudah selesai — jangan ubah struktur komponen React, hanya ganti sumber data dari dummy ke Inertia props.*
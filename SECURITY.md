# Panduan Keamanan Lokal & Sebelum Publish (GitHub Pages)

Dokumen ini merangkum pengamanan yang sudah dipasang di web portofolio ini serta hal yang perlu dicek sebelum di-push ke GitHub.

## 1. Pengamanan yang Sudah Aktif di Kode
- **Content Security Policy (CSP):** Memblokir injeksi script asing, inline script (`onerror`, `onclick`, `javascript:`), `<object>`, dan pembajakan `base-uri`.
- **Anti-XSS & Validasi URL:** Seluruh teks dari `js/data.js` di-escape sebelum masuk ke HTML, dan semua tautan luar divalidasi wajib `https://`.
- **Proteksi Nomor WhatsApp (Anti-Scraper & Anti-Bot):**
  - Nomor telepon **tidak disimpan** dalam bentuk angka polos maupun Base64 di kode sumber ataupun elemen HTML.
  - Nomor disimpan sebagai byte XOR di `js/data.js` dan baru dirakit saat pengunjung manusia (`event.isTrusted`) menekan tombol **Lanjut ke WhatsApp** pada dialog konfirmasi.
  - Jika suatu saat ingin mematikan tombol WhatsApp sepenuhnya, cukup ubah `enableWhatsApp: false` di `js/data.js`.
- **Isolasi Live Preview (`iframe sandbox`):** Hanya mengizinkan domain proyek `abdulfattah105-ne.github.io` dengan `sandbox` dan `referrerpolicy="no-referrer"`.
- **Proteksi Tab Baru (`noopener noreferrer`):** Semua tautan eksternal mencegah *reverse tabnabbing*.
- **Anti-Clickjacking:** Mencegah halaman portofolio dibungkus `iframe` oleh situs phishing di internet.
- **`.gitignore` & Privasi Git Lokal:**
  - Folder `/tools/` dan file rahasia (`.env`, `*.key`, dll.) dikecualikan agar tidak ikut ter-upload.
  - Email commit Git lokal di folder ini sudah disetel ke alamat privat `230107985+AbdulFattah105-NE@users.noreply.github.com` agar Gmail pribadi tidak bocor di riwayat commit publik.

## 2. Checklist Sebelum Push ke GitHub Nanti
1. Buka **GitHub → Settings → Emails**, pastikan **"Keep my email addresses private"** dan **"Block command line pushes that expose my email"** sudah dicentang.
2. Cek `git status` dan `git log -1` untuk memastikan email author adalah `@users.noreply.github.com` dan tidak ada file sensitif yang ikut masuk.
3. Untuk mengganti nomor WhatsApp secara offline di masa depan:
   ```powershell
   powershell -ExecutionPolicy Bypass -File tools\encode-wa.ps1 628xxxxxxxxxx
   ```

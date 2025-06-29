
# Fundasi - Aplikasi Crowd Funding Berbasis Web 3

**Fundasi** adalah aplikasi crowd funding berbasis Web 3 yang bertujuan untuk membantu UMKM (Usaha Mikro, Kecil, dan Menengah) melalui pembelian NFT mereka. Dalam aplikasi ini, pengguna dapat membeli NFT yang diterbitkan oleh UMKM dan mendapatkan reward sebagai bentuk apresiasi. Aplikasi ini memanfaatkan teknologi blockchain dan konsep NFT untuk memberikan dukungan kepada UMKM dengan cara yang inovatif dan transparan.

## Prasyarat

Sebelum memulai, pastikan Anda telah menginstal hal-hal berikut:
- [Node.js](https://nodejs.org/)
- [DFX](https://internetcomputer.org/docs/current/developer-docs/setup/install)
- [Mop](https://mop.readthedocs.io/)

## Langkah-langkah

### 1. Menyiapkan Proyek

1. Clone repositori ini dan buka folder root proyek (`Fundasi/`).

   ```bash
   cd Fundasi/
   ```

2. Install dependensi proyek dengan menjalankan perintah:

   ```bash
   npm install
   ```

3. Install Mop secara global:

   ```bash
   npm install -g mop
   ```

4. Tambahkan paket `icrc37-mo` menggunakan Mop:

   ```bash
   mop add icrc37-mo
   ```

5. Download file yang dibutuhkan `ledger.did` dan `ic-icrc1-ledger.wasm.gz` dari tautan berikut:
   [Download Ledger Files](https://github.com/dfinity/ic/releases?q=%22ledger-suite-icrc%22&expanded=false)

6. Letakkan file-file tersebut di direktori yang sesuai dalam proyek Anda.

### 2. Setup ICRC1 Ledger

1. Arahkan ke direktori `src/Fundasi_frontend`:

   ```bash
   cd src/Fundasi_frontend
   ```

2. Install dependensi frontend:

   ```bash
   npm install
   ```

### 3. Deploy ke Playground (Opsional)

Jika Anda ingin melakukan deploy ke lingkungan `playground`, jalankan perintah berikut:

```bash
dfx deploy --playground
```

### 4. Konfigurasi ICRC1 Ledger

Pada konfigurasi `icrc1_ledger`, atur parameter berikut:

- **owner**: Principal canister backend/admin
- **token_fee**: `1000`
- **controller**: Principal canister backend/admin
- **initial_fee**: Pilih bebas jika diperlukan
- **num_to_block_archive**: `1000`
- **threshold**: `2000`

### 5. Konfigurasi Candid UI Backend

#### 5.1. Setup `initConfig`

Pada backend `candid UI`, atur konfigurasi berikut:

- **adminPrincipal**: Principal sesuai dengan owner konfigurasi `icrc1_ledger`
- **tokenCanister**: Canister ID dari `icrc1_ledger`

#### 5.2. Inisialisasi Canisters

- Panggil `initCanister`.
- Panggil `initIcrc37`.

### 6. Pengembangan Frontend

1. Setelah backend dan canister dikonfigurasi, lanjutkan dengan bagian frontend.

2. Mulai pengembangan frontend dengan menjalankan:

   ```bash
   npm start
   ```

   Ini akan memulai server pengembangan frontend di `http://localhost:8080`, yang akan mem-proxy permintaan API ke backend yang berjalan di `http://localhost:4943`.

## Catatan Tambahan

- Jika Anda melakukan perubahan pada backend dan perlu menghasilkan ulang antarmuka candid, jalankan perintah berikut:

  ```bash
  npm run generate
  ```

- Untuk frontend, pastikan Anda mengatur variabel lingkungan yang benar untuk target deploy. Misalnya, jika Anda menggunakan Webpack, Anda mungkin perlu mengatur `DFX_NETWORK` ke `ic`.

### Tautan Berguna

- [Panduan Quick Start Internet Computer](https://internetcomputer.org/docs/current/developer-docs/setup/deploy-locally)
- [Panduan Bahasa Pemrograman Motoko](https://internetcomputer.org/docs/current/motoko/main/motoko)
- [Dokumentasi ICRC37](https://github.com/dfinity/ic/releases?q=%22ledger-suite-icrc%22&expanded=false)

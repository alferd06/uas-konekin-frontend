// src/config.js

// 1. Baca variabel dari environment (.env atau Vercel)
const API_URL = import.meta.env.VITE_API_BASE_URL;

// 2. (PENTING) Berikan nilai default jika variabel tidak ditemukan
//    Ini bagus untuk debugging jika Anda lupa mengatur .env
if (!API_URL) {
  console.warn(
    "VITE_API_BASE_URL tidak diatur. Menggunakan http://localhost:3001 sebagai default."
  );
}

// 3. Ekspor variabel yang sudah bersih (dengan fallback)
export const API_BASE_URL = API_URL || 'http://localhost:3001';
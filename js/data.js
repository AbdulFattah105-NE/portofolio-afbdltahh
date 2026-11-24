/* =========================================================
   DATA PORTOFOLIO — edit di sini untuk menambah / mengubah isi
   ========================================================= */
(() => {
  const freezeDeep = (obj) => {
    if (obj && typeof obj === "object") {
      Object.freeze(obj);
      Object.values(obj).forEach(freezeDeep);
    }
    return obj;
  };

  window.PROFILE = freezeDeep({
    name: "Abdul Fattah",
    github: "https://github.com/abdulfattah105-ne",
    campus: "https://portofolio.politeknikidn.id/mahasiswa/nrahigyWVw",

    // Keamanan Nomor WhatsApp:
    // - Set enableWhatsApp: false jika tidak ingin menampilkan tombol WA di publik sama sekali.
    // - Nomor TIDAK disimpan sebagai teks/angka polos maupun Base64 agar kebal bot scraper.
    // - waBytes adalah hasil XOR tiap karakter nomor internasional dengan waKey (90).
    // - Untuk mengganti nomor secara lokal: jalankan `powershell -ExecutionPolicy Bypass -File tools\encode-wa.ps1 628xxxxxxxxxx`
    enableWhatsApp: true,
    waKey: 90,
    waBytes: [108, 104, 98, 99, 111, 105, 104, 107, 106, 109, 108, 110, 106, 111],
  });

  /*  category: dipakai untuk filter -> "linkhub" | "website" | "kampus"
      embed   : false jika situs tidak mengizinkan iframe               */
  window.PROJECTS = freezeDeep([
    {
      id: "jurusan",
      title: "3 Jurusan di Politeknik IDN",
      type: "Website Kampus",
      desc: "Halaman pemilihan jurusan interaktif — TRMG (Designer), TRPL (Programmer), dan TRKJ (Engineer) lengkap dengan kurikulum, skill utama, dan prospek karier.",
      url: "https://abdulfattah105-ne.github.io/3-jurusan-Di-Politeknik-IDN-Bogor/",
      tags: ["Landing Page", "Interaktif", "Edukasi"],
      category: ["website", "kampus"],
      emoji: "🎓",
      hue: 262,
      featured: true,
    },
    {
      id: "pmb",
      title: "Hub Link PMB Politeknik IDN",
      type: "Redesign Link Hub",
      desc: "Satu pintu informasi Penerimaan Mahasiswa Baru: website PMB, brosur & biaya, chat admin, portofolio mahasiswa, podcast, akreditasi, hingga lokasi kampus.",
      url: "https://abdulfattah105-ne.github.io/hub-link-sum-info-pmb-idn/",
      tags: ["Link Hub", "Redesign", "PMB"],
      category: ["linkhub", "kampus"],
      emoji: "🏛️",
      hue: 200,
    },
    {
      id: "alwafa",
      title: "Pesantren BS Al-Wafa Setu Bekasi",
      type: "Redesign Link Hub",
      desc: "Hub link resmi SPMB untuk SMP & MA Boarding School — brosur, WhatsApp, email, dan program unggulan Tahfizh Al-Qur'an & Bahasa Arab.",
      url: "https://abdulfattah105-ne.github.io/alwafa-web/",
      tags: ["Link Hub", "Pesantren", "SPMB"],
      category: ["linkhub"],
      emoji: "🌿",
      hue: 152,
    },
    {
      id: "sdit",
      title: "SDIT Menara Kuwait",
      type: "Redesign Link Hub + Website",
      desc: "Portal resmi & link hub sekolah: profil kepala sekolah, program & 12 ekskul, galeri kegiatan, kontak & peta, serta pra-pendaftaran SPMB 2027/2028.",
      url: "https://abdulfattah105-ne.github.io/sdit-menara-kuwait-web/",
      tags: ["Link Hub", "Multi-section", "Sekolah"],
      category: ["linkhub", "website"],
      emoji: "🕌",
      hue: 38,
      featured: true,
    },
    {
      id: "bantu",
      title: "Bantu Rekomendasiin",
      type: "Link Hub Affiliate",
      desc: "Link hub rekomendasi gadget & laptop pilihan (sayabantucariinanda) dengan filter berdasarkan nama toko atau produk agar mudah dicari.",
      url: "https://abdulfattah105-ne.github.io/sayabantucariinanda/",
      tags: ["Link Hub", "Filter", "E-commerce"],
      category: ["linkhub"],
      emoji: "🛍️",
      hue: 330,
    },
    {
      id: "poltek",
      title: "Portofolio 1 Tahun Belajar TRKJ",
      type: "IDN Showcase · Terverifikasi",
      desc: "Rangkuman satu tahun belajar di jurusan TRKJ (2024–2025), terverifikasi resmi di platform IDN Showcase Politeknik IDN Bogor.",
      url: "https://portofolio.politeknikidn.id/mahasiswa/nrahigyWVw",
      tags: ["TRKJ", "Terverifikasi", "137 Views"],
      category: ["kampus"],
      emoji: "🏅",
      hue: 220,
      embed: false,
      featured: true,
    },
  ]);
})();

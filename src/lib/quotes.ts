// Sistem Quotes Harian Deterministic Berdasarkan Tanggal Asia/Jakarta (WIB)

export interface DailyQuote {
  id: number;
  text: string;
  author: string;
  theme: 'kebersamaan' | 'keuangan' | 'disiplin' | 'semangat' | 'persahabatan';
}

export const DAILY_QUOTES: DailyQuote[] = [
  {
    id: 1,
    text: 'Sedikit demi sedikit, lama-lama menjadi bukit.',
    author: 'Pepatah Nusantara',
    theme: 'keuangan',
  },
  {
    id: 2,
    text: 'Disiplin kecil hari ini dapat menghasilkan perubahan besar di masa depan.',
    author: 'Refleksi Keuangan',
    theme: 'disiplin',
  },
  {
    id: 3,
    text: 'Bersama kita lebih kuat, bersama kita bisa melangkah lebih jauh.',
    author: 'Prinsip Kebersamaan',
    theme: 'kebersamaan',
  },
  {
    id: 4,
    text: 'Mengelola uang dengan baik adalah langkah kecil menuju masa depan yang lebih tertata.',
    author: 'Prinsip Money Gong',
    theme: 'keuangan',
  },
  {
    id: 5,
    text: 'Keberhasilan suatu kelompok lahir dari keterbukaan, kepercayaan, dan komitmen bersama.',
    author: 'Semangat Kompak',
    theme: 'persahabatan',
  },
  {
    id: 6,
    text: 'Bukan seberapa banyak yang kita kumpulkan, melainkan seberapa konsisten kita menjaganya.',
    author: 'Kearifan Kas',
    theme: 'keuangan',
  },
  {
    id: 7,
    text: 'Sahabat sejati adalah mereka yang saling menguatkan di kala susah dan menjaga amanah di kala lapang.',
    author: 'Nilai Sahabat',
    theme: 'persahabatan',
  },
  {
    id: 8,
    text: 'Rencana tanpa tindakan hanyalah angan-angan; tindakan terencana membawa keberhasilan nyata.',
    author: 'Manajemen Kegiatan',
    theme: 'semangat',
  },
  {
    id: 9,
    text: 'Kekompakan tidak terjadi secara kebetulan, melainkan dibangun melalui rasa saling percaya setiap hari.',
    author: 'Kekompakan Tim',
    theme: 'kebersamaan',
  },
  {
    id: 10,
    text: 'Setiap rupiah yang dikelola dengan amanah adalah wujud tanggung jawab dan kepedulian terhadap sesama.',
    author: 'Etika Finansial',
    theme: 'keuangan',
  },
  {
    id: 11,
    text: 'Jangan menunggu kaya untuk mulai menabung, tapi mulailah menabung agar hidup lebih tenang dan siap.',
    author: 'Nasihat Bijak',
    theme: 'keuangan',
  },
  {
    id: 12,
    text: 'Persahabatan yang dilandasi kejujuran dan saling mendukung akan bertahan melintasi waktu.',
    author: 'Persahabatan Sejati',
    theme: 'persahabatan',
  },
  {
    id: 13,
    text: 'Kerja keras mengalahkan bakat ketika bakat tidak diiringi dengan kerja keras.',
    author: 'Etos Kerja',
    theme: 'semangat',
  },
  {
    id: 14,
    text: 'Belajar dari masa lalu, bersyukur untuk hari ini, dan merencanakan masa depan dengan penuh keyakinan.',
    author: 'Refleksi Diri',
    theme: 'semangat',
  },
  {
    id: 15,
    text: 'Transparansi adalah jembatan paling kokoh dalam menjaga keharmonisan dan kerukunan kelompok.',
    author: 'Tata Kelola Kas',
    theme: 'kebersamaan',
  },
  {
    id: 16,
    text: 'Satu langkah kecil yang konsisten lebih berharga daripada seribu niat besar yang tak pernah dimulai.',
    author: 'Disiplin Harian',
    theme: 'disiplin',
  },
  {
    id: 17,
    text: 'Ketika hati saling terpaut dalam niat yang baik, jalan keluar akan selalu hadir di setiap tantangan.',
    author: 'Semangat Kelompok',
    theme: 'kebersamaan',
  },
  {
    id: 18,
    text: 'Uang yang diatur dengan tertib menjadi pelayan setia; uang tanpa pengelolaan menjadi tuan yang merepotkan.',
    author: 'Kebijaksanaan Finansial',
    theme: 'keuangan',
  },
  {
    id: 19,
    text: 'Bahu-membahu meringankan beban, gotong-royong melipatgandakan kebahagiaan.',
    author: 'Falsafah Gotong Royong',
    theme: 'kebersamaan',
  },
  {
    id: 20,
    text: 'Ketekunan mengubah hal yang tidak mungkin menjadi kenyataan yang membanggakan.',
    author: 'Ketekunan Hidup',
    theme: 'semangat',
  },
  {
    id: 21,
    text: 'Catatan keuangan yang rapi adalah cermin dari ketelitian, kejujuran, dan niat baik bersama.',
    author: 'Pembukuan Kas',
    theme: 'disiplin',
  },
  {
    id: 22,
    text: 'Perjalanan ribuan mil selalu dimulai dari satu langkah pertama yang penuh keberanian.',
    author: 'Lao Tzu',
    theme: 'semangat',
  },
  {
    id: 23,
    text: 'Bukan sekadar kumpul bersama, tapi saling menjaga dan saling memajukan satu sama lain.',
    author: 'Keluarga Money Gong',
    theme: 'persahabatan',
  },
  {
    id: 24,
    text: 'Hemat bukan berarti pelit, melainkan cermat menentukan prioritas demi tujuan bersama yang lebih tinggi.',
    author: 'Pola Pikir Cerdas',
    theme: 'keuangan',
  },
  {
    id: 25,
    text: 'Kesuksesan sejati adalah saat kita bisa meraih impian bersama tanpa meninggalkan seorang pun di belakang.',
    author: 'Solidaritas Tim',
    theme: 'kebersamaan',
  },
  {
    id: 26,
    text: 'Belajar adalah harta yang akan selalu mengikuti pemiliknya ke mana pun ia melangkah.',
    author: 'Pepatah Pembelajar',
    theme: 'semangat',
  },
  {
    id: 27,
    text: 'Menjaga amanah kecil adalah kunci dibukanya pintu-pintu kepercayaan yang jauh lebih besar.',
    author: 'Integritas Kas',
    theme: 'disiplin',
  },
  {
    id: 28,
    text: 'Masa depan yang cerah dipersiapkan oleh tangan-tangan yang rajin dan pikiran yang visioner hari ini.',
    author: 'Visi Masa Depan',
    theme: 'semangat',
  },
  {
    id: 29,
    text: 'Satu tujuan, satu langkah, satu irama—itulah kekuatan kelompok yang tak tergoyahkan.',
    author: 'Gong Kebersamaan',
    theme: 'kebersamaan',
  },
  {
    id: 30,
    text: 'Waktu dan uang memiliki kesamaan: jika tidak direncanakan dengan bijak, keduanya akan hilang tanpa bekas.',
    author: 'Manajemen Waktu & Uang',
    theme: 'keuangan',
  },
  {
    id: 31,
    text: 'Persahabatan seumpama benih pohon rindang; dirawat dengan ketulusan, bertumbuh menyejukkan semua.',
    author: 'Pohon Persahabatan',
    theme: 'persahabatan',
  },
  {
    id: 32,
    text: 'Kebiasaan baik hari ini adalah investasi terbaik yang tidak akan pernah mengalami penyusutan.',
    author: 'Investasi Karakter',
    theme: 'disiplin',
  },
  {
    id: 33,
    text: 'Dalam setiap perbedaan pendapat, selalu ada ruang untuk saling memahami dan mencari solusi terbaik.',
    author: 'Musyawarah Mufakat',
    theme: 'kebersamaan',
  },
  {
    id: 34,
    text: 'Tabungan kelompok bukan sekadar angka di pembukuan, melainkan bukti nyata kepedulian antar sesama.',
    author: 'Amanah Kas',
    theme: 'keuangan',
  },
  {
    id: 35,
    text: 'Hari ini adalah lembaran baru; isilah dengan karya terbaik dan kebaikan yang tulus.',
    author: 'Semangat Pagi',
    theme: 'semangat',
  },
];

/**
 * Mendapatkan tanggal kalender spesifik zona waktu Asia/Jakarta (WIB).
 * Mengembalikan objek berisi tahun, bulan (1-12), hari, dan string tanggal terformat.
 */
export function getWibDateInfo(): {
  year: number;
  month: number;
  day: number;
  formattedIndo: string;
  daysSinceEpoch: number;
} {
  // Format waktu sesuai zona waktu Asia/Jakarta
  const now = new Date();
  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  };

  const formatter = new Intl.DateTimeFormat('en-CA', options); // returns YYYY-MM-DD
  const parts = formatter.format(now).split('-');
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);

  // Menghitung jumlah hari sejak tanggal referensi tetap (1 Januari 2026 UTC)
  const refDateUtc = Date.UTC(2026, 0, 1);
  const targetDateUtc = Date.UTC(year, month - 1, day);
  const daysSinceEpoch = Math.floor((targetDateUtc - refDateUtc) / (1000 * 60 * 60 * 24));

  const monthNames = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
  ];

  const formattedIndo = `${day} ${monthNames[month - 1]} ${year}`;

  return {
    year,
    month,
    day,
    formattedIndo,
    daysSinceEpoch: Math.abs(daysSinceEpoch),
  };
}

/**
 * Mendapatkan quote harian deterministik untuk hari ini berdasarkan WIB.
 * Quotes akan tetap sama selama hari tersebut meskipun halaman di-refresh,
 * dibuka dari HP lain, dan otomatis berganti saat hari berikutnya tiba.
 */
export function getDailyQuote(): { quote: DailyQuote; formattedDate: string } {
  const { formattedIndo, daysSinceEpoch } = getWibDateInfo();
  const quoteIndex = daysSinceEpoch % DAILY_QUOTES.length;
  return {
    quote: DAILY_QUOTES[quoteIndex],
    formattedDate: formattedIndo,
  };
}

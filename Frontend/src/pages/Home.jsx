import CardGrid from "../components/CardGrid";
import Hero from "../components/Hero";

function Home({ features }) {
  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Hero Section */}
      <Hero />

      {/* Features Showcase Section */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-800">
            Fitur Unggulan
          </span>
          <h2 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Kenapa Memilih BrandKu?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600">
            Kami hadirkan berbagai kemudahan dan otomatisasi untuk mendukung pertumbuhan bisnis Anda lebih cepat dan efisien.
          </p>
        </div>

        {/* Card Grid Feature */}
        <CardGrid data={features} />

        {/* Quick CTA Banner */}
        <div className="mt-16 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 p-8 sm:p-12 text-center text-white shadow-xl">
          <h3 className="text-2xl font-bold sm:text-3xl">
            Siap Mengembangkan Usaha Anda Hari Ini?
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-emerald-100 text-sm sm:text-base">
            Jelajahi produk-produk pilihan di toko kami atau mulai kelola katalog produk Anda langsung dari dashboard toko.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <a
              href="/shop"
              className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-emerald-700 shadow hover:bg-emerald-50 transition"
            >
              Kunjungi Toko Sekarang →
            </a>
            <a
              href="/about"
              className="rounded-xl border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
            >
              Pelajari Lebih Lanjut
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;

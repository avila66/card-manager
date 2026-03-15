import Image from "next/image";

export default function Home() {
  const collections = [
    "Favoritos",
    "Wishlist",
    "Eliminar",
    "Pokémon TCG",
    "Topps",
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b0b0b] text-[#eafaff]">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -top-16 right-1/3 h-72 w-72 rounded-full bg-[#00c0f0]/25 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-[#00b0f0]/20 blur-3xl" />
        <div className="absolute inset-0 [background:radial-gradient(circle_at_20%_20%,rgba(0,208,240,0.16),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(0,176,240,0.12),transparent_35%),radial-gradient(circle_at_50%_80%,rgba(0,192,240,0.14),transparent_40%)]" />
      </div>

      <main className="relative mx-auto grid min-h-screen w-full max-w-[1300px] grid-cols-1 gap-4 px-4 py-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-6 lg:py-6">
        <aside className="rounded-3xl border border-[#00c0f0]/20 bg-[#151515]/95 p-5 shadow-[0_25px_70px_-50px_rgba(0,192,240,0.45)] backdrop-blur">
          <div className="mb-8 flex items-center gap-3">
            <Image
              src="/CMLogo.jpg"
              alt="Card Manager"
              width={54}
              height={54}
              priority
              className="rounded-xl border border-[#00c0f0]/35"
            />
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#7edfff]">Card Manager</p>
              <h1 className="font-[family-name:var(--font-geist-mono)] text-lg font-bold text-white">
                Panel de control
              </h1>
            </div>
          </div>

          <nav className="space-y-2 text-sm">
            <button className="w-full rounded-2xl border border-[#00d0f0]/60 bg-gradient-to-r from-[#00d0f0]/30 to-[#00b0f0]/20 px-3 py-2 text-left text-sm font-semibold text-[#dff7ff] shadow-[0_10px_26px_-14px_rgba(0,208,240,0.9)] transition duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#78e4ff]/70">
              Inicio
            </button>
            <button className="w-full rounded-2xl border border-[#00c0f0]/12 bg-[#1b1b1b] px-3 py-2 text-left text-sm font-semibold text-[#d8edf2] transition duration-200 hover:-translate-y-0.5 hover:border-[#00d0f0]/50 hover:bg-[#00c0f0]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#78e4ff]/70">
              Coleccion
            </button>
            <button className="w-full rounded-2xl border border-[#00c0f0]/12 bg-[#1b1b1b] px-3 py-2 text-left text-sm font-semibold text-[#d8edf2] transition duration-200 hover:-translate-y-0.5 hover:border-[#00d0f0]/50 hover:bg-[#00c0f0]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#78e4ff]/70">
              Añadir carta
            </button>
            <button className="w-full rounded-2xl border border-[#00c0f0]/12 bg-[#1b1b1b] px-3 py-2 text-left text-sm font-semibold text-[#d8edf2] transition duration-200 hover:-translate-y-0.5 hover:border-[#00d0f0]/50 hover:bg-[#00c0f0]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#78e4ff]/70">
              Eliminar carta
            </button>
          </nav>

          <div className="mt-8 rounded-2xl border border-[#00c0f0]/25 bg-[#101010] p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-[#79dbff]">Total cartas</p>
            <p className="mt-2 font-[family-name:var(--font-geist-mono)] text-4xl font-bold text-white">0</p>
          </div>

        </aside>
 
        <section className="space-y-4">
          <div className="rounded-3xl border border-[#00c0f0]/25 bg-[#181818]/95 p-5">
            <h3 className="mb-4 font-[family-name:var(--font-geist-mono)] text-lg font-bold text-white">
              Gestion de cartas
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <button className="rounded-2xl border border-[#00d0f0]/55 bg-gradient-to-r from-[#00d0f0]/25 to-[#00b0f0]/20 px-4 py-4 text-left font-bold text-[#dff7ff] transition hover:-translate-y-0.5 hover:border-[#00d0f0]/80">
                Añadir carta
              </button>
              <button className="rounded-2xl border border-[#00c0f0]/35 bg-[#101010] px-4 py-4 text-left font-bold text-[#c8f2ff] transition hover:-translate-y-0.5 hover:border-[#00d0f0]/65 hover:bg-[#00c0f0]/10">
                Eliminar carta
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-[#00c0f0]/25 bg-[#181818]/95 p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="font-[family-name:var(--font-geist-mono)] text-lg font-bold text-white">
                Colecciones
              </h3>
              <button className="rounded-2xl border border-[#00d0f0]/55 bg-gradient-to-r from-[#00d0f0]/25 to-[#00b0f0]/20 px-4 py-2 text-sm font-bold text-[#dff7ff] transition hover:-translate-y-0.5 hover:border-[#00d0f0]/80">
                Añadir colección
              </button>
            </div>
            
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {collections.map((collection) => (
                <div key={collection} className="rounded-2xl border border-[#00c0f0]/20 bg-[#101010] p-4">
                  <p className="text-sm font-semibold text-[#e4f8ff]">{collection}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

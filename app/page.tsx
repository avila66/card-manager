import Image from "next/image";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-900 text-zinc-100">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -top-16 right-1/3 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-white/4 blur-3xl" />
        <div className="absolute inset-0 [background:radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.06),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.04),transparent_35%),radial-gradient(circle_at_50%_80%,rgba(255,255,255,0.05),transparent_40%)]" />
      </div>

      <main className="relative mx-auto grid min-h-screen w-full max-w-[1300px] grid-cols-1 gap-4 px-4 py-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-6 lg:py-6">
        <aside className="rounded-3xl border border-zinc-700 bg-zinc-950/95 p-5 shadow-[0_25px_70px_-50px_rgba(255,255,255,0.12)] backdrop-blur">
          <div className="mb-8 flex items-center gap-3">
            <Image
              src="/CMLogo.jpg"
              alt="Card Manager"
              width={54}
              height={54}
              priority
              className="rounded-xl border border-zinc-600"
            />
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-400">Card Manager</p>
              <h1 className="font-[family-name:var(--font-geist-mono)] text-lg font-bold text-white">
                Panel de control
              </h1>
            </div>
          </div>

          <nav className="space-y-2 text-sm">
            <button className="w-full rounded-2xl border border-zinc-500 bg-zinc-900 px-3 py-2 text-left text-sm font-semibold text-zinc-100 shadow-[0_10px_26px_-14px_rgba(255,255,255,0.18)] transition duration-200 hover:-translate-y-0.5 hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500/70">
              Inicio
            </button>
            <button className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-left text-sm font-semibold text-zinc-200 transition duration-200 hover:-translate-y-0.5 hover:border-zinc-500 hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500/70">
              Coleccion
            </button>
            <button className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-left text-sm font-semibold text-zinc-200 transition duration-200 hover:-translate-y-0.5 hover:border-zinc-500 hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500/70">
              Añadir carta
            </button>
            <button className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-left text-sm font-semibold text-zinc-200 transition duration-200 hover:-translate-y-0.5 hover:border-zinc-500 hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500/70">
              Eliminar carta
            </button>
          </nav>

          <div className="mt-8 rounded-2xl border border-zinc-700 bg-zinc-900 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">Total cartas</p>
            <p className="mt-2 font-[family-name:var(--font-geist-mono)] text-4xl font-bold text-white">0</p>
          </div>

          <div className="mt-4 rounded-2xl border border-zinc-700 bg-zinc-900 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">Última carta añadida</p>
            <p className="mt-2 font-[family-name:var(--font-geist-mono)] text-4xl font-bold text-white">N/A</p>
          </div>

        </aside>
 
        <section className="space-y-4">
          <div className="rounded-3xl border border-zinc-700 bg-zinc-950/95 p-5">
            <h3 className="font-[family-name:var(--font-geist-mono)] text-lg font-bold text-white">
              Bienvenido a Card Manager!
            </h3>
            <p className="mt-2 text-sm text-zinc-300">
              Con Card Manager, puedes registrar tus colecciones y cartas de una forma cómoda y digital. Organiza tu inventario, controla cambios y mantente al día con tus sets favoritos. ¡Empieza a construir tu colección hoy mismo! Puedes empezar a navegar con la barra de navegación en la parte superior, o usar los botones rapidos para añadir o eliminar cartas.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

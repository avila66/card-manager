import Image from "next/image";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#1d1d1d] text-zinc-100">
      <main className="relative mx-auto w-full max-w-7xl px-6 py-8 sm:px-10 lg:px-14">
        <header className="mb-8 rounded-3xl border border-cyan-300/20 bg-[#262626] p-5 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.75)] sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Image
                src="/CMLogo.jpg"
                alt="Card Manager Logo"
                width={66}
                height={66}
                priority
                className="rounded-2xl border border-cyan-200/25"
              />
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">
                  Card collection workspace
                </p>
                <h1 className="text-3xl font-extrabold leading-tight text-zinc-100">
                  Card Manager 0.1.0
                </h1>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href="https://tcg.pokemon.com/es-es/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-cyan-300/35 bg-cyan-300/15 px-4 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/25"
              >
                TCG Pokemon
              </a>
              <a
                href="https://es.topps.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-amber-300/35 bg-amber-300/10 px-4 text-sm font-semibold text-amber-100 transition hover:bg-amber-300/20"
              >
                Topps
              </a>
            </div>
          </div>
        </header>

        <section className="mb-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <article className="rounded-3xl border border-cyan-300/20 bg-[#242424] p-6 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.75)] sm:p-8">
            <p className="mb-3 text-xs uppercase tracking-[0.22em] text-cyan-300">
              Centro de gestion
            </p>
            <h2 className="max-w-3xl text-4xl font-black leading-tight text-zinc-100 sm:text-5xl">
              Registra tu coleccion, controla cambios y organiza cada carta por set.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
              Esta portada funciona como sala de mando: acceso rapido a tareas,
              resumen de estado y ultimas acciones para mantener tu inventario
              siempre actualizado.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <button
                type="button"
                className="h-12 rounded-xl border border-emerald-300/35 bg-emerald-300/10 text-sm font-bold text-emerald-100 transition hover:bg-emerald-300/20"
              >
                Anadir carta
              </button>
              <button
                type="button"
                className="h-12 rounded-xl border border-amber-300/35 bg-amber-300/10 text-sm font-bold text-amber-100 transition hover:bg-amber-300/20"
              >
                Editar carta
              </button>
              <button
                type="button"
                className="h-12 rounded-xl border border-rose-300/35 bg-rose-300/10 text-sm font-bold text-rose-100 transition hover:bg-rose-300/20"
              >
                Eliminar carta
              </button>
            </div>
          </article>

          <aside className="rounded-3xl border border-cyan-300/20 bg-[#242424] p-6 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.75)]">
            <p className="mb-4 text-xs uppercase tracking-[0.22em] text-cyan-300">
              Estado actual
            </p>
            <div className="space-y-3">
              <div className="rounded-xl border border-cyan-300/25 bg-cyan-300/10 p-4">
                <p className="text-xs text-cyan-200">Cartas totales</p>
                <p className="text-3xl font-black text-zinc-100">124</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-emerald-300/35 bg-emerald-300/10 p-4">
                  <p className="text-xs text-emerald-200">Nuevas</p>
                  <p className="text-xl font-extrabold text-emerald-100">18</p>
                </div>
                <div className="rounded-xl border border-amber-300/35 bg-amber-300/10 p-4">
                  <p className="text-xs text-amber-200">Editadas</p>
                  <p className="text-xl font-extrabold text-amber-100">7</p>
                </div>
              </div>
              <div className="rounded-xl border border-dashed border-zinc-500 bg-zinc-900/40 p-4 text-sm leading-6 text-zinc-300">
                Consejo: usa etiquetas por expansion, rareza y estado para filtrar
                resultados al instante.
              </div>
            </div>
          </aside>
        </section>

        <section className="rounded-3xl border border-cyan-300/20 bg-[#242424] p-6 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.75)] sm:p-8">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-bold text-zinc-100">Ultimos movimientos</h3>
            <a
              href="#"
              className="text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
            >
              Ver historial completo
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-separate border-spacing-y-2 text-left text-sm">
              <thead>
                <tr className="text-zinc-300">
                  <th className="px-3 py-2 font-semibold">Carta</th>
                  <th className="px-3 py-2 font-semibold">Set</th>
                  <th className="px-3 py-2 font-semibold">Accion</th>
                  <th className="px-3 py-2 font-semibold">Fecha</th>
                </tr>
              </thead>
              <tbody>
                <tr className="rounded-xl bg-zinc-900/70 text-zinc-100">
                  <td className="rounded-l-xl px-3 py-3 font-medium">Charizard EX</td>
                  <td className="px-3 py-3">Obsidian Flames</td>
                  <td className="px-3 py-3">Anadida</td>
                  <td className="rounded-r-xl px-3 py-3">12 Mar 2026</td>
                </tr>
                <tr className="rounded-xl bg-zinc-900/70 text-zinc-100">
                  <td className="rounded-l-xl px-3 py-3 font-medium">Mewtwo VSTAR</td>
                  <td className="px-3 py-3">Pokemon GO</td>
                  <td className="px-3 py-3">Editada</td>
                  <td className="rounded-r-xl px-3 py-3">11 Mar 2026</td>
                </tr>
                <tr className="rounded-xl bg-zinc-900/70 text-zinc-100">
                  <td className="rounded-l-xl px-3 py-3 font-medium">Judge Foil</td>
                  <td className="px-3 py-3">Scarlet & Violet</td>
                  <td className="px-3 py-3">Eliminada</td>
                  <td className="rounded-r-xl px-3 py-3">10 Mar 2026</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

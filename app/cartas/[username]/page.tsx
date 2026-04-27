export default function CartasPage() {
  return (
    <section className="mx-auto w-full max-w-7xl space-y-4 px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-zinc-700 bg-zinc-900/95 p-6">
        <h1 className="font-[family-name:var(--font-geist-mono)] text-2xl font-bold text-white">Cartas</h1>
        <p className="mt-2 text-sm text-zinc-300">Aqui podras gestionar todas tus cartas.</p>
      </div>

      <div className="rounded-3xl border border-zinc-700 bg-zinc-900/95 p-5">
        <h3 className="mb-4 font-[family-name:var(--font-geist-mono)] text-lg font-bold text-white">
          Gestion de cartas
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <button className="rounded-2xl border border-zinc-500 bg-zinc-900 px-4 py-4 text-left font-bold text-zinc-100 transition hover:-translate-y-0.5 hover:border-zinc-400 hover:bg-zinc-800">
            Añadir carta
          </button>
          <button className="rounded-2xl border border-zinc-500 bg-zinc-900 px-4 py-4 text-left font-bold text-zinc-100 transition hover:-translate-y-0.5 hover:border-zinc-400 hover:bg-zinc-800">
            Eliminar carta
          </button>
        </div>
      </div>
    </section>
  );
}

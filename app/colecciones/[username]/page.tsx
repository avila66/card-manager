export default function ColeccionesPage() {
  const collections = [
    "Favoritos",
    "Wishlist",
    "Eliminar",
    "Pokémon TCG",
    "Topps",
  ];

  return (
    <section className="mx-auto w-full max-w-7xl space-y-4 px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-zinc-700 bg-zinc-900/95 p-6">
        <h1 className="font-[family-name:var(--font-geist-mono)] text-2xl font-bold text-white">Colecciones</h1>
        <p className="mt-2 text-sm text-zinc-300">Aqui podras organizar y administrar tus colecciones.</p>
      </div>

      <div className="rounded-3xl border border-zinc-700 bg-zinc-900/95 p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="font-[family-name:var(--font-geist-mono)] text-lg font-bold text-white">
            Colecciones
          </h3>
          <button className="rounded-2xl border border-zinc-500 bg-zinc-900 px-4 py-2 text-sm font-bold text-zinc-100 transition hover:-translate-y-0.5 hover:border-zinc-400 hover:bg-zinc-800">
            Añadir colección
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {collections.map((collection) => (
            <div key={collection} className="rounded-2xl border border-zinc-700 bg-zinc-900 p-4">
              <p className="text-sm font-semibold text-zinc-100">{collection}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
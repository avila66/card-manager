"use client";

import { useState, useEffect } from "react";
import Image from "next/image";


type Carta = {
  id: number;
  nombre: string;
  rareza: "común" | "especial" | "rara" | "super rara";
  imagen: string;
  precio: number;
};

const cartasMock: Carta[] = [
  { id: 1, nombre: "Carvajal 49 Euro 2024", rareza: "especial", imagen: "/images/cartas/carvajal49euro2024.png", precio: 49 },
  { id: 2, nombre: "Charizard 151", rareza: "super rara", imagen: "/images/cartas/charizard151.jpg", precio: 200 },
  { id: 3, nombre: "Eevee Prismatic", rareza: "rara", imagen: "/images/cartas/eeveeprimsatic.png", precio: 75 },
];

const rarezaOptions = [
  { value: "todas", label: "Todas" },
  { value: "común", label: "Común" },
  { value: "especial", label: "Especial" },
  { value: "rara", label: "Rara" },
  { value: "super rara", label: "Super Rara" },
];

const rarezaColors: Record<string, string> = {
  "común": "bg-gray-500",
  "especial": "bg-blue-500",
  "rara": "bg-purple-500",
  "super rara": "bg-yellow-500",
};

export default function CartasPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [rarezaFilter, setRarezaFilter] = useState("todas");
  const [username, setUsername] = useState("");
  const [cartas, setCartas] = useState<Carta[]>(cartasMock);
  const [cartaSeleccionada, setCartaSeleccionada] = useState<Carta | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('username');
    if (stored) setUsername(stored);
  }, []);

  const filteredCartas = cartas.filter((carta) => {
    const matchesSearch = carta.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRareza = rarezaFilter === "todas" || carta.rareza === rarezaFilter;
    return matchesSearch && matchesRareza;
  });

  const abrirModal = (carta: Carta) => {
    setCartaSeleccionada(carta);
  };

  const cerrarModal = () => {
    setCartaSeleccionada(null);
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-[family-name:var(--font-geist-mono)] text-3xl font-bold text-white">
            Mercado de Cartas
          </h1>
          <p className="mt-2 text-zinc-400">
            Explora y gestiona tu colección de cartas
          </p>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Sidebar de filtros */}
          <aside className="w-full shrink-0 lg:w-64">
            <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-5">
              <h3 className="mb-4 font-[family-name:var(--font-geist-mono)] text-lg font-bold text-white">
                Filtros
              </h3>

              {/* Buscador */}
              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-zinc-400">
                  Buscar
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar carta..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 pl-10 text-sm text-white placeholder-zinc-500 focus:border-zinc-500 focus:outline-none"
                  />
                  <svg
                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* Filtro de rareza */}
              <div>
                <label className="mb-3 block text-sm font-medium text-zinc-400">
                  Rareza
                </label>
                <div className="space-y-2">
                  {rarezaOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setRarezaFilter(option.value)}
                      className={`w-full rounded-xl border px-4 py-2.5 text-left text-sm font-medium transition ${
                        rarezaFilter === option.value
                          ? "border-zinc-500 bg-zinc-800 text-white"
                          : "border-zinc-700 bg-zinc-900 text-zinc-400 hover:border-zinc-600 hover:text-white"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Grid de cartas */}
          <div className="flex-1">
            {/* Resultados */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-zinc-400">
                {filteredCartas.length} {filteredCartas.length === 1 ? "carta" : "cartas"} encontradas
              </p>
            </div>

            {filteredCartas.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredCartas.map((carta) => (
                  <div
                    key={carta.id}
                    onClick={() => abrirModal(carta)}
                    className="cursor-pointer overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900"
                  >
                    {/* Imagen de la carta */}
                    <div className="aspect-[3/4] w-full bg-zinc-800 relative">
                      <Image
                        src={carta.imagen}
                        alt={carta.nombre}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Info de la carta */}
                    <div className="p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium text-white ${
                            rarezaColors[carta.rareza] || "bg-gray-500"
                          }`}
                        >
                          {carta.rareza}
                        </span>
                      </div>
                      <h3 className="mb-1 truncate font-[family-name:var(--font-geist-mono)] font-bold text-white">
                        {carta.nombre}
                      </h3>
                      <p className="text-lg font-bold text-green-400">
                        {carta.precio.toFixed(2)} €
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-zinc-800 bg-zinc-900/50 py-16">
                <svg
                  className="mb-4 h-12 w-12 text-zinc-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-zinc-400">No se encontraron cartas</p>
                <p className="mt-1 text-sm text-zinc-500">
                  Prueba con otros filtros o términos de búsqueda
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal de detalle de carta */}
      {cartaSeleccionada && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={cerrarModal}
        >
          <div
            className="flex max-w-4xl flex-col rounded-3xl border border-zinc-700 bg-zinc-900 p-6 md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Imagen grande */}
            <div className="relative aspect-[3/4] w-full shrink-0 overflow-hidden rounded-2xl bg-zinc-800 md:w-80">
              <Image
                src={cartaSeleccionada.imagen}
                alt={cartaSeleccionada.nombre}
                fill
                className="object-cover"
              />
            </div>

            {/* Información */}
            <div className="mt-6 md:ml-6 md:mt-0">
              <div className="mb-4 flex items-center justify-between">
                <span
                  className={`rounded-full px-3 py-1 text-sm font-medium text-white ${
                    rarezaColors[cartaSeleccionada.rareza] || "bg-gray-500"
                  }`}
                >
                  {cartaSeleccionada.rareza}
                </span>
                <button
                  onClick={cerrarModal}
                  className="rounded-full p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <h2 className="mb-2 font-[family-name:var(--font-geist-mono)] text-2xl font-bold text-white">
                {cartaSeleccionada.nombre}
              </h2>
              <p className="mb-6 text-3xl font-bold text-green-400">
                {cartaSeleccionada.precio.toFixed(2)} €
              </p>

              <div className="space-y-3 text-sm text-zinc-400">
                <div className="flex justify-between border-b border-zinc-800 py-2">
                  <span>ID</span>
                  <span className="text-white">#{cartaSeleccionada.id}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-800 py-2">
                  <span>Rareza</span>
                  <span className="text-white capitalize">{cartaSeleccionada.rareza}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-800 py-2">
                  <span>Estado</span>
                  <span className="text-white">Disponible</span>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button className="flex-1 rounded-xl bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-500">
                  Comprar
                </button>
                <button className="flex-1 rounded-xl border border-zinc-600 px-4 py-3 font-medium text-white hover:bg-zinc-800">
                  Añadir a colección
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

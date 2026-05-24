'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

type Carta = {
  id_carta: string;
  foto_carta: string | null;
  precio_compra: number | null;
  marca?: { nombre_marca: string } | null;
  pokemon?: { pokemon: string; set_carta: string | null; rareza?: { rareza: string } | null; idioma?: { idioma: string } | null } | null;
  futbol?: { jugador: string | null; equipo: string | null; coleccion: string | null; temporada: string | null; auto_firma: boolean; relic: boolean; numeracion: string | null } | null;
};

type Coleccion = { id_coleccion: string; nombre_coleccion: string; foto_coleccion: string | null };

// Nombres de colecciones del sistema — no se pueden eliminar
const SYSTEM_NAMES = ['Favoritas', 'Wishlist', 'En Venta'];
const SYSTEM_FOTOS: Record<string, string> = {
  'Favoritas': '/images/colecciones/favoritas.png',
  'Wishlist': '/images/colecciones/wishlist.png',
  'En Venta': '/images/colecciones/en-venta.png',
};

function getNombreCarta(carta: Carta) {
  if (carta.futbol) {
    const partes = [carta.futbol.jugador, carta.marca?.nombre_marca, carta.futbol.coleccion, carta.futbol.temporada];
    if (carta.futbol.auto_firma) partes.push('Auto');
    if (carta.futbol.relic) partes.push('Patch');
    if (carta.futbol.numeracion) partes.push(carta.futbol.numeracion);
    return partes.filter(Boolean).join(' ');
  }
  if (carta.pokemon) return [carta.pokemon.pokemon, carta.pokemon.rareza?.rareza, carta.pokemon.set_carta, carta.pokemon.idioma?.idioma].filter(Boolean).join(' ');
  return 'Carta';
}

export default function ColeccionDetallePage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;
  const idColeccion = params.id_coleccion as string;

  const [coleccion, setColeccion] = useState<Coleccion | null>(null);
  const [cartas, setCartas] = useState<Carta[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartaAEliminar, setCartaAEliminar] = useState<Carta | null>(null);
  const [loadingEliminar, setLoadingEliminar] = useState(false);
  const [modalAnadir, setModalAnadir] = useState(false);
  const [cartasDisponibles, setCartasDisponibles] = useState<Carta[]>([]);
  const [loadingAnadir, setLoadingAnadir] = useState(false);
  const [modalEliminarColeccion, setModalEliminarColeccion] = useState(false);
  const [loadingEliminarColeccion, setLoadingEliminarColeccion] = useState(false);

  // esSistema se determina una vez que cargamos la colección
  const esSistema = coleccion ? SYSTEM_NAMES.includes(coleccion.nombre_coleccion) : false;

  useEffect(() => {
    fetchColeccion();
  }, [idColeccion]);

  async function fetchColeccion() {
    setLoading(true);
    try {
      const res = await fetch(`/api/colecciones/${idColeccion}`);
      const data = await res.json();
      if (res.ok) {
        setColeccion(data.coleccion);
        setCartas(data.cartas || []);
        document.title = `${data.coleccion.nombre_coleccion} | Card Manager`;
      }
    } catch {}
    finally { setLoading(false); }
  }

  async function fetchCartasDisponibles() {
    const res = await fetch('/api/cartas');
    const data = await res.json();
    const idsEnColeccion = new Set(cartas.map(c => c.id_carta));
    setCartasDisponibles((data.cartas || []).filter((c: Carta) => !idsEnColeccion.has(c.id_carta)));
  }

  const handleEliminarDeColeccion = async () => {
    if (!cartaAEliminar) return;
    setLoadingEliminar(true);
    try {
      const res = await fetch(`/api/colecciones/${idColeccion}?id_carta=${cartaAEliminar.id_carta}`, { method: 'DELETE' });
      if (res.ok) { setCartaAEliminar(null); fetchColeccion(); }
    } catch {}
    finally { setLoadingEliminar(false); }
  };

  const handleAnadirCarta = async (idCarta: string) => {
    setLoadingAnadir(true);
    try {
      const res = await fetch('/api/carta-coleccion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_coleccion: idColeccion, id_carta: idCarta }),
      });
      if (res.ok) { setModalAnadir(false); fetchColeccion(); }
    } catch {}
    finally { setLoadingAnadir(false); }
  };

  const handleEliminarColeccion = async () => {
    setLoadingEliminarColeccion(true);
    try {
      const res = await fetch(`/api/colecciones/${idColeccion}`, { method: 'DELETE' });
      if (res.ok) router.push(`/colecciones/${username}`);
    } catch {}
    finally { setLoadingEliminarColeccion(false); }
  };

  const nombre = coleccion?.nombre_coleccion || '';
  const fotoSistema = coleccion ? SYSTEM_FOTOS[coleccion.nombre_coleccion] : null;
  const foto = fotoSistema || coleccion?.foto_coleccion;

  if (loading) return <div className="flex min-h-screen items-center justify-center" style={{ background: '#0d0f18' }}><p style={{ color: '#475569' }}>Cargando colección...</p></div>;

  return (
    <div className="min-h-screen text-white px-4 pt-8 pb-12 sm:px-6 lg:px-10" style={{ background: '#0d0f18' }}>
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

      <div className="relative z-10 mx-auto max-w-7xl">
        <button onClick={() => router.push(`/colecciones/${username}`)} className="mb-6 flex items-center gap-2 text-sm transition" style={{ color: '#475569' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#f1f5f9'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#475569'; }}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Volver a colecciones
        </button>

        <div className="mb-10 flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {foto && (
              <div className="h-16 w-16 rounded-xl overflow-hidden flex-shrink-0" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                <img src={foto} alt={nombre} className="h-full w-full object-cover" />
              </div>
            )}
            <div>
              <span className="text-xs font-bold tracking-widest uppercase block mb-1" style={{ color: '#60a5fa' }}>{esSistema ? 'Colección del sistema' : 'Colección'}</span>
              <h1 className="text-2xl md:text-3xl font-black" style={{ fontFamily: "'Orbitron', monospace", color: '#f1f5f9' }}>{nombre}</h1>
              <p className="text-sm mt-1" style={{ color: '#475569' }}>{cartas.length} {cartas.length === 1 ? 'carta' : 'cartas'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            {!esSistema && (
              <button onClick={() => setModalEliminarColeccion(true)} className="rounded-xl px-4 py-3 text-sm font-bold tracking-wide transition-all hover:opacity-90" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}>
                Eliminar colección
              </button>
            )}
            <button onClick={async () => { await fetchCartasDisponibles(); setModalAnadir(true); }} className="rounded-xl px-5 py-3 text-sm font-bold tracking-wide transition-all hover:opacity-90 hover:scale-105" style={{ background: '#f1f5f9', color: '#0d0f18' }}>
              + Añadir carta
            </button>
          </div>
        </div>

        {cartas.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl py-20" style={{ background: '#161926', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-sm italic" style={{ color: '#475569' }}>Esta colección no tiene cartas todavía</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {cartas.map((carta) => (
              <div key={carta.id_carta} className="relative overflow-hidden rounded-2xl transition-all hover:-translate-y-0.5" style={{ background: '#161926', border: '1px solid rgba(255,255,255,0.07)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(96,165,250,0.2)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)'; }}
              >
                <button onClick={(e) => { e.stopPropagation(); setCartaAEliminar(carta); }} className="absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-lg transition" style={{ background: 'rgba(239,68,68,0.85)' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,1)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.85)'; }}
                >
                  <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
                <div onClick={() => router.push(`/cartas/${username}/${carta.id_carta}`)} className="cursor-pointer">
                  <div className="aspect-[3/4] w-full overflow-hidden" style={{ background: '#0d0f18' }}>
                    {carta.foto_carta ? (
                      <img src={carta.foto_carta} alt={getNombreCarta(carta)} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
                    ) : (
                      <div className="flex h-full items-center justify-center" style={{ color: '#334155' }}>
                        <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <span className="inline-block rounded-full px-2 py-0.5 text-xs font-medium text-white mb-1" style={{ background: carta.pokemon ? '#854d0e' : '#1d4ed8' }}>{carta.pokemon ? 'Pokémon' : 'Fútbol'}</span>
                    <p className="text-sm font-bold truncate" style={{ color: '#e2e8f0' }}>{getNombreCarta(carta)}</p>
                    {carta.precio_compra && <p className="text-sm font-bold mt-0.5" style={{ color: '#4ade80' }}>{carta.precio_compra.toFixed(2)} €</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal quitar carta de colección */}
      {cartaAEliminar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setCartaAEliminar(null)}>
          <div className="w-full max-w-md rounded-3xl p-8 shadow-2xl" style={{ background: '#161926', border: '1px solid rgba(255,255,255,0.1)' }} onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-black mb-4" style={{ fontFamily: "'Orbitron', monospace", color: '#f1f5f9' }}>¿Quitar de la colección?</h2>
            <p className="text-sm mb-6" style={{ color: '#64748b' }}>¿Estás seguro que quieres quitar <span className="font-bold" style={{ color: '#f1f5f9' }}>{getNombreCarta(cartaAEliminar)}</span> de esta colección? La carta no se eliminará de tu cuenta.</p>
            <div className="flex gap-3">
              <button onClick={() => setCartaAEliminar(null)} className="flex-1 rounded-xl py-3 text-sm font-semibold" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>Cancelar</button>
              <button onClick={handleEliminarDeColeccion} disabled={loadingEliminar} className="flex-1 rounded-xl py-3 text-sm font-bold disabled:opacity-50" style={{ background: '#ef4444', color: '#fff' }}>{loadingEliminar ? 'Quitando...' : 'Quitar'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal eliminar colección (solo colecciones normales) */}
      {modalEliminarColeccion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setModalEliminarColeccion(false)}>
          <div className="w-full max-w-md rounded-3xl p-8 shadow-2xl" style={{ background: '#161926', border: '1px solid rgba(255,255,255,0.1)' }} onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-black mb-4" style={{ fontFamily: "'Orbitron', monospace", color: '#f1f5f9' }}>¿Eliminar colección?</h2>
            <p className="text-sm mb-6" style={{ color: '#64748b' }}>¿Estás seguro que quieres eliminar <span className="font-bold" style={{ color: '#f1f5f9' }}>{nombre}</span>? Las cartas no se eliminarán, solo se desasociarán de esta colección.</p>
            <div className="flex gap-3">
              <button onClick={() => setModalEliminarColeccion(false)} className="flex-1 rounded-xl py-3 text-sm font-semibold" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>Cancelar</button>
              <button onClick={handleEliminarColeccion} disabled={loadingEliminarColeccion} className="flex-1 rounded-xl py-3 text-sm font-bold disabled:opacity-50" style={{ background: '#ef4444', color: '#fff' }}>{loadingEliminarColeccion ? 'Eliminando...' : 'Eliminar'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal añadir carta */}
      {modalAnadir && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setModalAnadir(false)}>
          <div className="w-full max-w-2xl rounded-3xl p-6 shadow-2xl" style={{ background: '#161926', border: '1px solid rgba(255,255,255,0.1)', maxHeight: '80vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black" style={{ fontFamily: "'Orbitron', monospace", color: '#f1f5f9' }}>Añadir carta a la colección</h2>
              <button onClick={() => setModalAnadir(false)} className="rounded-full p-2" style={{ color: '#475569' }}>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            {cartasDisponibles.length === 0 ? (
              <p className="text-sm italic text-center py-8" style={{ color: '#475569' }}>No hay cartas disponibles para añadir</p>
            ) : (
              <div className="flex flex-col gap-3">
                {cartasDisponibles.map((carta) => (
                  <div key={carta.id_carta} className="flex items-center gap-4 rounded-xl p-3" style={{ background: '#0d0f18', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="h-16 w-12 flex-shrink-0 rounded-lg overflow-hidden" style={{ background: '#161926' }}>
                      {carta.foto_carta ? <img src={carta.foto_carta} alt={getNombreCarta(carta)} className="h-full w-full object-cover" /> : <div className="h-full w-full" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="inline-block rounded-full px-2 py-0.5 text-xs font-medium text-white mb-1" style={{ background: carta.pokemon ? '#854d0e' : '#1d4ed8' }}>{carta.pokemon ? 'Pokémon' : 'Fútbol'}</span>
                      <p className="text-sm font-medium truncate" style={{ color: '#e2e8f0' }}>{getNombreCarta(carta)}</p>
                    </div>
                    <button onClick={() => handleAnadirCarta(carta.id_carta)} disabled={loadingAnadir} className="flex-shrink-0 flex h-9 w-9 items-center justify-center rounded-xl text-xl font-bold transition hover:scale-110 disabled:opacity-50" style={{ background: 'rgba(96,165,250,0.12)', border: '1px solid rgba(96,165,250,0.3)', color: '#60a5fa' }}>+</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&display=swap');`}</style>
    </div>
  );
}

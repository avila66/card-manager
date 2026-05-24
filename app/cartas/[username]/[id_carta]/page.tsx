'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

type ColeccionItem = { id_coleccion: string; nombre_coleccion: string; foto_coleccion: string | null };

type CartaDetalle = {
  id_carta: string;
  foto_carta: string | null;
  precio_compra: number;
  fecha_compra: string | null;
  wishlist: boolean;
  vender: boolean;
  favorita: boolean;
  numero_gradeo: number | null;
  nota_gradeo: string | null;
  black_label: boolean;
  id_casa_fk: number | null;
  casa_gradeo?: { nombre_casa: string } | null;
  marca?: { nombre_marca: string } | null;
  pokemon?: { pokemon: string; set_carta: string; numero: number; rareza?: { rareza: string } | null; idioma?: { idioma: string } | null } | null;
  futbol?: { jugador: string; equipo: string; coleccion: string; temporada: string; tipo_carta: string | null; numeracion: string | null; rookie: boolean; auto_firma: boolean; relic: boolean } | null;
};

function generarGrafico(idCarta: string, precioCompra: number) {
  const hashBase = idCarta.split('').reduce((acc, c, i) => acc + c.charCodeAt(0) * (i + 1) * 31, 0);
  let state = hashBase;
  const siguiente = () => { state = (state * 1664525 + 1013904223) & 0xffffffff; return (state >>> 0) / 0xffffffff; };
  const hoy = new Date();
  const puntos = [];
  let precioActual = precioCompra;
  for (let i = 14; i >= 0; i--) {
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() - i * 6);
    const rnd = siguiente();
    const variacion = rnd * 0.7 - 0.3;
    precioActual = Math.round(precioActual * (1 + variacion) * 100) / 100;
    puntos.push({ fecha: fecha.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }), precio: precioActual });
  }
  return puntos;
}

export default function CartaDetallePage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;
  const idCarta = params.id_carta as string;

  const [carta, setCarta] = useState<CartaDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [colecciones, setColecciones] = useState<ColeccionItem[]>([]);
  const [modalColecciones, setModalColecciones] = useState(false);

  useEffect(() => {
    fetchCarta();
    fetchColeccionesDeCarta();
  }, [idCarta]);

  async function fetchCarta() {
    try {
      const res = await fetch(`/api/cartas/${idCarta}`);
      const data = await res.json();
      if (!res.ok) { setError(data.mensaje || 'Error al cargar la carta'); }
      else {
        setCarta(data.carta);
        document.title = `${data.carta.pokemon?.pokemon || data.carta.futbol?.jugador || 'Carta'} | Card Manager`;
      }
    } catch { setError('Error al conectar con la API'); }
    finally { setLoading(false); }
  }

  async function fetchColeccionesDeCarta() {
    try {
      const res = await fetch(`/api/cartas/${idCarta}/colecciones`);
      const data = await res.json();
      setColecciones(data.colecciones || []);
    } catch {}
  }

  const grafico = useMemo(() => { if (!carta) return []; return generarGrafico(carta.id_carta, carta.precio_compra); }, [carta]);

  if (loading) return <div className="flex min-h-screen items-center justify-center" style={{ background: '#0d0f18' }}><p style={{ color: '#475569' }}>Cargando carta...</p></div>;
  if (error || !carta) return <div className="flex min-h-screen items-center justify-center" style={{ background: '#0d0f18' }}><p style={{ color: '#f87171' }}>{error || 'Carta no encontrada'}</p></div>;

  const esFutbol = !!carta.futbol;
  const gradeada = !!carta.numero_gradeo || !!carta.nota_gradeo || !!carta.id_casa_fk;

  const labelCls = 'text-xs uppercase tracking-widest';
  const labelStyle = { color: '#475569' };
  const valueCls = 'text-sm font-medium mt-0.5';
  const valueStyle = { color: '#e2e8f0' };

  const colsToShow = colecciones.slice(0, 3);
  const resto = colecciones.length - 3;

  return (
    <div className="min-h-screen text-white px-4 pt-8 pb-12 sm:px-6 lg:px-8" style={{ background: '#0d0f18' }}>
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

      <div className="relative z-10 mx-auto max-w-7xl">
        <button onClick={() => router.push(`/cartas/${username}`)} className="mb-6 flex items-center gap-2 text-sm transition" style={{ color: '#475569' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#f1f5f9'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#475569'; }}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Volver a mis cartas
        </button>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          {/* Foto */}
          <div className="w-full shrink-0 lg:w-80 xl:w-96">
            <div className="sticky top-24 aspect-[3/4] w-full overflow-hidden rounded-3xl" style={{ border: '1px solid rgba(255,255,255,0.08)', background: '#161926' }}>
              {carta.foto_carta ? (
                <img src={carta.foto_carta} alt="Carta" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center" style={{ color: '#334155' }}>
                  <svg className="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            {/* Apartado 1: Atributos */}
            {esFutbol && carta.futbol && (() => {
              const fila2 = [
                { label: 'Tipo de carta', value: carta.futbol!.tipo_carta || '—' },
                ...(carta.futbol!.auto_firma ? [{ label: 'Auto', value: 'Sí' }] : []),
                ...(carta.futbol!.relic ? [{ label: 'Patch', value: 'Sí' }] : []),
                ...(carta.futbol!.numeracion ? [{ label: 'Numeración', value: carta.futbol!.numeracion }] : []),
              ];
              return (
                <div className="space-y-4">
                  <div className="grid grid-cols-5 gap-4">
                    <div><p className={labelCls} style={labelStyle}>Jugador</p><p className={valueCls} style={valueStyle}>{carta.futbol!.jugador}</p></div>
                    <div><p className={labelCls} style={labelStyle}>Equipo</p><p className={valueCls} style={valueStyle}>{carta.futbol!.equipo}</p></div>
                    <div><p className={labelCls} style={labelStyle}>Marca</p><p className={valueCls} style={valueStyle}>{carta.marca?.nombre_marca || '—'}</p></div>
                    <div><p className={labelCls} style={labelStyle}>Colección</p><p className={valueCls} style={valueStyle}>{carta.futbol!.coleccion}</p></div>
                    <div><p className={labelCls} style={labelStyle}>Temporada</p><p className={valueCls} style={valueStyle}>{carta.futbol!.temporada}</p></div>
                  </div>
                  <div className="grid grid-cols-5 gap-4">
                    {fila2.map(f => (<div key={f.label}><p className={labelCls} style={labelStyle}>{f.label}</p><p className={valueCls} style={valueStyle}>{f.value}</p></div>))}
                    {Array.from({ length: 5 - fila2.length }).map((_, i) => <div key={i} />)}
                  </div>
                  <div className="grid grid-cols-5 gap-4">
                    <div><p className={labelCls} style={labelStyle}>Fecha de compra</p><p className={valueCls} style={valueStyle}>{carta.fecha_compra || '—'}</p></div>
                    <div><p className={labelCls} style={labelStyle}>Precio de compra</p><p className="text-sm font-bold mt-0.5" style={{ color: '#4ade80' }}>{carta.precio_compra.toFixed(2)} €</p></div>
                    <div /><div /><div />
                  </div>
                </div>
              );
            })()}

            {!esFutbol && carta.pokemon && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><p className={labelCls} style={labelStyle}>Pokémon</p><p className={valueCls} style={valueStyle}>{carta.pokemon.pokemon}</p></div>
                  <div><p className={labelCls} style={labelStyle}>Set</p><p className={valueCls} style={valueStyle}>{carta.pokemon.set_carta}</p></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><p className={labelCls} style={labelStyle}>Número</p><p className={valueCls} style={valueStyle}>{carta.pokemon.numero}</p></div>
                  <div><p className={labelCls} style={labelStyle}>Rareza</p><p className={valueCls} style={valueStyle}>{carta.pokemon.rareza?.rareza || '—'}</p></div>
                </div>
                <div><p className={labelCls} style={labelStyle}>Idioma</p><p className={valueCls} style={valueStyle}>{carta.pokemon.idioma?.idioma || '—'}</p></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><p className={labelCls} style={labelStyle}>Fecha de compra</p><p className={valueCls} style={valueStyle}>{carta.fecha_compra || '—'}</p></div>
                  <div><p className={labelCls} style={labelStyle}>Precio de compra</p><p className="text-sm font-bold mt-0.5" style={{ color: '#4ade80' }}>{carta.precio_compra.toFixed(2)} €</p></div>
                </div>
              </div>
            )}

            <hr className="my-6" style={{ borderColor: 'rgba(255,255,255,0.06)' }} />

            {/* Apartado 2: Gradeo */}
            {gradeada ? (
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest" style={{ fontFamily: "'Orbitron', monospace", color: '#60a5fa' }}>Gradeo</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div><p className={labelCls} style={labelStyle}>Casa de gradeo</p><p className={valueCls} style={valueStyle}>{carta.casa_gradeo?.nombre_casa || '—'}</p></div>
                  <div><p className={labelCls} style={labelStyle}>Nota</p><p className={valueCls} style={valueStyle}>{carta.nota_gradeo || '—'}</p></div>
                </div>
                <div><p className={labelCls} style={labelStyle}>Número de gradeo</p><p className={valueCls} style={valueStyle}>{carta.numero_gradeo || '—'}</p></div>
                {carta.black_label && (
                  <div
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5"
                    style={{
                      background: 'rgba(0,0,0,0.5)',
                      border: '1px solid rgba(250,204,21,0.45)',
                    }}
                  >
                    <span className="text-sm font-black tracking-wide" style={{ color: '#facc15' }}>★ BLACK LABEL</span>
                    <span className="text-xs" style={{ color: '#78716c' }}>Beckett · Nota 10</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm italic" style={{ color: '#334155' }}>La carta no está gradeada</p>
            )}

            <hr className="my-6" style={{ borderColor: 'rgba(255,255,255,0.06)' }} />

            {/* Apartado 3: Gráfico */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest mb-4" style={{ fontFamily: "'Orbitron', monospace", color: '#60a5fa' }}>Evolución del valor</h3>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={grafico}>
                    <XAxis dataKey="fecha" tick={{ fill: '#334155', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#334155', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}€`} />
                    <Tooltip contentStyle={{ backgroundColor: '#161926', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', fontSize: '12px' }} labelStyle={{ color: '#94a3b8' }} formatter={(v: number) => [`${v.toFixed(2)} €`, 'Valor']} />
                    <Line type="monotone" dataKey="precio" stroke="#60a5fa" strokeWidth={2} dot={{ fill: '#60a5fa', r: 3 }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <hr className="my-6" style={{ borderColor: 'rgba(255,255,255,0.06)' }} />

            {/* Apartado 4: Colecciones */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest mb-4" style={{ fontFamily: "'Orbitron', monospace", color: '#60a5fa' }}>Colecciones</h3>
              {colecciones.length === 0 ? (
                <p className="text-sm italic" style={{ color: '#334155' }}>Esta carta no pertenece a ninguna colección</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {colsToShow.map((col) => (
                    <button key={col.id_coleccion} onClick={() => router.push(`/colecciones/${username}/${col.id_coleccion}`)} className="flex items-center gap-4 rounded-xl p-3 text-left transition-all hover:-translate-y-0.5" style={{ background: '#161926', border: '1px solid rgba(255,255,255,0.07)' }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(96,165,250,0.25)'; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.07)'; }}
                    >
                      <div className="h-12 w-12 flex-shrink-0 rounded-lg overflow-hidden" style={{ background: '#0d0f18' }}>
                        {col.foto_coleccion ? <img src={col.foto_coleccion} alt={col.nombre_coleccion} className="h-full w-full object-cover" /> : <div className="h-full w-full" />}
                      </div>
                      <span className="text-sm font-medium truncate" style={{ color: '#e2e8f0' }}>{col.nombre_coleccion}</span>
                      <svg className="h-4 w-4 ml-auto flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#334155' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </button>
                  ))}
                  {resto > 0 && (
                    <button onClick={() => setModalColecciones(true)} className="flex items-center justify-center rounded-xl p-3 text-sm transition" style={{ background: 'rgba(96,165,250,0.06)', border: '1px solid rgba(96,165,250,0.15)', color: '#60a5fa' }}>
                      Y {resto} más
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal todas las colecciones */}
      {modalColecciones && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setModalColecciones(false)}>
          <div className="w-full max-w-lg rounded-3xl p-6 shadow-2xl" style={{ background: '#161926', border: '1px solid rgba(255,255,255,0.1)' }} onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-black" style={{ fontFamily: "'Orbitron', monospace", color: '#f1f5f9' }}>Todas las colecciones</h2>
              <button onClick={() => setModalColecciones(false)} className="rounded-full p-2 transition" style={{ color: '#475569' }}><svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <div className="flex flex-col gap-2 max-h-96 overflow-y-auto">
              {colecciones.map((col) => (
                <button key={col.id_coleccion} onClick={() => router.push(`/colecciones/${username}/${col.id_coleccion}`)} className="flex items-center gap-4 rounded-xl p-3 text-left transition" style={{ background: '#0d0f18', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="h-12 w-12 flex-shrink-0 rounded-lg overflow-hidden" style={{ background: '#161926' }}>
                    {col.foto_coleccion ? <img src={col.foto_coleccion} alt={col.nombre_coleccion} className="h-full w-full object-cover" /> : <div className="h-full w-full" />}
                  </div>
                  <span className="text-sm font-medium truncate" style={{ color: '#e2e8f0' }}>{col.nombre_coleccion}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&display=swap');`}</style>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

type Carta = {
  id_carta: string;
  foto_carta: string | null;
  precio_compra: number | null;
  fecha_compra: string | null;
  marca?: { nombre_marca: string } | null;
  pokemon?: { pokemon: string; set_carta: string | null; rareza?: { rareza: string } | null; idioma?: { idioma: string } | null } | null;
  futbol?: { jugador: string | null; equipo: string | null; coleccion: string | null; temporada: string | null; auto_firma: boolean; relic: boolean; numeracion: string | null } | null;
};

type Rareza = { id_rareza: number; rareza: string };
type Idioma = { id_idioma: number; idioma: string };
type Marca = { id_marca: number; nombre_marca: string };
type CasaGradeo = { id_casa: number; nombre_casa: string };

export default function CartasPage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;

  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFilter, setTipoFilter] = useState("todas");
  const [cartas, setCartas] = useState<Carta[]>([]);
  const [loadingCartas, setLoadingCartas] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [paso, setPaso] = useState(1);
  const [tipoCarta, setTipoCarta] = useState<'pokemon' | 'futbol' | null>(null);
  const [loadingGuardar, setLoadingGuardar] = useState(false);
  const [error, setError] = useState('');
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [rarezas, setRarezas] = useState<Rareza[]>([]);
  const [idiomas, setIdiomas] = useState<Idioma[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [casas, setCasas] = useState<CasaGradeo[]>([]);
  const [cartaAEliminar, setCartaAEliminar] = useState<Carta | null>(null);
  const [loadingEliminar, setLoadingEliminar] = useState(false);
  const [form, setForm] = useState({
    fecha_compra: '', precio_compra: '',
    pokemon: '', numero: '', set_carta: '', id_rareza_fk: '', id_idioma_fk: '',
    jugador: '', equipo: '', id_marca_fk: '', coleccion: '', temporada: '',
    tipo_carta_futbol: '', numeracion: '', rookie: false, auto_firma: false, relic: false,
    id_casa_fk: '', numero_gradeo: '', nota_gradeo: '', black_label: false,
  });

  useEffect(() => {
    document.title = 'Cartas | Card Manager';
    fetchCartas();
    fetchCatalogos();
  }, []);

  async function fetchCartas() {
    try {
      const res = await fetch('/api/cartas');
      const data = await res.json();
      setCartas(data.cartas || []);
    } catch {}
    finally { setLoadingCartas(false); }
  }

  async function fetchCatalogos() {
    const res = await fetch('/api/catalogos');
    const data = await res.json();
    setRarezas(data.rarezas || []);
    setIdiomas(data.idiomas || []);
    setMarcas(data.marcas || []);
    setCasas(data.casas || []);
  }

  const resetModal = () => {
    setPaso(1); setTipoCarta(null); setError(''); setFotoFile(null); setFotoPreview(null);
    setForm({ fecha_compra: '', precio_compra: '', pokemon: '', numero: '', set_carta: '', id_rareza_fk: '', id_idioma_fk: '', jugador: '', equipo: '', id_marca_fk: '', coleccion: '', temporada: '', tipo_carta_futbol: '', numeracion: '', rookie: false, auto_firma: false, relic: false, id_casa_fk: '', numero_gradeo: '', nota_gradeo: '', black_label: false });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const value = target.type === 'checkbox' ? target.checked : target.value;

    if (target.name === 'black_label' && target.type === 'checkbox') {
      const isChecked = target.checked;
      // Si se marca Black Label, la nota se pone a 10 automáticamente
      setForm(prev => ({ ...prev, black_label: isChecked, nota_gradeo: isChecked ? '10' : prev.nota_gradeo }));
      return;
    }

    setForm({ ...form, [target.name]: value });
  };

  const handleFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setFotoFile(file); setFotoPreview(URL.createObjectURL(file)); }
  };

  const handleGuardar = async (gradeada: boolean) => {
    setLoadingGuardar(true); setError('');
    try {
      const formData = new FormData();
      if (fotoFile) formData.append('foto_carta', fotoFile);
      formData.append('es_futbol', tipoCarta === 'futbol' ? 'true' : 'false');
      formData.append('gradeada', String(gradeada));
      Object.entries(form).forEach(([key, value]) => formData.append(key, String(value)));
      const res = await fetch('/api/cartas', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) { setError(data.mensaje || 'Error al añadir carta'); }
      else { setModalAbierto(false); resetModal(); fetchCartas(); }
    } catch { setError('Error al conectar con la API'); }
    finally { setLoadingGuardar(false); }
  };

  const getNombreCarta = (carta: Carta) => {
    if (carta.futbol) {
      const partes = [carta.futbol.jugador, carta.marca?.nombre_marca, carta.futbol.coleccion, carta.futbol.temporada];
      if (carta.futbol.auto_firma) partes.push('Auto');
      if (carta.futbol.relic) partes.push('Relic');
      if (carta.futbol.numeracion) partes.push(carta.futbol.numeracion);
      return partes.filter(Boolean).join(' ');
    }
    if (carta.pokemon) return [carta.pokemon.pokemon, carta.pokemon.rareza?.rareza, carta.pokemon.set_carta, carta.pokemon.idioma?.idioma].filter(Boolean).join(' ');
    return 'esta carta';
  };

  const handleEliminar = async () => {
    if (!cartaAEliminar) return;
    setLoadingEliminar(true);
    try {
      const res = await fetch(`/api/cartas/${cartaAEliminar.id_carta}`, { method: 'DELETE' });
      if (res.ok) { setCartaAEliminar(null); fetchCartas(); }
    } catch {}
    finally { setLoadingEliminar(false); }
  };

  const filteredCartas = cartas.filter((carta) => {
    const nombre = carta.pokemon ? carta.pokemon.pokemon || '' : carta.futbol?.jugador || '';
    const matchesSearch = nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = tipoFilter === 'todas' || (tipoFilter === 'pokemon' ? !!carta.pokemon : !!carta.futbol);
    return matchesSearch && matchesTipo;
  });

  // Buscar si la casa seleccionada es Beckett
  const casaSeleccionada = casas.find(c => String(c.id_casa) === form.id_casa_fk);
  const esBeckett = casaSeleccionada?.nombre_casa?.toLowerCase().includes('beckett') ?? false;

  const inputCls = 'w-full rounded-xl px-4 py-2.5 text-sm outline-none transition';
  const inputStyle = { background: '#0d0f18', border: '1px solid rgba(255,255,255,0.1)', color: '#f1f5f9' };
  const labelCls = 'block text-xs uppercase tracking-widest mb-1.5';
  const labelStyle = { color: '#475569' };
  const selectCls = 'w-full rounded-xl px-4 py-2.5 text-sm outline-none transition';
  const btnActive = { background: 'rgba(96,165,250,0.12)', border: '1px solid rgba(96,165,250,0.35)', color: '#60a5fa' };
  const btnInactive = { background: '#0d0f18', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' };

  return (
    <div className="min-h-screen text-white px-4 pt-8 pb-12 sm:px-6 lg:px-8" style={{ background: '#0d0f18' }}>
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <span className="text-xs font-bold tracking-widest uppercase block mb-3" style={{ color: '#60a5fa' }}>Mi colección</span>
            <h1 className="text-3xl md:text-4xl font-black mb-2" style={{ fontFamily: "'Orbitron', monospace", color: '#f1f5f9' }}>Mis Cartas</h1>
            <p className="text-sm" style={{ color: '#475569' }}>Gestiona tu colección de cartas</p>
          </div>
          <button onClick={() => { resetModal(); setModalAbierto(true); }} className="flex-shrink-0 rounded-xl px-5 py-3 text-sm font-bold tracking-wide transition-all hover:opacity-90 hover:scale-105" style={{ background: '#f1f5f9', color: '#0d0f18' }}>
            + Añadir carta
          </button>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Sidebar filtros */}
          <aside className="w-full shrink-0 lg:w-64">
            <div className="rounded-2xl p-5" style={{ background: '#161926', border: '1px solid rgba(255,255,255,0.07)' }}>
              <h3 className="mb-4 font-black text-sm uppercase tracking-widest" style={{ fontFamily: "'Orbitron', monospace", color: '#94a3b8' }}>Filtros</h3>
              <div className="mb-5">
                <label className="mb-2 block text-xs font-medium" style={{ color: '#475569' }}>Buscar</label>
                <div className="relative">
                  <input type="text" placeholder="Buscar carta..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full rounded-xl px-4 py-2.5 pl-10 text-sm outline-none" style={{ background: '#0d0f18', border: '1px solid rgba(255,255,255,0.08)', color: '#f1f5f9' }} />
                  <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#334155' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
              </div>
              <div>
                <label className="mb-3 block text-xs font-medium" style={{ color: '#475569' }}>Tipo</label>
                <div className="space-y-2">
                  {[{ value: 'todas', label: 'Todas' }, { value: 'pokemon', label: 'Pokémon' }, { value: 'futbol', label: 'Fútbol' }].map((option) => (
                    <button key={option.value} onClick={() => setTipoFilter(option.value)} className="w-full rounded-xl px-4 py-2.5 text-left text-sm font-semibold transition-all" style={tipoFilter === option.value ? { background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.3)', color: '#60a5fa' } : { background: 'transparent', border: '1px solid rgba(255,255,255,0.06)', color: '#475569' }}>
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            <div className="mb-4"><p className="text-sm" style={{ color: '#334155' }}>{filteredCartas.length} {filteredCartas.length === 1 ? 'carta' : 'cartas'} encontradas</p></div>
            {loadingCartas ? (
              <div className="flex items-center justify-center py-16"><p style={{ color: '#475569' }}>Cargando cartas...</p></div>
            ) : filteredCartas.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredCartas.map((carta) => (
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
                          <img src={carta.foto_carta} alt={carta.pokemon ? carta.pokemon.pokemon || '' : carta.futbol?.jugador || ''} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
                        ) : (
                          <div className="flex h-full items-center justify-center" style={{ color: '#334155' }}>
                            <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <span className="rounded-full px-2.5 py-0.5 text-xs font-medium text-white" style={{ background: carta.pokemon ? '#854d0e' : '#1d4ed8' }}>{carta.pokemon ? 'Pokémon' : 'Fútbol'}</span>
                        <h3 className="mt-2 truncate font-black text-sm" style={{ fontFamily: "'Orbitron', monospace", color: '#e2e8f0' }}>{carta.pokemon ? carta.pokemon.pokemon : carta.futbol?.jugador}</h3>
                        <p className="text-xs truncate mt-0.5" style={{ color: '#475569' }}>{carta.pokemon ? carta.pokemon.set_carta : carta.futbol?.equipo}</p>
                        {carta.precio_compra && <p className="mt-1 text-sm font-bold" style={{ color: '#4ade80' }}>{carta.precio_compra.toFixed(2)} €</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl py-16" style={{ background: '#161926', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p style={{ color: '#475569' }}>No tienes cartas todavía</p>
                <button onClick={() => { resetModal(); setModalAbierto(true); }} className="mt-4 rounded-xl px-4 py-2 text-sm font-medium transition hover:opacity-80" style={{ background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.2)', color: '#60a5fa' }}>Añadir primera carta</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal eliminar */}
      {cartaAEliminar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setCartaAEliminar(null)}>
          <div className="w-full max-w-md rounded-3xl p-8 shadow-2xl" style={{ background: '#161926', border: '1px solid rgba(255,255,255,0.1)' }} onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-black mb-4" style={{ fontFamily: "'Orbitron', monospace", color: '#f1f5f9' }}>¿Eliminar carta?</h2>
            <p className="text-sm mb-6" style={{ color: '#64748b' }}>¿Estás seguro que quieres eliminar <span className="font-bold" style={{ color: '#f1f5f9' }}>{getNombreCarta(cartaAEliminar)}</span>? Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <button onClick={() => setCartaAEliminar(null)} className="flex-1 rounded-xl py-3 text-sm font-semibold transition" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>Cancelar</button>
              <button onClick={handleEliminar} disabled={loadingEliminar} className="flex-1 rounded-xl py-3 text-sm font-bold transition hover:opacity-90 disabled:opacity-50" style={{ background: '#ef4444', color: '#fff' }}>{loadingEliminar ? 'Eliminando...' : 'Eliminar'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal añadir carta */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => { setModalAbierto(false); resetModal(); }}>
          <div className="w-full max-w-2xl rounded-3xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto" style={{ background: '#161926', border: '1px solid rgba(255,255,255,0.1)' }} onClick={(e) => e.stopPropagation()}>
            {/* Barra progreso */}
            <div className="mb-8 flex items-center gap-2">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-1.5 flex-1 rounded-full transition-all" style={{ background: paso >= n ? '#60a5fa' : 'rgba(255,255,255,0.08)' }} />
              ))}
            </div>

            {/* Paso 1 */}
            {paso === 1 && (
              <div>
                <h2 className="text-xl font-black mb-1" style={{ fontFamily: "'Orbitron', monospace", color: '#f1f5f9' }}>Añadir carta</h2>
                <p className="text-sm mb-8" style={{ color: '#475569' }}>¿Qué tipo de carta es?</p>
                <div className="grid grid-cols-2 gap-4">
                  <button type="button" onClick={() => { setTipoCarta('pokemon'); setPaso(2); }} className="rounded-xl py-6 text-sm font-bold transition" style={tipoCarta === 'pokemon' ? btnActive : btnInactive}>Pokémon</button>
                  <button type="button" onClick={() => { setTipoCarta('futbol'); setPaso(2); }} className="rounded-xl py-6 text-sm font-bold transition" style={tipoCarta === 'futbol' ? btnActive : btnInactive}>Fútbol</button>
                </div>
              </div>
            )}

            {/* Paso 2 */}
            {paso === 2 && (
              <div>
                <h2 className="text-xl font-black mb-1" style={{ fontFamily: "'Orbitron', monospace", color: '#f1f5f9' }}>Carta {tipoCarta === 'pokemon' ? 'Pokémon' : 'de Fútbol'}</h2>
                <p className="text-sm mb-8" style={{ color: '#475569' }}>Rellena los datos de la carta</p>
                <div className="space-y-5">
                  <div>
                    <label className={labelCls} style={labelStyle}>Foto de la carta</label>
                    <input type="file" accept="image/*" onChange={handleFoto} className="w-full rounded-xl px-4 py-2.5 text-sm file:mr-4 file:rounded-lg file:border-0 file:px-3 file:py-1 file:text-sm file:text-zinc-200 outline-none" style={{ ...inputStyle, color: '#94a3b8' }} />
                    {fotoPreview && <img src={fotoPreview} alt="Preview" className="mt-3 h-32 rounded-xl object-cover" />}
                  </div>
                  {tipoCarta === 'pokemon' && (<>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className={labelCls} style={labelStyle}>Pokémon *</label><input name="pokemon" type="text" value={form.pokemon} onChange={handleChange} required placeholder="Charizard" className={inputCls} style={inputStyle} /></div>
                      <div><label className={labelCls} style={labelStyle}>Número *</label><input name="numero" type="number" value={form.numero} onChange={handleChange} required placeholder="4" className={inputCls} style={inputStyle} /></div>
                    </div>
                    <div><label className={labelCls} style={labelStyle}>Set *</label><input name="set_carta" type="text" value={form.set_carta} onChange={handleChange} required placeholder="Base Set" className={inputCls} style={inputStyle} /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className={labelCls} style={labelStyle}>Rareza *</label><select name="id_rareza_fk" value={form.id_rareza_fk} onChange={handleChange} required className={selectCls} style={inputStyle}><option value="">Selecciona</option>{rarezas.map(r => <option key={r.id_rareza} value={r.id_rareza}>{r.rareza}</option>)}</select></div>
                      <div><label className={labelCls} style={labelStyle}>Idioma *</label><select name="id_idioma_fk" value={form.id_idioma_fk} onChange={handleChange} required className={selectCls} style={inputStyle}><option value="">Selecciona</option>{idiomas.map(i => <option key={i.id_idioma} value={i.id_idioma}>{i.idioma}</option>)}</select></div>
                    </div>
                  </>)}
                  {tipoCarta === 'futbol' && (<>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className={labelCls} style={labelStyle}>Jugador *</label><input name="jugador" type="text" value={form.jugador} onChange={handleChange} required placeholder="Carvajal" className={inputCls} style={inputStyle} /></div>
                      <div><label className={labelCls} style={labelStyle}>Equipo *</label><input name="equipo" type="text" value={form.equipo} onChange={handleChange} required placeholder="Real Madrid" className={inputCls} style={inputStyle} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className={labelCls} style={labelStyle}>Marca *</label><select name="id_marca_fk" value={form.id_marca_fk} onChange={handleChange} required className={selectCls} style={inputStyle}><option value="">Selecciona</option>{marcas.filter(m => m.nombre_marca !== 'Pokemon TCG').map(m => <option key={m.id_marca} value={m.id_marca}>{m.nombre_marca}</option>)}</select></div>
                      <div><label className={labelCls} style={labelStyle}>Colección *</label><input name="coleccion" type="text" value={form.coleccion} onChange={handleChange} required placeholder="Inception" className={inputCls} style={inputStyle} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className={labelCls} style={labelStyle}>Tipo de carta *</label><input name="tipo_carta_futbol" type="text" value={form.tipo_carta_futbol} onChange={handleChange} required placeholder="Base, Refractor..." className={inputCls} style={inputStyle} /></div>
                      <div><label className={labelCls} style={labelStyle}>Temporada *</label><input name="temporada" type="text" value={form.temporada} onChange={handleChange} required placeholder="24-25" className={inputCls} style={inputStyle} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className={labelCls} style={labelStyle}>Numeración</label><input name="numeracion" type="text" value={form.numeracion} onChange={handleChange} placeholder="/10" className={inputCls} style={inputStyle} /></div>
                      <div />
                    </div>
                    <div>
                      <p className={labelCls} style={labelStyle}>Características</p>
                      <div className="flex gap-6">
                        {[{ name: 'rookie', label: 'Rookie' }, { name: 'auto_firma', label: 'Auto' }, { name: 'relic', label: 'Relic' }].map(item => (
                          <label key={item.name} className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: '#94a3b8' }}>
                            <input type="checkbox" name={item.name} checked={form[item.name as keyof typeof form] as boolean} onChange={handleChange} className="w-4 h-4 rounded accent-blue-400" />
                            {item.label}
                          </label>
                        ))}
                      </div>
                    </div>
                  </>)}
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className={labelCls} style={labelStyle}>Fecha de compra</label><input name="fecha_compra" type="date" value={form.fecha_compra} onChange={handleChange} className={inputCls} style={inputStyle} /></div>
                    <div><label className={labelCls} style={labelStyle}>Precio (€) *</label><input name="precio_compra" type="number" step="0.01" value={form.precio_compra} onChange={handleChange} required placeholder="0.00" className={inputCls} style={inputStyle} /></div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setPaso(1)} className="rounded-xl px-4 py-3 text-sm font-semibold transition" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>Atrás</button>
                    <button type="button" onClick={() => setPaso(3)} className="flex-1 rounded-xl py-3 text-sm font-bold transition hover:opacity-90" style={{ background: '#f1f5f9', color: '#0d0f18' }}>Siguiente</button>
                  </div>
                </div>
              </div>
            )}

            {/* Paso 3 */}
            {paso === 3 && (
              <div>
                <h2 className="text-xl font-black mb-1" style={{ fontFamily: "'Orbitron', monospace", color: '#f1f5f9' }}>Gradeo</h2>
                <p className="text-sm mb-8" style={{ color: '#475569' }}>¿Está gradeada la carta?</p>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <button type="button" onClick={() => setPaso(4)} className="rounded-xl py-6 text-sm font-bold transition" style={btnInactive}>Sí, está gradeada</button>
                    <button type="button" disabled={loadingGuardar} onClick={() => handleGuardar(false)} className="rounded-xl py-6 text-sm font-bold transition disabled:opacity-50" style={btnInactive}>{loadingGuardar ? 'Guardando...' : 'No, guardar carta'}</button>
                  </div>
                  <button type="button" onClick={() => setPaso(2)} className="w-full rounded-xl py-3 text-sm font-semibold transition" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>Atrás</button>
                  {error && <div className="rounded-xl px-4 py-3 text-sm" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}>{error}</div>}
                </div>
              </div>
            )}

            {/* Paso 4 */}
            {paso === 4 && (
              <div>
                <h2 className="text-xl font-black mb-1" style={{ fontFamily: "'Orbitron', monospace", color: '#f1f5f9' }}>Datos de gradeo</h2>
                <p className="text-sm mb-8" style={{ color: '#475569' }}>Rellena los datos del gradeo</p>
                <div className="space-y-5">
                  <div>
                    <label className={labelCls} style={labelStyle}>Casa de gradeo</label>
                    <select name="id_casa_fk" value={form.id_casa_fk} onChange={handleChange} className={selectCls} style={inputStyle}>
                      <option value="">Selecciona casa</option>
                      {casas.map(c => <option key={c.id_casa} value={c.id_casa}>{c.nombre_casa}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls} style={labelStyle}>Número de gradeo</label>
                      <input name="numero_gradeo" type="number" value={form.numero_gradeo} onChange={handleChange} placeholder="12345678" className={inputCls} style={inputStyle} />
                    </div>
                    <div>
                      <label className={labelCls} style={labelStyle}>Nota de gradeo</label>
                      <input
                        name="nota_gradeo"
                        type="text"
                        value={form.nota_gradeo}
                        onChange={handleChange}
                        placeholder="PSA 10"
                        disabled={form.black_label}
                        className={inputCls}
                        style={{
                          ...inputStyle,
                          opacity: form.black_label ? 0.5 : 1,
                          cursor: form.black_label ? 'not-allowed' : 'text',
                        }}
                      />
                    </div>
                  </div>

                  {/* Black Label — solo visible si la casa es Beckett */}
                  {esBeckett && (
                    <div
                      className="flex items-start gap-3 rounded-xl p-4"
                      style={{
                        background: 'rgba(0,0,0,0.35)',
                        border: form.black_label
                          ? '1px solid rgba(250,204,21,0.45)'
                          : '1px solid rgba(255,255,255,0.1)',
                      }}
                    >
                      <input
                        type="checkbox"
                        name="black_label"
                        id="black_label"
                        checked={form.black_label}
                        onChange={handleChange}
                        className="mt-0.5 w-4 h-4 rounded flex-shrink-0"
                        style={{ accentColor: '#facc15' }}
                      />
                      <div>
                        <label htmlFor="black_label" className="text-sm font-bold cursor-pointer" style={{ color: '#facc15' }}>
                          Black Label
                        </label>
                        <p className="text-xs mt-0.5" style={{ color: '#78716c' }}>
                          Un Black Label de Beckett siempre tiene nota 10. Se asignará automáticamente.
                        </p>
                      </div>
                    </div>
                  )}

                  {error && <div className="rounded-xl px-4 py-3 text-sm" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}>{error}</div>}
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setPaso(3)} className="rounded-xl px-4 py-3 text-sm font-semibold transition" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>Atrás</button>
                    <button type="button" disabled={loadingGuardar} onClick={() => handleGuardar(true)} className="flex-1 rounded-xl py-3 text-sm font-bold transition hover:opacity-90 disabled:opacity-50" style={{ background: '#f1f5f9', color: '#0d0f18' }}>{loadingGuardar ? 'Guardando...' : 'Guardar carta'}</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&display=swap');`}</style>
    </div>
  );
}

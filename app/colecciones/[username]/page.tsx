'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

type Coleccion = {
  id_coleccion: string;
  nombre_coleccion: string;
  foto_coleccion: string | null;
  fecha_creacion: string;
};

// Nombres exactos con los que se crean las colecciones del sistema en la BD
const SYSTEM_NAMES = ['Favoritas', 'Wishlist', 'En Venta'];
const SYSTEM_FOTOS: Record<string, string> = {
  'Favoritas': '/images/colecciones/favoritas.png',
  'Wishlist': '/images/colecciones/wishlist.png',
  'En Venta': '/images/colecciones/en-venta.png',
};

export default function ColeccionesPage() {
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;

  const [coleccionesSistema, setColeccionesSistema] = useState<Coleccion[]>([]);
  const [colecciones, setColecciones] = useState<Coleccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [loadingGuardar, setLoadingGuardar] = useState(false);
  const [error, setError] = useState('');
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [nombre, setNombre] = useState('');

  useEffect(() => {
    document.title = 'Colecciones | Card Manager';
    fetchColecciones();
  }, []);

  async function fetchColecciones() {
    try {
      const res = await fetch('/api/colecciones');
      const data = await res.json();
      const todas: Coleccion[] = data.colecciones || [];
      setColeccionesSistema(todas.filter(c => SYSTEM_NAMES.includes(c.nombre_coleccion)));
      setColecciones(todas.filter(c => !SYSTEM_NAMES.includes(c.nombre_coleccion)));
    } catch {}
    finally { setLoading(false); }
  }

  const handleFoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setFotoFile(file); setFotoPreview(URL.createObjectURL(file)); }
  };

  const handleGuardar = async () => {
    if (!nombre.trim()) { setError('El nombre es obligatorio'); return; }
    setLoadingGuardar(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('nombre_coleccion', nombre);
      if (fotoFile) formData.append('foto_coleccion', fotoFile);
      const res = await fetch('/api/colecciones', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) { setError(data.mensaje || 'Error al crear colección'); }
      else {
        setModalAbierto(false);
        setNombre(''); setFotoFile(null); setFotoPreview(null);
        fetchColecciones();
      }
    } catch { setError('Error al conectar con la API'); }
    finally { setLoadingGuardar(false); }
  };

  const ColCard = ({ id, name, foto, onClick }: { id: string; name: string; foto: string | null; onClick: () => void }) => (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
      style={{ background: '#161926', border: '1px solid rgba(255,255,255,0.07)' }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(96,165,250,0.25)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)'; }}
    >
      <div className="relative overflow-hidden" style={{ aspectRatio: '1/1' }}>
        {foto ? (
          <img src={foto} alt={name} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
        ) : (
          <div className="flex h-full w-full items-center justify-center" style={{ background: '#0d0f18' }}>
            <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#334155' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <div className="absolute inset-0" style={{ background: 'rgba(13,15,24,0.3)' }} />
      </div>
      <div className="py-4 px-3">
        <h2 className="text-center text-sm font-bold" style={{ color: '#e2e8f0' }}>{name}</h2>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen text-white px-4 pt-8 pb-12 sm:px-6 lg:px-10 xl:px-20" style={{ background: '#0d0f18' }}>
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-12 flex items-start justify-between gap-4">
          <div>
            <span className="text-xs font-bold tracking-widest uppercase block mb-3" style={{ color: '#60a5fa' }}>Mi colección</span>
            <h1 className="text-3xl md:text-4xl font-black mb-2" style={{ fontFamily: "'Orbitron', monospace", color: '#f1f5f9' }}>Colecciones</h1>
            <p className="text-sm" style={{ color: '#475569' }}>Organiza y administra tus colecciones de cartas</p>
          </div>
          <button
            onClick={() => setModalAbierto(true)}
            className="flex-shrink-0 rounded-xl px-5 py-3 text-sm font-bold tracking-wide transition-all hover:opacity-90 hover:scale-105"
            style={{ background: '#f1f5f9', color: '#0d0f18' }}
          >
            + Añadir colección
          </button>
        </div>

        {/* Colecciones fijas */}
        <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#334155' }}>Colecciones del sistema</p>
        <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4 mb-10">
          {coleccionesSistema.map((col) => (
            <ColCard
              key={col.id_coleccion}
              id={col.id_coleccion}
              name={col.nombre_coleccion}
              foto={SYSTEM_FOTOS[col.nombre_coleccion] || col.foto_coleccion}
              onClick={() => router.push(`/colecciones/${username}/${col.id_coleccion}`)}
            />
          ))}
        </div>

        {/* Colecciones del usuario */}
        <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#334155' }}>Mis colecciones</p>
        {loading ? (
          <p className="text-sm" style={{ color: '#475569' }}>Cargando colecciones...</p>
        ) : colecciones.length === 0 ? (
          <p className="text-sm italic" style={{ color: '#475569' }}>No tienes colecciones todavía. ¡Crea una!</p>
        ) : (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
            {colecciones.map((col) => (
              <ColCard
                key={col.id_coleccion}
                id={col.id_coleccion}
                name={col.nombre_coleccion}
                foto={col.foto_coleccion}
                onClick={() => router.push(`/colecciones/${username}/${col.id_coleccion}`)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal añadir colección */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setModalAbierto(false)}>
          <div className="w-full max-w-md rounded-3xl p-8 shadow-2xl" style={{ background: '#161926', border: '1px solid rgba(255,255,255,0.1)' }} onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-black mb-6" style={{ fontFamily: "'Orbitron', monospace", color: '#f1f5f9' }}>Nueva colección</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-xs uppercase tracking-widest mb-1.5" style={{ color: '#475569' }}>Nombre *</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Mi colección..."
                  className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition"
                  style={{ background: '#0d0f18', border: '1px solid rgba(255,255,255,0.1)', color: '#f1f5f9' }}
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest mb-1.5" style={{ color: '#475569' }}>Foto</label>
                <input type="file" accept="image/*" onChange={handleFoto} className="w-full rounded-xl px-4 py-2.5 text-sm text-zinc-100 file:mr-4 file:rounded-lg file:border-0 file:px-3 file:py-1 file:text-sm file:text-zinc-200 outline-none" style={{ background: '#0d0f18', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }} />
                {fotoPreview && <img src={fotoPreview} alt="Preview" className="mt-3 w-full rounded-xl object-contain max-h-64" style={{ background: "#0d0f18" }} />}
              </div>
              {error && <div className="rounded-xl px-4 py-3 text-sm" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}>{error}</div>}
              <div className="flex gap-3 pt-2">
                <button onClick={() => setModalAbierto(false)} className="flex-1 rounded-xl py-3 text-sm font-semibold transition" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>Cancelar</button>
                <button onClick={handleGuardar} disabled={loadingGuardar} className="flex-1 rounded-xl py-3 text-sm font-bold transition hover:opacity-90 disabled:opacity-50" style={{ background: '#f1f5f9', color: '#0d0f18' }}>
                  {loadingGuardar ? 'Guardando...' : 'Crear colección'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&display=swap');`}</style>
    </div>
  );
}

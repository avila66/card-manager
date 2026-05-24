'use client';

import { useEffect, useState, useParams } from 'react';
import { useParams as useNextParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const params = useNextParams();
  const router = useRouter();
  const username = params.username as string;
  const [totalCartas, setTotalCartas] = useState<number | null>(null);
  const [ultimaCarta, setUltimaCarta] = useState<string | null>(null);

  useEffect(() => {
    document.title = `Dashboard | Card Manager`;
    async function fetchStats() {
      try {
        const res = await fetch('/api/cartas');
        const data = await res.json();
        if (data.cartas) {
          setTotalCartas(data.cartas.length);
          if (data.cartas.length > 0) {
            const ultima = data.cartas[data.cartas.length - 1];
            const nombre = ultima.pokemon?.pokemon || ultima.futbol?.jugador || 'Carta';
            setUltimaCarta(nombre);
          }
        }
      } catch {}
    }
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen text-white px-4 pt-8 pb-12 sm:px-6 lg:px-10" style={{ background: '#0d0f18' }}>
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-10">
          <span className="text-xs font-bold tracking-widest uppercase block mb-3" style={{ color: '#60a5fa' }}>Panel de control</span>
          <h1 className="text-3xl md:text-4xl font-black mb-2" style={{ fontFamily: "'Orbitron', monospace", color: '#f1f5f9' }}>
            Bienvenido, <span style={{ color: '#60a5fa' }}>{username}</span>
          </h1>
          <p className="text-sm" style={{ color: '#475569' }}>Gestiona tu colección de cartas desde aquí</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
          <div className="rounded-2xl p-6" style={{ background: '#161926', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#475569' }}>Total cartas</p>
            <p className="text-5xl font-black" style={{ fontFamily: "'Orbitron', monospace", color: '#f1f5f9' }}>
              {totalCartas === null ? '—' : totalCartas}
            </p>
          </div>
          <div className="rounded-2xl p-6" style={{ background: '#161926', border: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#475569' }}>Última carta añadida</p>
            <p className="text-2xl font-black truncate" style={{ fontFamily: "'Orbitron', monospace", color: '#f1f5f9' }}>
              {ultimaCarta || 'N/A'}
            </p>
          </div>
        </div>

        {/* Accesos rápidos */}
        <div className="rounded-2xl p-6 mb-10" style={{ background: '#161926', border: '1px solid rgba(255,255,255,0.07)' }}>
          <h3 className="text-sm font-bold uppercase tracking-widest mb-5" style={{ fontFamily: "'Orbitron', monospace", color: '#94a3b8' }}>Accesos rápidos</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href={`/cartas/${username}`} className="flex items-center gap-3 rounded-xl px-5 py-4 text-sm font-semibold transition-all hover:scale-[1.02]" style={{ background: 'rgba(0,180,255,0.06)', border: '1px solid rgba(0,180,255,0.15)', color: '#7ec8e3' }}>
              🃏 Ver mis cartas
            </Link>
            <Link href={`/colecciones/${username}`} className="flex items-center gap-3 rounded-xl px-5 py-4 text-sm font-semibold transition-all hover:scale-[1.02]" style={{ background: 'rgba(0,180,255,0.06)', border: '1px solid rgba(0,180,255,0.15)', color: '#7ec8e3' }}>
              📚 Ver mis colecciones
            </Link>
          </div>
        </div>

        {/* Bienvenida */}
        <div className="rounded-2xl p-6" style={{ background: '#161926', border: '1px solid rgba(255,255,255,0.07)' }}>
          <h3 className="text-sm font-bold uppercase tracking-widest mb-3" style={{ fontFamily: "'Orbitron', monospace", color: '#94a3b8' }}>¡Bienvenido a Card Manager!</h3>
          <p className="text-sm leading-relaxed" style={{ color: '#475569' }}>
            Con Card Manager puedes registrar tus colecciones y cartas de una forma cómoda y digital. Organiza tu inventario, controla cambios y mantente al día con tus sets favoritos. Puedes navegar usando la barra de navegación superior.
          </p>
        </div>
      </div>

      <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&display=swap');`}</style>
    </div>
  );
}

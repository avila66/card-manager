'use client';

import { useEffect, useState } from 'react';
import supabase from '@/utils/supabase';

const FEATURES = [
  { icon: '📊', title: 'Seguimiento de progreso', description: 'Mantén un seguimiento de tu progreso en cada set y en tu colección completa.' },
  { icon: '📋', title: 'Todos los detalles', description: 'Añade cualquier carta con detalles, fotos y notas personalizadas.' },
  { icon: '🔗', title: 'Comparte tu colección', description: 'Muestra tu colección o compara cartas para realizar intercambios.' },
  { icon: '🔍', title: 'Encuentra lo que tienes', description: 'Busca exactamente las cartas registradas sin rebuscar en tus cajas.' },
];

const FAQS = [
  { q: '¿Cómo garantizáis la autenticidad de las cartas?', a: 'Todas nuestras cartas pasan por un proceso de verificación con selladores certificados. Embalamos con protectores de manica y top-loaders para asegurar que lleguen en condiciones perfectas.' },
  { q: '¿Puedo mezclar cartas de Pokémon y fútbol en mi colección?', a: '¡Claro! Card Manager soporta sets de Pokémon, Topps Football y cualquier otro juego de cartas que quieras registrar, todo desde el mismo panel.' },
  { q: '¿Cómo funciona el seguimiento de progreso?', a: 'Por cada set registrado puedes ver cuántas cartas tienes vs. el total del set, con barras de progreso y estadísticas de rareza.' },
  { q: '¿Puedo compartir mi colección con otros usuarios?', a: 'Sí, puedes generar un enlace público de tu colección para mostrarla o comparar cartas para intercambios directamente en la plataforma.' },
  { q: '¿Es gratuito?', a: 'Card Manager es completamente gratuito. Crea tu cuenta y empieza a registrar tu colección sin límites.' },
];

export default function InicioPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'Card Manager | Tu colección de cartas';
  }, []);

  const handleGoogleLogin = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  return (
    <div className="min-h-screen text-white overflow-x-hidden" style={{ background: '#0d0f18' }}>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 py-32 overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="absolute top-0 left-0 w-[500px] h-[500px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(250,204,21,0.05) 0%, transparent 65%)' }} />

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#60a5fa' }} />
            Pokémon TCG · Topps · Panini
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6" style={{ fontFamily: "'Orbitron', 'JetBrains Mono', monospace", color: '#f1f5f9' }}>
            Tu colección<br /><span style={{ color: '#60a5fa' }}>comienza aquí.</span>
          </h1>

          <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: '#64748b' }}>
            Base de datos y rastreador de cartas de Pokémon y fútbol. Inicia sesión con Google para empezar.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="inline-flex items-center justify-center gap-3 rounded-xl px-8 py-3.5 text-sm font-bold tracking-wide transition-all hover:opacity-90 hover:scale-105 disabled:opacity-50"
              style={{ background: '#f1f5f9', color: '#0d0f18' }}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {loading ? 'Redirigiendo...' : 'Iniciar sesión con Google'}
            </button>
          </div>

          {/* Abanico de cartas */}
          {(() => {
            const realCards = [
              { src: '/images/inicio/pikachumegadream.jpg', name: 'Pikachu Mega Dream', rotate: -18, translateY: 40 },
              { src: '/images/inicio/charizard151.jpg', name: 'Charizard 151', rotate: -6, translateY: -10 },
              { src: '/images/inicio/judeauto.png', name: 'Bellingham Auto', rotate: 6, translateY: -10 },
              { src: '/images/inicio/modricauto.jpg', name: 'Modrić Auto', rotate: 18, translateY: 40 },
            ];
            return (
              <div className="flex justify-center items-end" style={{ paddingBottom: '32px' }}>
                {realCards.map((card) => (
                  <div
                    key={card.name}
                    className="relative transition-all duration-300 rounded-2xl overflow-hidden flex-shrink-0"
                    style={{ width: '180px', height: '252px', transform: `rotate(${card.rotate}deg) translateY(${card.translateY}px)`, boxShadow: '0 12px 40px rgba(0,0,0,0.7)', marginLeft: '-12px', marginRight: '-12px', zIndex: Math.abs(card.rotate) === 18 ? 1 : 2 }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = `rotate(${card.rotate}deg) translateY(${card.translateY - 18}px) scale(1.06)`; (e.currentTarget as HTMLDivElement).style.zIndex = '10'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = `rotate(${card.rotate}deg) translateY(${card.translateY}px)`; (e.currentTarget as HTMLDivElement).style.zIndex = String(Math.abs(card.rotate) === 18 ? 1 : 2); }}
                  >
                    <img src={card.src} alt={card.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative px-4 py-32" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-20">
            <span className="text-xs font-bold tracking-widest uppercase block mb-4" style={{ color: '#60a5fa' }}>Por qué Card Manager</span>
            <h2 className="text-3xl md:text-4xl font-black" style={{ fontFamily: "'Orbitron', monospace", color: '#f1f5f9' }}>Todo lo que necesitas.</h2>
          </div>
          <div className="flex flex-col divide-y" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            {FEATURES.map((f, i) => (
              <div key={f.title} className="flex flex-col md:flex-row md:items-start gap-6 md:gap-12 py-12">
                <span className="flex-shrink-0 leading-none select-none" style={{ fontFamily: "'Orbitron', monospace", fontSize: '4.5rem', fontWeight: 900, color: 'rgba(255,255,255,0.04)', lineHeight: 1, minWidth: '5rem' }}>{String(i + 1).padStart(2, '0')}</span>
                <div className="flex gap-5 items-start pt-1">
                  <span className="text-2xl flex-shrink-0 mt-0.5">{f.icon}</span>
                  <div>
                    <h3 className="font-bold mb-2 text-base" style={{ color: '#e2e8f0', fontFamily: "'Orbitron', monospace" }}>{f.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: '#475569' }}>{f.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section className="px-4 py-20 text-center max-w-4xl mx-auto">
        <p className="text-2xl md:text-3xl leading-relaxed font-light italic" style={{ color: '#94a3b8' }}>
          Hay cartas que valen dinero. Y hay cartas que valen <span className="font-bold not-italic" style={{ color: '#f1f5f9' }}>recuerdos</span>. En Card Manager guardamos las dos. Porque una colección de verdad va mucho más allá del <span className="font-bold not-italic" style={{ color: '#60a5fa' }}>precio</span>.
        </p>
      </section>

      {/* FAQ */}
      <section className="px-4 py-20 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold tracking-widest uppercase block mb-3" style={{ color: '#60a5fa' }}>FAQ</span>
          <h2 className="text-3xl md:text-4xl font-black" style={{ fontFamily: "'Orbitron', monospace", color: '#f1f5f9' }}>¿Tienes Preguntas?<br />Tenemos Respuestas</h2>
        </div>
        <div className="flex flex-col gap-3">
          {FAQS.map((faq, i) => (
            <div key={i} className="rounded-xl overflow-hidden transition-all" style={{ background: '#161926', border: `1px solid ${openFaq === i ? 'rgba(96,165,250,0.35)' : 'rgba(255,255,255,0.07)'}` }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 text-sm md:text-base font-semibold" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e2e8f0' }}>
                {faq.q}
                <span className="text-xl flex-shrink-0 transition-transform duration-300" style={{ color: '#60a5fa', transform: openFaq === i ? 'rotate(45deg)' : 'none', display: 'inline-block' }}>+</span>
              </button>
              {openFaq === i && <div className="px-6 pb-5 text-sm leading-relaxed" style={{ color: '#64748b' }}>{faq.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden px-4 py-24 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black mb-6" style={{ fontFamily: "'Orbitron', monospace", color: '#f1f5f9' }}>¿Listo para empezar?</h2>
          <p className="mb-10 text-lg" style={{ color: '#64748b' }}>Únete a nuestra comunidad de coleccionistas y gestiona tu colección de cartas de forma fácil y organizada.</p>
          <button onClick={handleGoogleLogin} disabled={loading} className="inline-flex items-center justify-center gap-3 rounded-xl px-10 py-4 text-base font-bold tracking-wide transition-all hover:opacity-90 hover:scale-105 disabled:opacity-50" style={{ background: '#f1f5f9', color: '#0d0f18' }}>
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? 'Redirigiendo...' : 'Iniciar sesión con Google'}
          </button>
        </div>
      </section>

      <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&display=swap');`}</style>
    </div>
  );
}

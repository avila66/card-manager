'use client';

export default function AyudaPage() {
  const secciones = [
    { icon: '🏠', title: 'Inicio', desc: 'Página de bienvenida con descripción general de la aplicación y acceso al login con Google.' },
    { icon: '🔐', title: 'Login', desc: 'Accede a tu cuenta usando tu cuenta de Google. No necesitas contraseña.' },
    { icon: '📊', title: 'Dashboard', desc: 'Panel de control personal con resumen de tu colección, cartas totales y última carta añadida.' },
    { icon: '🃏', title: 'Cartas', desc: 'Galería completa de todas tus cartas con filtros, búsqueda, detalle y eliminación.' },
    { icon: '📚', title: 'Colecciones', desc: 'Crea y gestiona tus colecciones. Incluye colecciones fijas de Favoritos, Wishlist y En Venta.' },
  ];

  const tips = [
    'Usa el Dashboard para un resumen rápido de tu colección',
    'Organiza tus cartas en colecciones para mejor control',
    'Al añadir una carta puedes indicar si está gradeada y por qué casa',
    'El gráfico de evolución del valor es único para cada carta',
    'Puedes eliminar cartas desde la galería con el botón de papelera',
  ];

  return (
    <div className="min-h-screen text-white px-4 pt-8 pb-12 sm:px-6 lg:px-8" style={{ background: '#0d0f18' }}>
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

      <div className="relative z-10 mx-auto max-w-4xl">
        <div className="mb-12">
          <span className="text-xs font-bold tracking-widest uppercase block mb-3" style={{ color: '#60a5fa' }}>Documentación</span>
          <h1 className="text-3xl md:text-4xl font-black mb-2" style={{ fontFamily: "'Orbitron', monospace", color: '#f1f5f9' }}>Centro de Ayuda</h1>
          <p className="text-sm" style={{ color: '#475569' }}>Conoce cada sección de Card Manager</p>
        </div>

        <div className="space-y-3 mb-12">
          {secciones.map((s) => (
            <div key={s.title} className="rounded-2xl p-5 transition-all hover:-translate-y-0.5" style={{ background: '#161926', border: '1px solid rgba(255,255,255,0.07)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(96,165,250,0.2)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.07)'; }}
            >
              <div className="flex items-start gap-4">
                <span className="text-2xl mt-0.5">{s.icon}</span>
                <div>
                  <h3 className="font-bold mb-1 text-sm" style={{ color: '#e2e8f0', fontFamily: "'Orbitron', monospace" }}>{s.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#475569' }}>{s.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl p-6" style={{ background: '#161926', border: '1px solid rgba(96,165,250,0.15)' }}>
          <h2 className="font-bold mb-4 text-sm" style={{ color: '#60a5fa', fontFamily: "'Orbitron', monospace" }}>Consejos útiles</h2>
          <ul className="space-y-2">
            {tips.map((tip) => (
              <li key={tip} className="flex gap-3 text-sm" style={{ color: '#475569' }}>
                <span style={{ color: '#60a5fa' }}>→</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&display=swap');`}</style>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/utils/supabase';

export default function CompletarPerfilPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState('');
  const [form, setForm] = useState({ nombre_usuario: '', pais: '', ciudad: '' });

  useEffect(() => {
    document.title = 'Completar perfil | Card Manager';
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push('/login');
      else setUserId(data.user.id);
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/completar-perfil', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, id_usuario: userId }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.mensaje || 'Error al guardar perfil'); }
      else { localStorage.setItem('username', form.nombre_usuario); router.push(`/dashboard/${form.nombre_usuario}`); }
    } catch { setError('Error al conectar con la API'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 text-white" style={{ background: '#0d0f18' }}>
      <div className="fixed inset-0 z-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
      <div className="fixed top-0 left-0 w-[500px] h-[500px] pointer-events-none z-0" style={{ background: 'radial-gradient(circle, rgba(96,165,250,0.04) 0%, transparent 65%)' }} />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#60a5fa' }} />
            Card Manager
          </div>
          <h1 className="text-4xl font-black mb-3" style={{ fontFamily: "'Orbitron', monospace", color: '#f1f5f9' }}>
            Completa<br /><span style={{ color: '#60a5fa' }}>tu perfil.</span>
          </h1>
          <p className="text-sm" style={{ color: '#64748b' }}>Necesitamos un par de datos más para configurar tu cuenta</p>
        </div>

        <div className="rounded-2xl p-8" style={{ background: '#161926', border: '1px solid rgba(255,255,255,0.07)' }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              { name: 'nombre_usuario', label: 'Nombre de usuario *', placeholder: 'oripony67', required: true },
              { name: 'pais', label: 'País *', placeholder: 'España', required: true },
              { name: 'ciudad', label: 'Ciudad', placeholder: 'Madrid', required: false },
            ].map(f => (
              <div key={f.name}>
                <label className="block text-xs uppercase tracking-widest mb-1.5" style={{ color: '#475569' }}>{f.label}</label>
                <input
                  name={f.name}
                  type="text"
                  value={form[f.name as keyof typeof form]}
                  onChange={handleChange}
                  required={f.required}
                  placeholder={f.placeholder}
                  className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition"
                  style={{ background: '#0d0f18', border: '1px solid rgba(255,255,255,0.08)', color: '#f1f5f9' }}
                />
              </div>
            ))}

            {error && <div className="rounded-xl px-4 py-3 text-sm" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}>{error}</div>}

            <button type="submit" disabled={loading} className="w-full rounded-xl py-3.5 text-sm font-bold tracking-wide transition hover:opacity-90 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100" style={{ background: '#f1f5f9', color: '#0d0f18' }}>
              {loading ? 'Guardando...' : 'Guardar y continuar'}
            </button>
          </form>
        </div>
      </div>

      <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&display=swap');`}</style>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    correo: '',
    contrasena: '',
  });

  useEffect(() => {
    document.title = 'Login | Card Manager';
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.correo, password: form.contrasena }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.mensaje || 'Error al iniciar sesión');
      } else {
        localStorage.setItem('username', data.nombre_usuario);
        router.push(`/indice/${data.nombre_usuario}`);
      }
    } catch {
      setError('Error al conectar con la API');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500';

  const labelClass = 'block text-xs uppercase tracking-widest text-zinc-400 mb-1.5';

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-zinc-900">
      <div className="w-full max-w-md rounded-3xl border border-zinc-700 bg-zinc-950 p-8 shadow-2xl">
        <div className="mb-8">
          <h1 className="font-[family-name:var(--font-geist-mono)] text-2xl font-bold text-white">
            Iniciar sesión
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Accede a tu cuenta de Card Manager
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={labelClass}>Correo *</label>
            <input
              name="correo"
              type="email"
              value={form.correo}
              onChange={handleChange}
              required
              placeholder="ejemplo@gmail.com"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Contraseña *</label>
            <input
              name="contrasena"
              type="password"
              value={form.contrasena}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className={inputClass}
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-800 bg-red-950/50 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl border border-zinc-600 bg-zinc-800 py-3 text-sm font-semibold text-white transition hover:border-zinc-400 hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Iniciar sesión'}
          </button>

          <p className="text-center text-sm text-zinc-500">
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="text-[#01afeb] hover:text-[#01a3ec]/80 transition">
              Regístrate
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

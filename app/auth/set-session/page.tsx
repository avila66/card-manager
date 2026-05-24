'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SetSessionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const username = searchParams.get('username');
    if (username) {
      localStorage.setItem('username', username);
      router.replace(`/dashboard/${username}`);
    } else {
      router.replace('/login');
    }
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950">
      <p className="text-zinc-400">Iniciando sesión...</p>
    </div>
  );
}

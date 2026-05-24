"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import supabase from "@/utils/supabase";

const authRoutes = ["/login", "/register", "/inicio", "/completar-perfil"];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [username, setUsername] = useState('');
  const isAuthPage = authRoutes.includes(pathname);

  useEffect(() => {
    const stored = localStorage.getItem('username');
    if (stored) setUsername(stored);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('username');
    router.push('/inicio');
  };

  const navItems = [
    { label: "Inicio", href: `/dashboard/${username}` },
    { label: "Colecciones", href: `/colecciones/${username}` },
    { label: "Cartas", href: `/cartas/${username}` },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{ background: '#0d0f18', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">

          {!isAuthPage && (
            <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
              <button
                type="button"
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
                onClick={() => setMobileOpen((prev) => !prev)}
                className="inline-flex items-center justify-center rounded-lg p-2 transition-all"
                style={{ background: 'rgba(0,180,255,0.06)', border: '1px solid rgba(0,180,255,0.2)', color: '#7ec8e3' }}
              >
                <span className="sr-only">Abrir menú principal</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className={`w-5 h-5 ${mobileOpen ? "hidden" : "block"}`}>
                  <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className={`w-5 h-5 ${mobileOpen ? "block" : "hidden"}`}>
                  <path d="M6 18 18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          )}

          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <Link href={isAuthPage ? "/inicio" : `/dashboard/${username}`} className="flex shrink-0 items-center gap-2.5 group">
              <div className="rounded-lg overflow-hidden transition-all duration-300 group-hover:shadow-[0_0_16px_rgba(0,180,255,0.3)]" style={{ border: '1px solid rgba(0,180,255,0.2)' }}>
                <Image src="/CMLogo.jpg" alt="Card Manager" width={28} height={28} className="h-7 w-7 object-cover" />
              </div>
              <span className="text-sm font-bold tracking-widest uppercase" style={{ fontFamily: "'Orbitron', monospace", color: '#60a5fa' }}>
                Card Manager
              </span>
            </Link>

            {!isAuthPage && (
              <div className="hidden sm:ml-8 sm:flex sm:items-center sm:gap-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className="rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200"
                      style={{
                        background: isActive ? 'rgba(0,180,255,0.12)' : 'transparent',
                        border: `1px solid ${isActive ? 'rgba(0,180,255,0.35)' : 'transparent'}`,
                        color: isActive ? '#00b8d9' : '#94a3b8',
                      }}
                      onMouseEnter={(e) => { if (!isActive) { (e.currentTarget as HTMLAnchorElement).style.color = '#e0f4ff'; (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(0,180,255,0.06)'; } }}
                      onMouseLeave={(e) => { if (!isActive) { (e.currentTarget as HTMLAnchorElement).style.color = '#94a3b8'; (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; } }}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {!isAuthPage && (
            <div className="absolute inset-y-0 right-0 flex items-center gap-2 sm:static sm:inset-auto sm:ml-6">
              <Link
                href="/ayuda"
                className="hidden sm:inline-flex rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200"
                style={{ background: 'rgba(0,180,255,0.06)', border: '1px solid rgba(0,180,255,0.2)', color: '#7ec8e3' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(0,180,255,0.12)'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(0,180,255,0.4)'; (e.currentTarget as HTMLAnchorElement).style.color = '#fff'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(0,180,255,0.06)'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(0,180,255,0.2)'; (e.currentTarget as HTMLAnchorElement).style.color = '#7ec8e3'; }}
              >
                Ayuda
              </Link>
              <button
                onClick={handleLogout}
                className="hidden sm:inline-flex rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200"
                style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.12)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(239,68,68,0.4)'; (e.currentTarget as HTMLButtonElement).style.color = '#fff'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.06)'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(239,68,68,0.2)'; (e.currentTarget as HTMLButtonElement).style.color = '#f87171'; }}
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>

      {!isAuthPage && (
        <div
          id="mobile-menu"
          className={`${mobileOpen ? "block" : "hidden"} sm:hidden`}
          style={{ background: 'rgba(10,12,20,0.97)', borderBottom: '1px solid rgba(0,180,255,0.1)', backdropFilter: 'blur(12px)' }}
        >
          <div className="space-y-1 px-3 pb-4 pt-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-4 py-3 text-sm font-medium transition-all"
                  style={{
                    background: isActive ? 'rgba(0,180,255,0.12)' : 'transparent',
                    border: `1px solid ${isActive ? 'rgba(0,180,255,0.3)' : 'rgba(0,180,255,0.08)'}`,
                    color: isActive ? '#00b8d9' : '#94a3b8',
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="block w-full rounded-lg px-4 py-3 text-left text-sm font-medium transition-all"
              style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', color: '#f87171' }}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&display=swap');
      `}</style>
    </nav>
  );
}

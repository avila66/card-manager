"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const hiddenRoutes = ["/login", "/register", "/inicio", "/completar-perfil"];

export default function Footer() {
  const pathname = usePathname();
  const [username, setUsername] = useState('');
  const isAuthPage = hiddenRoutes.includes(pathname);

  useEffect(() => {
    const stored = localStorage.getItem('username');
    if (stored) setUsername(stored);
  }, []);

  const footerLinks = [
    { label: "Inicio", href: `/dashboard/${username}` },
    { label: "Colecciones", href: `/colecciones/${username}` },
    { label: "Cartas", href: `/cartas/${username}` },
  ];

  const socials = [
    { label: "Facebook", href: '#', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg> },
    { label: "Instagram", href: '#', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M17 2H7a5 5 0 0 0-5 5v10a5 5 0 0 0 5 5h10a5 5 0 0 0 5-5V7a5 5 0 0 0-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M16 11.37a4 4 0 1 1-7.914 1.173A4 4 0 0 1 16 11.37m1.5-4.87h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg> },
    { label: "LinkedIn", href: '#', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6M6 9H2v12h4zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg> },
    { label: "Twitter / X", href: '#', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg> },
    { label: "GitHub", href: "https://github.com/avila66/card-manager", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M9 18c-4.51 2-5-2-7-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg> },
  ];

  return (
    <footer className="w-full" style={{ background: 'rgba(8,10,18,0.98)', borderTop: '1px solid rgba(0,180,255,0.1)' }}>
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-8" style={{ borderBottom: '1px solid rgba(0,180,255,0.08)' }}>
          <Link href="/" className="flex items-center gap-3 group">
            <div className="rounded-xl overflow-hidden transition-all duration-300 group-hover:shadow-[0_0_16px_rgba(0,180,255,0.25)]" style={{ border: '1px solid rgba(0,180,255,0.2)' }}>
              <Image src="/CMLogo.jpg" alt="Card Manager" width={36} height={36} className="h-9 w-9 object-cover" />
            </div>
            <span className="text-sm font-bold tracking-widest uppercase" style={{ fontFamily: "'Orbitron', monospace", color: '#60a5fa' }}>
              Card Manager
            </span>
          </Link>

          {!isAuthPage && (
            <div className="flex flex-wrap items-center justify-center gap-1">
              {footerLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200"
                  style={{ color: '#64748b' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#00b8d9'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#64748b'; }}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                className="flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-200"
                style={{ background: 'rgba(0,180,255,0.06)', border: '1px solid rgba(0,180,255,0.12)', color: '#64748b' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#00b8d9'; (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(0,180,255,0.12)'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(0,180,255,0.3)'; (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#64748b'; (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(0,180,255,0.06)'; (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(0,180,255,0.12)'; (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)'; }}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs" style={{ color: '#334155' }}>
            Copyright © {new Date().getFullYear()} Card Manager. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#00b8d9' }} />
            <span className="text-xs" style={{ color: '#334155' }}>Pokémon · Topps Football · Coleccionismo</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

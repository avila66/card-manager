"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { label: "Inicio", href: "/indice" },
  { label: "Colecciones", href: "/colecciones" },
  { label: "Cartas", href: "/cartas" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="relative bg-zinc-900 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-zinc-800">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              type="button"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="relative inline-flex items-center justify-center rounded-md border border-zinc-700 p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-zinc-500"
            >
              <span className="sr-only">Abrir menu principal</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
                className={`size-6 ${mobileOpen ? "hidden" : "block"}`}
              >
                <path
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
                className={`size-6 ${mobileOpen ? "block" : "hidden"}`}
              >
                <path d="M6 18 18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <Link href="/indice" className="flex shrink-0 items-center gap-2">
              <Image
                src="/CMLogo.jpg"
                alt="Card Manager"
                width={28}
                height={28}
                className="h-7 w-7 rounded-md border border-zinc-600 object-cover"
              />
              <span className="text-sm font-semibold tracking-wide text-white">Card Manager</span>
            </Link>

            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-3">
                {navItems.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={`rounded-md border px-3 py-2 text-sm font-medium transition ${
                        isActive
                          ? "border-zinc-500 bg-zinc-900 text-white"
                          : "border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-900 hover:text-white"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <Link
              href="/ayuda"
              className="rounded-md border border-zinc-700 px-3 py-2 text-sm font-medium text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-900 hover:text-white focus:outline-2 focus:-outline-offset-1 focus:outline-zinc-500"
            >
              Ayuda
            </Link>
          </div>
        </div>
      </div>

      <div id="mobile-menu" className={`${mobileOpen ? "block" : "hidden"} sm:hidden`}>
        <div className="space-y-1 px-2 pb-3 pt-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                onClick={() => setMobileOpen(false)}
                className={`block rounded-md border px-3 py-2 text-base font-medium transition ${
                  isActive
                    ? "border-zinc-500 bg-zinc-900 text-white"
                    : "border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-900 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
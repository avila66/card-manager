'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect } from 'react';

export default function InicioPage() {
  useEffect(() => {
    document.title = 'Card Manager | Tu colección de cartas';
  }, []);

  const features = [
    {
      title: 'Seguimiento de progreso',
      description: 'Mantén un seguimiento de tu progreso en cada set, y en tu colección.',
      icon: '📊',
    },
    {
      title: 'Todos los detalles',
      description: '¿Cartas duplicadas? Múltiples variantes o condiciones? Lo tenemos cubierto.',
      icon: '📋',
    },
    {
      title: 'Comparte tu colección',
      description: 'Muestra tu colección a otros o compara cartas para intercambio.',
      icon: '🔗',
    },
    {
      title: 'Encuentra lo que tienes',
      description: 'Busca exactamente las cartas que necesitas sin rebuscar en cajas.',
      icon: '🔍',
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-24 text-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/inicio/pokemonbaner.jpg"
            alt="Fondo"
            fill
            className="object-cover opacity-50"
            priority
          />
          <div className="absolute inset-0 bg-zinc-900/80" />
        </div>
        <div className="relative z-10 mx-auto max-w-4xl">
          <h1 className="font-[family-name:var(--font-geist-mono)] text-4xl md:text-6xl font-bold text-white mb-6">
            Comienza tu colección de cartas aquí.
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
            Tu extensa base de datos y rastreador de colección de cartas. 
            Crea una cuenta para empezar a coleccionar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-xl bg-zinc-100 px-8 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-200"
            >
              Crear una cuenta
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800 px-8 py-3 text-sm font-medium text-zinc-100 transition hover:bg-zinc-700"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 bg-zinc-950">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold text-white mb-16">
            Características principales
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-center transition hover:border-zinc-700"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-zinc-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden px-4 py-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/inicio/ascendedheroes.jpg"
            alt="Fondo"
            fill
            className="object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-zinc-900/80" />
        </div>
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            ¿Quieres empezar a coleccionar?
          </h2>
          <p className="text-zinc-400 mb-8">
            Únete a nuestra comunidad de coleccionistas y gestiona tu colección 
            de cartas de forma fácil y organizada.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-xl bg-zinc-100 px-8 py-3 text-sm font-medium text-zinc-900 transition hover:bg-zinc-200"
          >
            Crear una cuenta ahora
          </Link>
        </div>
      </section>
    </div>
  );
}
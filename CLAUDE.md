# Card Manager — Contexto del Proyecto

## ¿Qué es este proyecto?
Aplicación web para gestionar colecciones de cartas coleccionables (Pokémon y fútbol). Permite añadir cartas, organizarlas en colecciones, ver el detalle de cada carta con su evolución de valor, y gestionar el gradeo profesional de cartas.

## Stack tecnológico
- **Frontend/Backend:** Next.js 14 (App Router)
- **Base de datos:** Supabase (PostgreSQL)
- **Autenticación:** Supabase Auth con Google OAuth
- **Estilos:** Tailwind CSS
- **Gráficos:** Recharts
- **Lenguaje:** TypeScript + JavaScript

## Estructura del proyecto
```
card-manager/
├── app/
│   ├── api/                        # Rutas API (backend)
│   │   ├── cartas/                 # CRUD de cartas
│   │   ├── colecciones/            # CRUD de colecciones
│   │   ├── carta-coleccion/        # Relación carta-colección
│   │   ├── catalogos/              # Rarezas, idiomas, casas de gradeo
│   │   └── completar-perfil/       # Actualizar datos de usuario
│   ├── auth/
│   │   ├── callback/               # Callback OAuth Google (crea usuario + colecciones sistema)
│   │   └── set-session/            # Guarda sesión tras login
│   ├── cartas/[username]/          # Lista de cartas del usuario
│   ├── cartas/[username]/[id]/     # Detalle de carta individual
│   ├── colecciones/[username]/     # Lista de colecciones del usuario
│   ├── colecciones/[username]/[id]/# Detalle de colección
│   └── completar-perfil/           # Formulario tras primer login
├── public/
│   └── images/colecciones/         # Imágenes de colecciones del sistema
└── utils/
    └── supabaseServer.js           # Cliente Supabase para server-side
```

## Base de datos (Supabase)
Tablas principales:
- **usuario** — datos del usuario (vinculado a auth.users)
- **carta** — carta base con precio, fecha compra, gradeo, black_label
- **pokemon** — datos específicos de cartas Pokémon
- **futbol** — datos específicos de cartas de fútbol
- **coleccion** — colecciones del usuario (incluye las 3 del sistema)
- **carta_coleccion** — relación muchos a muchos entre carta y colección
- **rareza** — catálogo de rarezas Pokémon
- **idioma** — catálogo de idiomas
- **marca** — marcas comerciales (Topps, Panini, etc.)
- **casa_gradeo** — casas de gradeo (PSA, Beckett, CGC, etc.)

## Colecciones del sistema
Cada usuario tiene 3 colecciones creadas automáticamente al registrarse:
- **Favoritas** → `/images/colecciones/favoritas.png`
- **Wishlist** → `/images/colecciones/wishlist.png`
- **En Venta** → `/images/colecciones/en-venta.png`

Estas colecciones NO tienen botón de eliminar. Se identifican por `nombre_coleccion` en el array `SYSTEM_NAMES`.

## Lógica de negocio importante
- **Black Label (Beckett):** Si una carta gradeada por Beckett es Black Label, la nota es siempre 10. El campo `black_label` es boolean en la tabla `carta`.
- **Fotos de cartas:** Se suben a Supabase Storage (bucket `cartas`) y se guarda la ruta relativa en BD.
- **Fotos de colecciones normales:** Se suben a Supabase Storage (bucket `colecciones`). Las del sistema usan rutas locales `/images/...` — no pasar por `getPublicUrl`.
- **Gráfico de valor:** Generado de forma determinista a partir del `id_carta`, oscila ±20%/+50% respecto al precio de compra.
- **Autenticación:** Solo Google OAuth. Las rutas `/api/register` y `/api/user` están obsoletas.

## Convenciones de código
- Las rutas API están en `app/api/*/route.js` (JavaScript)
- Las páginas están en `app/*/page.tsx` (TypeScript)
- El cliente Supabase server-side se importa desde `@/utils/supabaseServer`
- Los formularios usan `FormData` para enviar archivos junto con datos
- Las imágenes locales de colecciones del sistema se detectan porque empiezan por `/`

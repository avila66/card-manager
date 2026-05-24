# Next.js + Supabase Skill

## Descripción
Buenas prácticas para trabajar con Next.js 14 (App Router) y Supabase en el proyecto Card Manager.

## Estructura de rutas API
- Siempre usar `createSupabaseServer` desde `@/utils/supabaseServer` en las rutas API
- Verificar autenticación al inicio de cada ruta con `supabase.auth.getUser()`
- Devolver errores con `Response.json({ mensaje: error.message }, { status: 400 })`
- Las rutas API van en `app/api/*/route.js` (JavaScript)
- Las páginas van en `app/*/page.tsx` (TypeScript)

## Subida de imágenes a Supabase Storage
- Las fotos de cartas van al bucket `cartas`
- Las fotos de colecciones normales van al bucket `colecciones`
- Las colecciones del sistema usan rutas locales `/images/colecciones/...` — NUNCA pasar por `getPublicUrl`
- Para detectar si una foto es local: comprobar si empieza por `/`

## Colecciones del sistema
- Nombres exactos: `Favoritas`, `Wishlist`, `En Venta`
- Se identifican con el array `SYSTEM_NAMES`
- NO tienen botón de eliminar colección
- SÍ tienen botón de añadir carta

## Black Label (Beckett)
- Solo visible si la casa de gradeo es Beckett
- Si se marca, `nota_gradeo` se pone automáticamente a `10`
- El campo `nota_gradeo` queda visible pero no editable
- Se guarda en el campo `black_label` (boolean) de la tabla `carta`

## Formularios
- Usar `FormData` cuando se envían archivos junto con datos
- No usar etiquetas `<form>` HTML, usar eventos `onClick` y `onChange`

## Autenticación
- Solo Google OAuth via Supabase
- El callback está en `app/auth/callback/route.js`
- Al registrar un usuario nuevo se crean automáticamente las 3 colecciones del sistema

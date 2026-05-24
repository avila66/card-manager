import { createSupabaseServer } from '@/utils/supabaseServer';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const supabase = await createSupabaseServer();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const { data: usuarioExistente } = await supabase
        .from('usuario')
        .select('id_usuario, nombre_usuario')
        .eq('id_usuario', data.user.id)
        .single();

      if (!usuarioExistente) {
        const nombre = data.user.user_metadata?.full_name?.split(' ')[0] || 'Usuario';
        const apellido = data.user.user_metadata?.full_name?.split(' ').slice(1).join(' ') || '';
        const correo = data.user.email || '';
        const foto = data.user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${nombre}&background=27272a&color=ffffff`;

        await supabase.from('usuario').insert({
          id_usuario: data.user.id,
          nombre,
          primer_apellido: apellido,
          nombre_usuario: correo.split('@')[0].replace(/[^a-zA-Z0-9]/g, ''),
          correo,
          foto_perfil: foto,
          fecha_registro: new Date().toISOString(),
          pais: 'Pendiente',
        });

        // Crear las 3 colecciones del sistema para el nuevo usuario
        await supabase.from('coleccion').insert([
          { id_usuario_fk: data.user.id, nombre_coleccion: 'Favoritas', foto_coleccion: '/images/colecciones/favoritas.png', fecha_creacion: new Date().toISOString() },
          { id_usuario_fk: data.user.id, nombre_coleccion: 'Wishlist', foto_coleccion: '/images/colecciones/wishlist.png', fecha_creacion: new Date().toISOString() },
          { id_usuario_fk: data.user.id, nombre_coleccion: 'En Venta', foto_coleccion: '/images/colecciones/en-venta.png', fecha_creacion: new Date().toISOString() },
        ]);

        return NextResponse.redirect(`${origin}/completar-perfil`);
      } else {
        // Pasar el username como query param para que el cliente lo guarde en localStorage
        return NextResponse.redirect(`${origin}/auth/set-session?username=${usuarioExistente.nombre_usuario}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/login`);
}

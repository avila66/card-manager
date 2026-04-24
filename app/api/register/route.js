import supabase from '@/utils/supabase';

export async function POST(req) {
  const { nombre, primer_apellido, segundo_apellido, nombre_usuario, correo, contrasena, pais, ciudad } = await req.json();

  // Crear usuario en Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: correo,
    password: contrasena,
  });

  if (authError) {
    return Response.json({ mensaje: authError.message }, { status: 400 });
  }

  // Insertar datos en la tabla usuario
  const { error: dbError } = await supabase.from('usuario').insert({
    id_usuario: authData.user.id,
    nombre,
    primer_apellido,
    segundo_apellido: segundo_apellido || null,
    nombre_usuario,
    correo,
    pais: pais || null,
    ciudad: ciudad || null,
    foto_perfil: 'https://ui-avatars.com/api/?name=' + nombre + '+' + primer_apellido + '&background=27272a&color=ffffff',
    fecha_registro: new Date().toISOString(),
  });

  if (dbError) {
    return Response.json({ mensaje: dbError.message }, { status: 400 });
  }

  return Response.json({ mensaje: 'OK' });
}

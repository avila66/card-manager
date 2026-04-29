import supabase from '@/utils/supabase';

export async function POST(req) {
  const { email, password } = await req.json();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return Response.json({ mensaje: error.message }, { status: 400 });
  }

  const { data: usuario, error: dbError } = await supabase
    .from('usuario')
    .select('nombre_usuario')
    .eq('id_usuario', data.user.id)
    .single();

  if (dbError) {
    return Response.json({ mensaje: dbError.message }, { status: 400 });
  }

  return Response.json({ mensaje: 'OK', user: data.user, nombre_usuario: usuario.nombre_usuario });
}

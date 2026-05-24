import { createSupabaseServer } from '@/utils/supabaseServer';

export async function POST(req) {
  const supabase = await createSupabaseServer();
  const { nombre_usuario, pais, ciudad, id_usuario } = await req.json();

  const { error } = await supabase
    .from('usuario')
    .update({ nombre_usuario, pais, ciudad: ciudad || null })
    .eq('id_usuario', id_usuario);

  if (error) {
    return Response.json({ mensaje: error.message }, { status: 400 });
  }

  return Response.json({ mensaje: 'OK' });
}

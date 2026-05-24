import { createSupabaseServer } from '@/utils/supabaseServer';

export async function POST(req) {
  const supabase = await createSupabaseServer();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return Response.json({ mensaje: 'No autenticado' }, { status: 401 });

  const { id_coleccion, id_carta } = await req.json();

  const { error } = await supabase.from('carta_coleccion').insert({
    id_coleccion_fk: id_coleccion,
    id_carta_fk: id_carta,
  });

  if (error) return Response.json({ mensaje: error.message }, { status: 400 });
  return Response.json({ mensaje: 'OK' });
}
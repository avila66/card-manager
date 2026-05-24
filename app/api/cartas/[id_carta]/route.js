import { createSupabaseServer } from '@/utils/supabaseServer';

export async function GET(req, { params }) {
  const supabase = await createSupabaseServer();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return Response.json({ mensaje: 'No autenticado' }, { status: 401 });
  }

  const { id_carta } = await params;

  const { data: carta, error } = await supabase
    .from('carta')
    .select(`
      *,
      casa_gradeo (nombre_casa),
      marca (nombre_marca),
      pokemon (
        pokemon, set_carta, numero,
        rareza (rareza),
        idioma (idioma)
      ),
      futbol (jugador, equipo, tipo_carta, coleccion, temporada, numeracion, rookie, auto_firma, relic)
    `)
    .eq('id_carta', id_carta)
    .eq('id_usuario_fk', user.id)
    .single();

  if (error || !carta) {
    return Response.json({ mensaje: 'Carta no encontrada' }, { status: 404 });
  }

  let foto_url = null;
  if (carta.foto_carta) {
    const { data: urlData } = supabase.storage
      .from('cartas')
      .getPublicUrl(carta.foto_carta);
    foto_url = urlData.publicUrl;
  }

  return Response.json({ carta: { ...carta, foto_carta: foto_url } });
}

export async function DELETE(req, { params }) {
  const supabase = await createSupabaseServer();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return Response.json({ mensaje: 'No autenticado' }, { status: 401 });
  }

  const { id_carta } = await params;

  // Verificar que la carta pertenece al usuario y obtener la foto
  const { data: carta, error: fetchError } = await supabase
    .from('carta')
    .select('id_carta, foto_carta, id_usuario_fk')
    .eq('id_carta', id_carta)
    .eq('id_usuario_fk', user.id)
    .single();

  if (fetchError || !carta) {
    return Response.json({ mensaje: 'Carta no encontrada' }, { status: 404 });
  }

  // Eliminar foto del storage si existe
  if (carta.foto_carta) {
    await supabase.storage.from('cartas').remove([carta.foto_carta]);
  }

  // Eliminar la carta (cascade borra pokemon/futbol automáticamente)
  const { error: deleteError } = await supabase
    .from('carta')
    .delete()
    .eq('id_carta', id_carta)
    .eq('id_usuario_fk', user.id);

  if (deleteError) {
    return Response.json({ mensaje: deleteError.message }, { status: 400 });
  }

  return Response.json({ mensaje: 'OK' });
}

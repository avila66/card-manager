import { createSupabaseServer } from '@/utils/supabaseServer';

export async function GET(req, { params }) {
  const supabase = await createSupabaseServer();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return Response.json({ mensaje: 'No autenticado' }, { status: 401 });

  const { id_coleccion } = await params;

  const { data: coleccion, error: colError } = await supabase
    .from('coleccion')
    .select('*')
    .eq('id_coleccion', id_coleccion)
    .eq('id_usuario_fk', user.id)
    .single();

  if (colError || !coleccion) return Response.json({ mensaje: 'Colección no encontrada' }, { status: 404 });

  const { data: cartasCol, error: cartasError } = await supabase
    .from('carta_coleccion')
    .select(`
      carta (
        id_carta, foto_carta, precio_compra, fecha_compra,
        marca (nombre_marca),
        pokemon (pokemon, set_carta, rareza (rareza), idioma (idioma)),
        futbol (jugador, equipo, coleccion, temporada, auto_firma, relic, numeracion)
      )
    `)
    .eq('id_coleccion_fk', id_coleccion);

  if (cartasError) return Response.json({ mensaje: cartasError.message }, { status: 400 });

  const cartas = (cartasCol || []).map(({ carta }) => {
    if (!carta) return null;
    if (!carta.foto_carta) return carta;
    const { data: urlData } = supabase.storage.from('cartas').getPublicUrl(carta.foto_carta);
    return { ...carta, foto_carta: urlData.publicUrl };
  }).filter(Boolean);

  let foto_coleccion = null;
  if (coleccion.foto_coleccion) {
    const { data: urlData } = supabase.storage.from('colecciones').getPublicUrl(coleccion.foto_coleccion);
    foto_coleccion = urlData.publicUrl;
  }

  return Response.json({ coleccion: { ...coleccion, foto_coleccion }, cartas });
}

export async function DELETE(req, { params }) {
  const supabase = await createSupabaseServer();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return Response.json({ mensaje: 'No autenticado' }, { status: 401 });

  const { id_coleccion } = await params;
  const { searchParams } = new URL(req.url);
  const id_carta = searchParams.get('id_carta');

  if (id_carta) {
    // Quitar carta de la colección
    const { error } = await supabase
      .from('carta_coleccion')
      .delete()
      .eq('id_coleccion_fk', id_coleccion)
      .eq('id_carta_fk', id_carta);
    if (error) return Response.json({ mensaje: error.message }, { status: 400 });
    return Response.json({ mensaje: 'OK' });
  }

  // Eliminar colección entera
  const { data: coleccion, error: fetchError } = await supabase
    .from('coleccion')
    .select('id_coleccion, foto_coleccion')
    .eq('id_coleccion', id_coleccion)
    .eq('id_usuario_fk', user.id)
    .single();

  if (fetchError || !coleccion) return Response.json({ mensaje: 'Colección no encontrada' }, { status: 404 });

  // Eliminar foto del storage si existe
  if (coleccion.foto_coleccion) {
    await supabase.storage.from('colecciones').remove([coleccion.foto_coleccion]);
  }

  // Eliminar relaciones carta_coleccion (cascade debería hacerlo, pero por si acaso)
  await supabase.from('carta_coleccion').delete().eq('id_coleccion_fk', id_coleccion);

  // Eliminar la colección
  const { error: deleteError } = await supabase
    .from('coleccion')
    .delete()
    .eq('id_coleccion', id_coleccion)
    .eq('id_usuario_fk', user.id);

  if (deleteError) return Response.json({ mensaje: deleteError.message }, { status: 400 });
  return Response.json({ mensaje: 'OK' });
}

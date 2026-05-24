import { createSupabaseServer } from '@/utils/supabaseServer';

export async function GET(req, { params }) {
  const supabase = await createSupabaseServer();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return Response.json({ mensaje: 'No autenticado' }, { status: 401 });

  const { id_carta } = await params;

  const { data, error } = await supabase
    .from('carta_coleccion')
    .select(`
      coleccion (
        id_coleccion,
        nombre_coleccion,
        foto_coleccion
      )
    `)
    .eq('id_carta_fk', id_carta);

  if (error) return Response.json({ mensaje: error.message }, { status: 400 });

  const colecciones = (data || []).map(({ coleccion }) => {
    if (!coleccion) return null;
    let foto = coleccion.foto_coleccion;
    // Si la foto es una ruta local (colecciones del sistema) no la procesamos
    if (foto && !foto.startsWith('/')) {
      const { data: urlData } = supabase.storage.from('colecciones').getPublicUrl(foto);
      foto = urlData.publicUrl;
    }
    return { ...coleccion, foto_coleccion: foto };
  }).filter(Boolean);

  return Response.json({ colecciones });
}

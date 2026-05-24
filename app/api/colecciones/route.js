import { createSupabaseServer } from '@/utils/supabaseServer';

export async function GET() {
  const supabase = await createSupabaseServer();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return Response.json({ mensaje: 'No autenticado' }, { status: 401 });

  const { data: colecciones, error } = await supabase
    .from('coleccion')
    .select('*')
    .eq('id_usuario_fk', user.id)
    .order('fecha_creacion', { ascending: true });

  if (error) return Response.json({ mensaje: error.message }, { status: 400 });

  const coleccionesConUrl = colecciones.map((col) => {
    if (!col.foto_coleccion) return col;
    const { data: urlData } = supabase.storage.from('colecciones').getPublicUrl(col.foto_coleccion);
    return { ...col, foto_coleccion: urlData.publicUrl };
  });

  return Response.json({ colecciones: coleccionesConUrl });
}

export async function POST(req) {
  const supabase = await createSupabaseServer();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return Response.json({ mensaje: 'No autenticado' }, { status: 401 });

  const formData = await req.formData();
  const nombre_coleccion = formData.get('nombre_coleccion');
  const fotoFile = formData.get('foto_coleccion');

  let foto_url = null;
  if (fotoFile && fotoFile.size > 0) {
    const ext = fotoFile.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${ext}`;
    const arrayBuffer = await fotoFile.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    const { error: uploadError } = await supabase.storage.from('colecciones').upload(fileName, buffer, { contentType: fotoFile.type });
    if (uploadError) return Response.json({ mensaje: uploadError.message }, { status: 400 });
    foto_url = fileName;
  }

  const { data: coleccion, error } = await supabase.from('coleccion').insert({
    id_usuario_fk: user.id,
    nombre_coleccion,
    foto_coleccion: foto_url,
    fecha_creacion: new Date().toISOString(),
  }).select().single();

  if (error) return Response.json({ mensaje: error.message }, { status: 400 });
  return Response.json({ mensaje: 'OK', coleccion });
}

import { createSupabaseServer } from '@/utils/supabaseServer';

export async function GET() {
  const supabase = await createSupabaseServer();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return Response.json({ mensaje: 'No autenticado' }, { status: 401 });
  }

  const { data: cartas, error } = await supabase
    .from('carta')
    .select(`
      *,
      marca (nombre_marca),
      pokemon (pokemon, set_carta, rareza (rareza), idioma (idioma)),
      futbol (jugador, equipo, coleccion, temporada, auto_firma, relic, numeracion)
    `)
    .eq('id_usuario_fk', user.id);

  if (error) {
    return Response.json({ mensaje: error.message }, { status: 400 });
  }

  const cartasConUrl = cartas.map((carta) => {
    if (!carta.foto_carta) return carta;
    const { data: urlData } = supabase.storage
      .from('cartas')
      .getPublicUrl(carta.foto_carta);
    return { ...carta, foto_carta: urlData.publicUrl };
  });

  return Response.json({ cartas: cartasConUrl });
}

export async function POST(req) {
  const supabase = await createSupabaseServer();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return Response.json({ mensaje: 'No autenticado' }, { status: 401 });
  }

  const formData = await req.formData();

  const es_futbol = formData.get('es_futbol') === 'true';
  const gradeada = formData.get('gradeada') === 'true';
  const fecha_compra = formData.get('fecha_compra');
  const precio_compra = formData.get('precio_compra');
  const id_casa_fk = formData.get('id_casa_fk');
  const numero_gradeo = formData.get('numero_gradeo');
  const nota_gradeo = formData.get('nota_gradeo');
  const black_label = formData.get('black_label') === 'true';
  const pokemon = formData.get('pokemon');
  const numero = formData.get('numero');
  const set_carta = formData.get('set_carta');
  const id_rareza_fk = formData.get('id_rareza_fk');
  const id_idioma_fk = formData.get('id_idioma_fk');
  const jugador = formData.get('jugador');
  const equipo = formData.get('equipo');
  const id_marca_fk = formData.get('id_marca_fk');
  const coleccion = formData.get('coleccion');
  const temporada = formData.get('temporada');
  const tipo_carta_futbol = formData.get('tipo_carta_futbol');
  const numeracion = formData.get('numeracion');
  const rookie = formData.get('rookie') === 'true';
  const auto_firma = formData.get('auto_firma') === 'true';
  const relic = formData.get('relic') === 'true';
  const fotoFile = formData.get('foto_carta');

  let foto_url = null;
  if (fotoFile && fotoFile.size > 0) {
    const ext = fotoFile.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${ext}`;
    const arrayBuffer = await fotoFile.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from('cartas')
      .upload(fileName, buffer, { contentType: fotoFile.type });

    if (uploadError) {
      return Response.json({ mensaje: uploadError.message }, { status: 400 });
    }

    foto_url = fileName;
  }

  const marcaFinal = !es_futbol ? 1 : parseInt(id_marca_fk);
  const casaFinal = gradeada && id_casa_fk ? parseInt(id_casa_fk) : null;

  // Si es black label, la nota es siempre 10
  const notaFinal = gradeada && black_label ? '10' : (gradeada && nota_gradeo ? nota_gradeo : null);

  const { data: carta, error: cartaError } = await supabase.from('carta').insert({
    id_usuario_fk: user.id,
    id_marca_fk: marcaFinal,
    id_casa_fk: casaFinal,
    foto_carta: foto_url,
    precio_compra: precio_compra ? parseFloat(precio_compra) : null,
    fecha_compra: fecha_compra || null,
    numero_gradeo: gradeada && numero_gradeo ? parseInt(numero_gradeo) : null,
    nota_gradeo: notaFinal,
    black_label: gradeada ? black_label : false,
  }).select().single();

  if (cartaError) {
    return Response.json({ mensaje: cartaError.message }, { status: 400 });
  }

  if (!es_futbol) {
    const { error: pkError } = await supabase.from('pokemon').insert({
      id_carta_fk: carta.id_carta,
      pokemon,
      numero: numero ? parseInt(numero) : null,
      set_carta: set_carta || null,
      id_rareza_fk: id_rareza_fk ? parseInt(id_rareza_fk) : null,
      id_idioma_fk: id_idioma_fk ? parseInt(id_idioma_fk) : null,
    });
    if (pkError) return Response.json({ mensaje: pkError.message }, { status: 400 });
  }

  if (es_futbol) {
    const { error: ftError } = await supabase.from('futbol').insert({
      id_carta_fk: carta.id_carta,
      jugador: jugador || null,
      equipo: equipo || null,
      coleccion: coleccion || null,
      temporada: temporada || null,
      numeracion: numeracion || null,
      rookie,
      auto_firma,
      relic,
      tipo_carta: tipo_carta_futbol || null,
    });
    if (ftError) return Response.json({ mensaje: ftError.message }, { status: 400 });
  }

  return Response.json({ mensaje: 'OK', id_carta: carta.id_carta });
}

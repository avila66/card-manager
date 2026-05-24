import { createSupabaseServer } from '@/utils/supabaseServer';

export async function GET() {
  const supabase = await createSupabaseServer();
  const [rarezas, idiomas, marcas, casas] = await Promise.all([
    supabase.from('rareza').select('*'),
    supabase.from('idioma').select('*'),
    supabase.from('marca').select('*'),
    supabase.from('casa_gradeo').select('*'),
  ]);

  return Response.json({
    rarezas: rarezas.data || [],
    idiomas: idiomas.data || [],
    marcas: marcas.data || [],
    casas: casas.data || [],
  });
}

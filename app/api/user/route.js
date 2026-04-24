import supabase from '@/utils/supabase';


//const pilla el tipo de variable de la 
export async function POST(req) {
  const { email, password } = await req.json();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return Response.json({ mensaje: error.message }, { status: 400 });
  }

  return Response.json({ mensaje: 'OK', user: data.user });
}
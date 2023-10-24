import { createClient } from "@supabase/supabase-js";
import type { SignInWithPasswordCredentials } from "@supabase/supabase-js";

export default defineEventHandler( async (event) => {
  const loginData = await readBody(event);
  const supabase = await createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_KEY!,
    {
      auth: {
        persistSession: false
      }
    }
  );
  const credentials: SignInWithPasswordCredentials = {
    email: loginData.email!,
    password: loginData.password!
  }
  const {data, error} = await supabase.auth.signInWithPassword(credentials);
  if(error){
    return sendRedirect(event, '/login?error=invalid');
  }
  try {
    setCookie(event, 'sb-access-token', data.session?.access_token!, {sameSite: 'lax'})
    return sendRedirect(event, '/');
  }catch(err){
    console.error(error);
    return sendRedirect(event, '/login?error=unhandled');
  }
});
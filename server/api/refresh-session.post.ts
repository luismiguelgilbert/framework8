import { createClient } from "@supabase/supabase-js";

export default defineEventHandler( async (event) => {
  const accessToken = getCookie(event, 'sb-access-token') || 0;
  const refreshToken = getCookie(event, 'sb-refresh-token') || 0;
  if (refreshToken && accessToken) {
    const supabase = await createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_KEY!,
      {
        auth: {
          persistSession: false
        }
      }
    );
    const {data, error} = await supabase.auth.setSession({
      refresh_token: refreshToken,
      access_token: accessToken,
    });
    if(error){
      return sendRedirect(event, '/login?error=invalid');
    }
    try {
      setCookie(event, 'sb-access-token', data.session?.access_token!, {sameSite: 'lax'});
      setCookie(event, 'sb-refresh-token', data.session?.refresh_token!, {sameSite: 'lax'});
      console.log('sendRedirect.... to home');
      return sendRedirect(event, '/');
    }catch(err){
      console.error(error);
      return sendRedirect(event, '/login?error=unhandled');
    }
  } else {
    throw new Error('User is not authenticated.')
  }
});
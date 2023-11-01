import supabase from '@/server/utils/supabase';

export default defineEventHandler(async (event) => {
  const requestedURL = await getRequestURL(event);
  const unprotectedPaths = ['/api/login', '/api/refresh-session'];
  const isProtectedPath = requestedURL.pathname.startsWith('/api') 
    && !unprotectedPaths.includes(requestedURL.pathname); 
  
  if (isProtectedPath) {
    const cookies = await parseCookies(event);
    const sessionCookie = cookies['sb-access-token'];
    const userSession = await supabase.auth.getUser(sessionCookie);
    if (userSession.error) {
      throw createError({
        statusCode: 401,
        statusMessage: 'No active session found',
      });
    }
    event.context.user = userSession.data.user;
  }
})

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  // '/api/agents(.*)',
  
  
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();


  

  if (!userId && isProtectedRoute(req)) {
    // Redirects unauthenticated users to the sign-in page
    return redirectToSignIn();
  }

   // ✅ Inject userId into request headers for downstream API usage
  if (userId && req.nextUrl.pathname.startsWith('/api/agents')) {
    req.headers.set('x-user-id', userId);
  }

  

});

export const config = {
  matcher: [
    // include all routes except _next, static assets
    '/((?!_next|static|.*\\.[^\\/]+$).*)',
  ],
};

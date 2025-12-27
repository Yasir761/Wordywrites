

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();

  // Allow checkout route WITHOUT auth redirect
  if (req.nextUrl.pathname.startsWith("/api/checkout")) {
    return;
  }

  // Redirect unauthenticated users from protected pages
  if (!userId && isProtectedRoute(req)) {
    return redirectToSignIn();
  }

  //  PASS userId to ALL API routes (including agents)
  if (userId) {
    req.headers.set("x-user-id", userId);
  }
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/api/agents(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, redirectToSignIn } = await auth();

  //  Redirect unauthenticated users
  if (!userId && isProtectedRoute(req)) {
    return redirectToSignIn();
  }

  //  Pass userId to backend API calls
  if (userId && req.nextUrl.pathname.startsWith("/api/agents")) {
    req.headers.set("x-user-id", userId);
  }
});

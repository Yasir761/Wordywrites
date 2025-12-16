// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// const isProtectedRoute = createRouteMatcher([
//   "/dashboard(.*)",
//   "/api/agents(.*)",
// ]);

// export default clerkMiddleware(async (auth, req) => {
//   const { userId, redirectToSignIn } = await auth();

//   //  Redirect unauthenticated users
//   if (!userId && isProtectedRoute(req)) {
//     return redirectToSignIn();
//   }

//   //  Pass userId to backend API calls
//   if (userId && req.nextUrl.pathname.startsWith("/api/agents")) {
//     req.headers.set("x-user-id", userId);
//   }
// });






import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/api/(.*)",
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

  // Pass userId to backend API calls
  if (userId && req.nextUrl.pathname.startsWith("/api/agents")) {
    req.headers.set("x-user-id", userId);
  }
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

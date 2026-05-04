import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/pricing(.*)',
  '/onboarding(.*)',
]);

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();

  // Not logged in — protect non-public routes
  if (!userId) {
    if (!isPublicRoute(request)) {
      await auth.protect();
    }
    return;
  }

  // Logged in + homepage → dashboard
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
});

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
};
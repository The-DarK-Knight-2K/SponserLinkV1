import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Define which routes require authentication
const isProtectedRoute = createRouteMatcher([
    '/organizer(.*)',  // Any route starting with /organizer
    '/sponsor(.*)',    // Any route starting with /sponsor
])

// Define auth pages that signed-in users shouldn't access
const isAuthPage = createRouteMatcher([
    '/auth/login',
    '/auth/signup',
])

export default clerkMiddleware(async (auth, req) => {
    const { userId } = await auth()

    // If user is signed in and trying to access login/signup, redirect to app
    // This prevents the "already signed in" error from stale sessions
    if (userId && isAuthPage(req)) {
        const redirectUrl = new URL('/auth/auth-redirect', req.url)
        return NextResponse.redirect(redirectUrl)
    }

    // Check if user is accessing a protected route
    if (isProtectedRoute(req)) {
        // Protect the route - Clerk will redirect to sign-in if not authenticated
        await auth.protect()
    }

    console.log(`Middleware: ${req.nextUrl.pathname} | userId: ${userId ? 'PRESENT' : 'NULL'}`)

    return NextResponse.next()
})

export const config = {
    matcher: [
        // Skip Next.js internals and static files
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}
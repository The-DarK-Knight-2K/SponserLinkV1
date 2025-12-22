import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Define which routes require authentication
const isProtectedRoute = createRouteMatcher([
    '/organizer(.*)',  // Any route starting with /organizer
    '/sponsor(.*)',    // Any route starting with /sponsor
])

export default clerkMiddleware(async (auth, req) => {
    // Check if user is accessing a protected route
    if (isProtectedRoute(req)) {
        // Protect the route - Clerk will redirect to sign-in if not authenticated
        await auth.protect()
    }

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
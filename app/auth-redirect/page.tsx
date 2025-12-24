// Path: app/auth-redirect/page.tsx

'use client'

import { useUser, useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AuthRedirectPage() {
    const { user, isLoaded: isUserLoaded } = useUser()
    const { isSignedIn, isLoaded: isAuthLoaded } = useAuth()
    const router = useRouter()

    useEffect(() => {
        // Wait until BOTH auth and user data are loaded
        if (!isAuthLoaded || !isUserLoaded) return

        // If not signed in, go to login
        if (!isSignedIn) {
            router.push('/login')
            return
        }

        // If signed in but user object not available yet, wait
        // This prevents the loop where isSignedIn is true but user is null
        if (!user) {
            // Don't redirect to login - we ARE signed in, just waiting for user data
            return
        }

        // Check email verification status
        const isEmailVerified = user.primaryEmailAddress?.verification?.status === 'verified'
        if (!isEmailVerified) {
            router.push('/verify-email')
            return
        }

        // Get user type from metadata
        const userType = user.unsafeMetadata?.userType as 'organizer' | 'sponsor' | undefined

        // If no user type set, they need to complete profile
        if (!userType) {
            router.push('/complete-profile')
            return
        }

        // Check if profile is complete
        if (userType === 'organizer') {
            const hasOrganizerProfile =
                user.unsafeMetadata?.organizationName &&
                user.unsafeMetadata?.officialTitle

            if (!hasOrganizerProfile) {
                router.push('/complete-profile')
                return
            }

            // Profile complete, go to organizer home
            router.push('/organizer/home')
        } else if (userType === 'sponsor') {
            const hasSponsorProfile =
                user.unsafeMetadata?.companyName &&
                user.unsafeMetadata?.companyDescription &&
                user.unsafeMetadata?.sponsorshipPreferences

            if (!hasSponsorProfile) {
                router.push('/complete-profile')
                return
            }

            // Profile complete, go to sponsor home
            router.push('/sponsor/home')
        }
    }, [user, isUserLoaded, isSignedIn, isAuthLoaded, router])

    // Show loading while redirecting
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
                <p className="mt-6 text-xl text-gray-700 font-medium">
                    Setting up your account...
                </p>
                <p className="mt-2 text-gray-500">
                    You'll be redirected shortly
                </p>
            </div>
        </div>
    )
}
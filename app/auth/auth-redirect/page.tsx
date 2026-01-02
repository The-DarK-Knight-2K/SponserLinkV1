// app/auth-redirect/page.tsx
'use client'

import { useUser, useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AuthRedirectPage() {
    const { user, isLoaded: isUserLoaded } = useUser()
    const { isSignedIn, isLoaded: isAuthLoaded } = useAuth()
    const router = useRouter()
    const [timeoutReached, setTimeoutReached] = useState(false)

    useEffect(() => {
        // Set timeout to prevent infinite waiting
        const timeout = setTimeout(() => {
            setTimeoutReached(true)
        }, 5000) // 5 second timeout

        return () => clearTimeout(timeout)
    }, [])

    useEffect(() => {
        // Wait until BOTH auth and user data are loaded
        if (!isAuthLoaded || !isUserLoaded) {
            return
        }

        // If timeout reached and still no user, redirect to login
        if (timeoutReached && !user) {
            console.error('Timeout waiting for user data')
            router.push('/auth/login')
            return
        }

        // If not signed in, go to login
        if (!isSignedIn) {
            router.push('/auth/login')
            return
        }

        // If signed in but no user object yet, wait (unless timeout)
        if (!user) {
            if (timeoutReached) {
                router.push('/auth/login')
            }
            return
        }

        // Check email verification status
        const isEmailVerified = user.primaryEmailAddress?.verification?.status === 'verified'
        if (!isEmailVerified) {
            router.push('/auth/verify-email')
            return
        }

        // Get user type from metadata
        const userType = user.unsafeMetadata?.userType as 'organizer' | 'sponsor' | undefined

        // If no user type set, something is wrong with the account creation flow (corruption)
        if (!userType) {
            router.push('/auth/account-error')
            return
        }

        // Check if profile is complete based on user type
        if (userType === 'organizer') {
            const hasOrganizerProfile =
                user.unsafeMetadata?.organizationName &&
                user.unsafeMetadata?.officialTitle

            if (!hasOrganizerProfile) {
                router.push('/auth/complete-profile')
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
                router.push('/auth/complete-profile')
                return
            }

            // Profile complete, go to sponsor home
            router.push('/sponsor/home')
        } else {
            // Unknown user type, go to complete profile
            router.push('/auth/complete-profile')
        }
    }, [user, isUserLoaded, isSignedIn, isAuthLoaded, router, timeoutReached])

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
// hooks/useAuthGuard.ts
'use client'

import { useUser, useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface AuthGuardOptions {
    requireAuth?: boolean
    requireVerified?: boolean
    redirectTo?: string
    allowedUserTypes?: ('organizer' | 'sponsor')[]
}

export function useAuthGuard(options: AuthGuardOptions = {}) {
    const {
        requireAuth = false,
        requireVerified = false,
        redirectTo,
        allowedUserTypes
    } = options

    const { user, isLoaded: isUserLoaded } = useUser()
    const { isSignedIn, isLoaded: isAuthLoaded } = useAuth()
    const router = useRouter()
    const [isChecking, setIsChecking] = useState(true)

    useEffect(() => {
        // Wait for both auth and user data to load
        if (!isAuthLoaded || !isUserLoaded) {
            return
        }

        // If auth is required but user is not signed in
        if (requireAuth && !isSignedIn) {
            router.push(redirectTo || '/auth/login')
            return
        }

        // If user is signed in, wait for user object
        if (isSignedIn && !user) {
            // Still loading user data, don't redirect yet
            return
        }

        // Check email verification if required
        if (requireVerified && user) {
            const isVerified = user.primaryEmailAddress?.verification?.status === 'verified'
            if (!isVerified) {
                router.push('/auth/verify-email')
                return
            }
        }

        // Check user type if specified
        if (allowedUserTypes && user) {
            const userType = user.unsafeMetadata?.userType as string

            // Scenario A: User has NO type (data corruption)
            if (!userType) {
                router.push('/auth/account-error')
                return
            }

            // Scenario B: User has WRONG type (mismatch)
            if (!allowedUserTypes.includes(userType as any)) {
                // Smart redirect based on actual type
                if (userType === 'organizer') {
                    router.push('/organizer/home')
                } else if (userType === 'sponsor') {
                    router.push('/sponsor/home')
                } else {
                    // Unknown/invalid type that isn't null/undefined
                    router.push('/auth/account-error')
                }
                return
            }
            // Scenario C: User has CORRECT type - continue (fall through to setIsChecking(false))
        }

        // All checks passed
        setIsChecking(false)
    }, [isAuthLoaded, isUserLoaded, isSignedIn, user, requireAuth, requireVerified, allowedUserTypes, router, redirectTo])

    return {
        isLoading: !isAuthLoaded || !isUserLoaded || isChecking,
        isAuthenticated: isSignedIn && !!user,
        user,
        userType: user?.unsafeMetadata?.userType as 'organizer' | 'sponsor' | undefined
    }
}

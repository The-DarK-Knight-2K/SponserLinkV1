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
            router.push(redirectTo || '/login')
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
                router.push('/verify-email')
                return
            }
        }

        // Check user type if specified
        if (allowedUserTypes && user) {
            const userType = user.unsafeMetadata?.userType as string
            if (!userType || !allowedUserTypes.includes(userType as any)) {
                router.push('/complete-profile')
                return
            }
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

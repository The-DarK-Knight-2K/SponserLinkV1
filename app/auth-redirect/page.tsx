'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AuthRedirectPage() {
    const { user, isLoaded } = useUser()
    const router = useRouter()

    useEffect(() => {
        // Wait until user data is loaded
        if (!isLoaded) return

        // If no user, go to login
        if (!user) {
            router.push('/login')
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
    }, [user, isLoaded, router])

    // Show loading while redirecting
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
                <p className="mt-6 text-xl text-gray-700 font-medium">
                    Setting up your account...
                </p>
                <p className="mt-2 text-gray-500">
                    You&apos;ll be redirected shortly
                </p>
            </div>
        </div>
    )
}
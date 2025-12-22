'use client'

import { SignUp } from '@clerk/nextjs'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

// We need Suspense because useSearchParams() requires it
function SignUpContent() {
    const searchParams = useSearchParams()
    const userType = searchParams.get('type') // Gets 'sponsor' or 'organizer' from URL

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-2">
                        Create Your Account
                    </h1>
                    <p className="text-gray-600">
                        {userType === 'sponsor'
                            ? 'Join as a Sponsor and discover amazing projects'
                            : userType === 'organizer'
                                ? 'Join as an Organizer and find the perfect sponsors'
                                : 'Join Sponsorlink today'}
                    </p>
                </div>

                {/* Clerk SignUp Component */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <SignUp
                        appearance={{
                            elements: {
                                rootBox: 'w-full',
                                card: 'shadow-none',
                                headerTitle: 'hidden',
                                headerSubtitle: 'hidden',
                                socialButtonsBlockButton: 'bg-white border-2 border-gray-300 hover:bg-gray-50',
                                formButtonPrimary: 'bg-blue-600 hover:bg-blue-700',
                                footerActionLink: 'text-blue-600 hover:text-blue-700'
                            }
                        }}
                        // Pass user type as unsafe metadata (we'll move to public metadata after signup)
                        unsafeMetadata={{
                            userType: userType || undefined
                        }}
                        routing="path"
                        path="/signup"
                        signInUrl="/login"
                    />
                </div>

                {/* Footer Links */}
                <p className="text-center text-sm text-gray-600 mt-6">
                    Already have an account?{' '}
                    <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                        Log in
                    </a>
                </p>
            </div>
        </div>
    )
}

export default function SignUpPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        }>
            <SignUpContent />
        </Suspense>
    )
}

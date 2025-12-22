'use client'

import { SignIn } from '@clerk/nextjs'

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-gray-600">
                        Log in to your Sponsorlink account
                    </p>
                </div>

                {/* Clerk SignIn Component */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <SignIn
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
                        routing="path"
                        path="/login"
                        signUpUrl="/signup"
                    />
                </div>

                {/* Footer Links */}
                <p className="text-center text-sm text-gray-600 mt-6">
                    Don&apos;t have an account?{' '}
                    <a href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    )
}

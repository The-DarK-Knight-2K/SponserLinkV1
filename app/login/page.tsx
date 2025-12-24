// Path: app/login/page.tsx

'use client'

import { useSignIn, useUser, useAuth, useClerk } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PasswordInput } from '@/components/ui/PasswordInput'
import Link from 'next/link'

export default function LoginPage() {
    const { signIn, isLoaded: isSignInLoaded } = useSignIn()
    const { user, isLoaded: isUserLoaded } = useUser()
    const { isSignedIn, isLoaded: isAuthLoaded } = useAuth()
    const { signOut } = useClerk()
    const router = useRouter()

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [sessionCleared, setSessionCleared] = useState(false)

    // Show loading while checking auth status
    if (!isAuthLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    // NOTE: We do NOT auto-redirect if isSignedIn is true
    // This is because isSignedIn can be stale after sign out
    // The user should be able to log in fresh without being bounced around

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        if (!isSignInLoaded || !signIn) {
            setLoading(false)
            return
        }

        if (isSignedIn) {
            router.push('/auth-redirect')
            return
        }

        try {
            const result = await signIn.create({
                identifier: formData.email,
                password: formData.password
            })

            if (result.status === 'complete') {
                // Login successful, redirect
                router.push('/auth-redirect')
            }
        } catch (err: any) {
            // Check for "already signed in" errors FIRST - handle silently
            const errorMessage = err.message || ''
            const clerkError = err.errors?.[0]
            const clerkErrorMessage = clerkError?.message || ''
            const clerkErrorCode = clerkError?.code || ''

            // If it's a session/signed-in related error, clear the stale session and retry
            if (
                errorMessage.toLowerCase().includes('signed in') ||
                errorMessage.toLowerCase().includes('session') ||
                clerkErrorMessage.toLowerCase().includes('signed in') ||
                clerkErrorMessage.toLowerCase().includes('session') ||
                clerkErrorCode === 'session_exists'
            ) {
                // Clear stale session state and retry login automatically
                try {
                    await signOut()
                    // Small delay to let Clerk sync state
                    await new Promise(resolve => setTimeout(resolve, 500))

                    // Retry the login
                    const retryResult = await signIn.create({
                        identifier: formData.email,
                        password: formData.password
                    })

                    if (retryResult.status === 'complete') {
                        router.push('/auth-redirect')
                        return
                    }
                } catch (retryErr: any) {
                    console.error('Login retry error:', retryErr)
                    // If retry also fails, show the actual error
                    const retryClerkError = retryErr.errors?.[0]
                    if (retryClerkError) {
                        if (retryClerkError.code === 'form_password_incorrect' ||
                            retryClerkError.code === 'form_identifier_not_found') {
                            setError('Incorrect email or password')
                        } else {
                            setError(retryClerkError.message || 'Login failed. Please try again.')
                        }
                    } else {
                        setError('Login failed. Please try again.')
                    }
                }
                setLoading(false)
                return
            }

            // Only log non-session errors
            console.error('Login error:', err)

            if (clerkError) {
                switch (clerkErrorCode) {
                    case 'form_password_incorrect':
                    case 'form_identifier_not_found':
                        setError('Incorrect email or password')
                        break
                    case 'verification_required':
                        // Email not verified, redirect to verification
                        router.push('/verify-email')
                        return
                    default:
                        setError(clerkError.message || 'Login failed. Please try again.')
                }
            } else {
                setError('Login failed. Please try again.')
            }
        } finally {
            setLoading(false)
        }
    }

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

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <Input
                            label="Email"
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) => {
                                setFormData({ ...formData, email: e.target.value })
                                setError('')
                            }}
                            required
                        />

                        {/* Password */}
                        <PasswordInput
                            label="Password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={(e) => {
                                setFormData({ ...formData, password: e.target.value })
                                setError('')
                            }}
                            required
                        />

                        {/* Forgot Password Link */}
                        <div className="text-right">
                            <Link
                                href="/forgot-password"
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            variant="primary"
                            fullWidth
                            disabled={loading || !isSignInLoaded}
                        >
                            {loading ? 'Logging in...' : 'Log In'}
                        </Button>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-gray-600 mt-6">
                    Don't have an account?{' '}
                    <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    )
}
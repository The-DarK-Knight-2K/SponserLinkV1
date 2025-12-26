// app/login/page.tsx
'use client'

import { useSignIn, useClerk } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PasswordInput } from '@/components/ui/PasswordInput'
import Link from 'next/link'
import { useAuthGuard } from '@/hooks/useAuthGuard'

export default function LoginPage() {
    const { signIn, isLoaded, setActive } = useSignIn()
    const { signOut } = useClerk()
    const router = useRouter()
    const { isLoading: authLoading, isAuthenticated } = useAuthGuard()

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    // Redirect if already authenticated
    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            router.push('/auth/auth-redirect')
        }
    }, [authLoading, isAuthenticated, router])

    // Show loading while checking auth
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    // If authenticated, show redirecting
    if (isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Redirecting...</p>
                </div>
            </div>
        )
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        if (!isLoaded || !signIn) {
            setLoading(false)
            return
        }

        try {
            const result = await signIn.create({
                identifier: formData.email,
                password: formData.password
            })

            if (result.status === 'complete') {
                // Login successful, redirect
                await setActive({ session: result.createdSessionId })
                router.push('/auth/auth-redirect')
            }
        } catch (err: any) {
            console.error('Login error:', err)

            const clerkError = err.errors?.[0]

            // Handle "already signed in" error by signing out and retrying
            if (clerkError?.code === 'identifier_already_signed_in' ||
                err.message?.includes('already signed in')) {
                try {
                    await signOut()
                    // Wait a moment for cleanup
                    await new Promise(resolve => setTimeout(resolve, 500))
                    // Retry login
                    const retryResult = await signIn.create({
                        identifier: formData.email,
                        password: formData.password
                    })
                    if (retryResult.status === 'complete') {
                        await setActive({ session: retryResult.createdSessionId })
                        router.push('/auth/auth-redirect')
                        return
                    }
                } catch (retryErr: any) {
                    console.error('Retry login error:', retryErr)
                    setError(`Retry failed: ${retryErr.message || 'Unknown error'}`)
                }
            } else if (clerkError) {
                switch (clerkError.code) {
                    case 'form_password_incorrect':
                    case 'form_identifier_not_found':
                        setError('Incorrect email or password')
                        break
                    case 'verification_required':
                        router.push('/auth/verify-email')
                        return
                    default:
                        setError('Login failed. Please try again.')
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
                                href="/auth/forgot-password"
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                                <p className="font-bold text-red-700">Error</p>
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            variant="primary"
                            fullWidth
                            disabled={loading || !isLoaded}
                        >
                            {loading ? 'Logging in...' : 'Log In'}
                        </Button>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-gray-600 mt-6">
                    Don't have an account?{' '}
                    <Link href="/auth/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    )
}
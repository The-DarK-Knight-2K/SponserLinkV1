// Path: app/signup/page.tsx

'use client'

import { useSignUp, useUser, useAuth } from '@clerk/nextjs'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, Suspense, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PasswordInput } from '@/components/ui/PasswordInput'
import Link from 'next/link'

function SignUpForm() {
    const { signUp, isLoaded: isSignUpLoaded } = useSignUp()
    const { user, isLoaded: isUserLoaded } = useUser()
    const { isSignedIn, isLoaded: isAuthLoaded } = useAuth()
    const router = useRouter()
    const searchParams = useSearchParams()
    const [selectedUserType, setSelectedUserType] = useState<'organizer' | 'sponsor'>(
        (searchParams.get('type') as 'organizer' | 'sponsor') || 'organizer'
    )

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    })
    const [errors, setErrors] = useState<{ [key: string]: string }>({})
    const [loading, setLoading] = useState(false)

    // Redirect if already signed in
    useEffect(() => {
        if (isAuthLoaded && isSignedIn) {
            router.push('/auth-redirect')
        }
    }, [isAuthLoaded, isSignedIn, router])

    // Update selectedUserType if URL param changes
    useEffect(() => {
        const typeParam = searchParams.get('type') as 'organizer' | 'sponsor' | null
        if (typeParam) {
            setSelectedUserType(typeParam)
        }
    }, [searchParams])

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

    // If already signed in, show redirecting message
    if (isSignedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">You're already signed in. Redirecting...</p>
                </div>
            </div>
        )
    }

    // Email validation for organizers
    const validateEmail = (email: string): boolean => {
        if (!email) {
            setErrors({ email: 'Email is required' })
            return false
        }

        if (selectedUserType === 'organizer' && !email.endsWith('@uom.lk')) {
            setErrors({ email: 'Organizers must use @uom.lk email address' })
            return false
        }

        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({})
        setLoading(true)

        if (!isSignUpLoaded || !signUp) {
            setLoading(false)
            return
        }

        // Validate email
        if (!validateEmail(formData.email)) {
            setLoading(false)
            return
        }

        try {
            // Create the signup with Clerk
            await signUp.create({
                emailAddress: formData.email,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName,
                unsafeMetadata: {
                    userType: selectedUserType
                }
            })

            // Send verification email
            await signUp.prepareEmailAddressVerification({
                strategy: 'email_code'
            })

            // Redirect to verification page
            router.push('/verify-email')
        } catch (err: any) {
            console.error('Signup error:', err)

            // Handle Clerk errors
            const clerkError = err.errors?.[0]
            if (clerkError) {
                switch (clerkError.code) {
                    case 'session_exists':
                        router.push('/auth-redirect')
                        return
                    case 'form_identifier_exists':
                        setErrors({ email: 'An account with this email already exists' })
                        break
                    case 'form_password_pwned':
                        setErrors({ password: 'This password is too common. Please choose a stronger one' })
                        break
                    case 'form_password_length_too_short':
                        setErrors({ password: 'Password must be at least 8 characters' })
                        break
                    default:
                        setErrors({ general: clerkError.message || 'Something went wrong. Please try again.' })
                }
            } else {
                setErrors({ general: 'Something went wrong. Please try again.' })
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
                        Create Your Account
                    </h1>
                    <p className="text-gray-600">
                        Join Sponsorlink today
                    </p>
                </div>

                {/* Role Selector */}
                <div className="bg-white p-1 rounded-xl shadow-md mb-6 flex">
                    <button
                        type="button"
                        onClick={() => setSelectedUserType('organizer')}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${selectedUserType === 'organizer'
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        Organizer
                    </button>
                    <button
                        type="button"
                        onClick={() => setSelectedUserType('sponsor')}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${selectedUserType === 'sponsor'
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        Sponsor
                    </button>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* First Name */}
                        <Input
                            label="First Name"
                            type="text"
                            placeholder="John"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            required
                        />

                        {/* Last Name */}
                        <Input
                            label="Last Name"
                            type="text"
                            placeholder="Doe"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            required
                        />

                        {/* Email */}
                        <Input
                            label="Email"
                            type="email"
                            placeholder={selectedUserType === 'organizer' ? 'you@uom.lk' : 'you@example.com'}
                            value={formData.email}
                            onChange={(e) => {
                                setFormData({ ...formData, email: e.target.value })
                                setErrors({ ...errors, email: '' })
                            }}
                            error={errors.email}
                            required
                        />

                        {/* Password */}
                        <PasswordInput
                            label="Password"
                            placeholder="At least 8 characters"
                            value={formData.password}
                            onChange={(e) => {
                                setFormData({ ...formData, password: e.target.value })
                                setErrors({ ...errors, password: '' })
                            }}
                            error={errors.password}
                            required
                        />

                        {/* General Error */}
                        {errors.general && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {errors.general}
                            </div>
                        )}

                        {/* CAPTCHA Widget */}
                        <div id="clerk-captcha" />

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            variant="primary"
                            fullWidth
                            disabled={loading || !isSignUpLoaded}
                        >
                            {loading ? 'Creating account...' : `Sign Up as ${selectedUserType === 'organizer' ? 'Organizer' : 'Sponsor'}`}
                        </Button>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-gray-600 mt-6">
                    Already have an account?{' '}
                    <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                        Log in
                    </Link>
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
            <SignUpForm />
        </Suspense>
    )
}
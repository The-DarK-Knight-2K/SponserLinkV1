// Path: app/forgot-password/page.tsx

'use client'

import { useSignIn } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
    const { signIn, isLoaded } = useSignIn()
    const router = useRouter()

    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        if (!isLoaded) {
            setLoading(false)
            return
        }

        try {
            await signIn.create({
                strategy: 'reset_password_email_code',
                identifier: email
            })

            // Store email for next page
            sessionStorage.setItem('resetEmail', email)
            router.push('/reset-password')
        } catch (err: any) {
            console.error('Forgot password error:', err)
            const clerkError = err.errors?.[0]
            if (clerkError?.code === 'form_identifier_not_found') {
                setError('No account found with this email address')
            } else {
                setError('Failed to send reset code. Please try again.')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
            <div className="w-full max-w-md">
                {/* Back Link */}
                <Link
                    href="/login"
                    className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to login
                </Link>

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-2">
                        Reset Password
                    </h1>
                    <p className="text-gray-600">
                        Enter your email to receive a reset code
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value)
                                setError('')
                            }}
                            required
                        />

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
                            disabled={loading || !isLoaded}
                        >
                            {loading ? 'Sending code...' : 'Send Reset Code'}
                        </Button>
                    </form>
                </div>

                {/* Help Text */}
                <p className="text-center text-sm text-gray-500 mt-6">
                    We'll send a 6-digit code to your email
                </p>
            </div>
        </div>
    )
}
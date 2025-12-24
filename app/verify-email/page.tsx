// Path: app/verify-email/page.tsx

'use client'

import { useSignUp, useUser, useClerk } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { CheckCircle } from 'lucide-react'

export default function VerifyEmailPage() {
    const { signUp, isLoaded } = useSignUp()
    const { user } = useUser()
    const { setActive } = useClerk()
    const router = useRouter()

    const [code, setCode] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const [resendLoading, setResendLoading] = useState(false)
    const [resendMessage, setResendMessage] = useState('')
    const [countdown, setCountdown] = useState(0)

    // If user is already verified, redirect
    useEffect(() => {
        if (user?.primaryEmailAddress?.verification?.status === 'verified') {
            router.push('/auth-redirect')
        }
    }, [user, router])

    // Countdown timer for resend button
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [countdown])

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        if (!isLoaded || !signUp) {
            setLoading(false)
            return
        }

        try {
            const result = await signUp.attemptEmailAddressVerification({
                code: code
            })

            if (result.status === 'complete') {
                // Activate the session before redirecting
                await setActive({ session: result.createdSessionId })

                setSuccess(true)
                // Wait a moment to show success, then redirect
                setTimeout(() => {
                    router.push('/auth-redirect')
                }, 1500)
            }
        } catch (err: any) {
            console.error('Verification error:', err)
            const clerkError = err.errors?.[0]
            if (clerkError?.code === 'verification_failed') {
                setError('Invalid code. Please try again.')
            } else if (clerkError?.code === 'verification_expired') {
                setError('Code expired. Please request a new one.')
            } else {
                setError('Verification failed. Please try again.')
            }
        } finally {
            setLoading(false)
        }
    }

    const handleResend = async () => {
        setResendLoading(true)
        setResendMessage('')
        setError('')

        if (!isLoaded || !signUp) {
            setResendLoading(false)
            return
        }

        try {
            await signUp.prepareEmailAddressVerification({
                strategy: 'email_code'
            })
            setResendMessage('New code sent to your email!')
            setCountdown(30) // 30 second cooldown
        } catch (err) {
            console.error('Resend error:', err)
            setError('Failed to resend code. Please try again.')
        } finally {
            setResendLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
                <div className="text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Verified!</h1>
                    <p className="text-gray-600">Redirecting you now...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-2">
                        Verify Your Email
                    </h1>
                    <p className="text-gray-600">
                        We sent a 6-digit code to
                    </p>
                    <p className="text-gray-900 font-medium mt-1">
                        {signUp?.emailAddress || 'your email'}
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleVerify} className="space-y-6">
                        {/* Code Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Verification Code
                            </label>
                            <input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={6}
                                placeholder="000000"
                                value={code}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '')
                                    setCode(value)
                                    setError('')
                                }}
                                className="w-full px-4 py-3 text-center text-2xl tracking-widest rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                required
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {/* Success Message */}
                        {resendMessage && (
                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                                {resendMessage}
                            </div>
                        )}

                        {/* Verify Button */}
                        <Button
                            type="submit"
                            variant="primary"
                            fullWidth
                            disabled={loading || code.length !== 6}
                        >
                            {loading ? 'Verifying...' : 'Verify Email'}
                        </Button>

                        {/* Resend Button */}
                        <div className="text-center">
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={resendLoading || countdown > 0}
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium disabled:text-gray-400 disabled:cursor-not-allowed"
                            >
                                {resendLoading
                                    ? 'Sending...'
                                    : countdown > 0
                                        ? `Resend code in ${countdown}s`
                                        : "Didn't receive code? Resend"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Help Text */}
                <p className="text-center text-sm text-gray-500 mt-6">
                    Check your spam folder if you don't see the email
                </p>
            </div>
        </div>
    )
}
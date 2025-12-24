// Path: app/reset-password/page.tsx

'use client'

import { useSignIn } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { PasswordInput } from '@/components/ui/PasswordInput'
import { CheckCircle } from 'lucide-react'

export default function ResetPasswordPage() {
    const { signIn, isLoaded, setActive } = useSignIn()
    const router = useRouter()

    const [email, setEmail] = useState('')
    const [formData, setFormData] = useState({
        code: '',
        password: '',
        confirmPassword: ''
    })
    const [errors, setErrors] = useState<{ [key: string]: string }>({})
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    // Get email from session storage
    useEffect(() => {
        const storedEmail = sessionStorage.getItem('resetEmail')
        if (storedEmail) {
            setEmail(storedEmail)
        } else {
            // If no email stored, redirect to forgot password
            router.push('/forgot-password')
        }
    }, [router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({})
        setLoading(true)

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setErrors({ confirmPassword: 'Passwords do not match' })
            setLoading(false)
            return
        }

        if (!isLoaded || !signIn) {
            setLoading(false)
            return
        }

        try {
            const result = await signIn.attemptFirstFactor({
                strategy: 'reset_password_email_code',
                code: formData.code,
                password: formData.password
            })

            if (result.status === 'complete') {
                // Set the active session
                await setActive({ session: result.createdSessionId })

                setSuccess(true)
                sessionStorage.removeItem('resetEmail')

                // Wait a moment to show success, then redirect
                setTimeout(() => {
                    router.push('/auth-redirect')
                }, 1500)
            }
        } catch (err: any) {
            console.error('Reset password error:', err)
            const clerkError = err.errors?.[0]
            if (clerkError) {
                switch (clerkError.code) {
                    case 'form_code_incorrect':
                    case 'verification_failed':
                        setErrors({ code: 'Invalid code. Please try again.' })
                        break
                    case 'form_password_pwned':
                        setErrors({ password: 'This password is too common. Choose a stronger one.' })
                        break
                    case 'form_password_length_too_short':
                        setErrors({ password: 'Password must be at least 8 characters' })
                        break
                    default:
                        setErrors({ general: clerkError.message || 'Password reset failed. Please try again.' })
                }
            } else {
                setErrors({ general: 'Password reset failed. Please try again.' })
            }
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
                <div className="text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <CheckCircle className="w-12 h-12 text-green-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Password Reset!</h1>
                    <p className="text-gray-600">Logging you in...</p>
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
                        Set New Password
                    </h1>
                    <p className="text-gray-600">
                        Enter the code sent to
                    </p>
                    <p className="text-gray-900 font-medium mt-1">{email}</p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
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
                                value={formData.code}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '')
                                    setFormData({ ...formData, code: value })
                                    setErrors({ ...errors, code: '' })
                                }}
                                className={`w-full px-4 py-3 text-center text-2xl tracking-widest rounded-lg border-2 transition-colors
                                    ${errors.code
                                        ? 'border-red-500 focus:border-red-600'
                                        : 'border-gray-300 focus:border-blue-500'
                                    }
                                    focus:ring-2 focus:ring-offset-1 focus:outline-none`}
                                required
                            />
                            {errors.code && (
                                <p className="mt-1 text-sm text-red-600">{errors.code}</p>
                            )}
                        </div>

                        {/* New Password */}
                        <PasswordInput
                            label="New Password"
                            placeholder="At least 8 characters"
                            value={formData.password}
                            onChange={(e) => {
                                setFormData({ ...formData, password: e.target.value })
                                setErrors({ ...errors, password: '' })
                            }}
                            error={errors.password}
                            required
                        />

                        {/* Confirm Password */}
                        <PasswordInput
                            label="Confirm Password"
                            placeholder="Re-enter password"
                            value={formData.confirmPassword}
                            onChange={(e) => {
                                setFormData({ ...formData, confirmPassword: e.target.value })
                                setErrors({ ...errors, confirmPassword: '' })
                            }}
                            error={errors.confirmPassword}
                            required
                        />

                        {/* General Error */}
                        {errors.general && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {errors.general}
                            </div>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            variant="primary"
                            fullWidth
                            disabled={loading || formData.code.length !== 6}
                        >
                            {loading ? 'Resetting password...' : 'Reset Password'}
                        </Button>
                    </form>
                </div>

                {/* Help Text */}
                <p className="text-center text-sm text-gray-500 mt-6">
                    After reset, you'll be logged in automatically
                </p>
            </div>
        </div>
    )
}
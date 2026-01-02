// app/complete-profile/page.tsx
'use client'

import { useUser } from '@clerk/nextjs'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { useAuthGuard } from '@/hooks/useAuthGuard'

export default function CompleteProfilePage() {
    const { user } = useUser()
    const router = useRouter()
    const { isLoading: authLoading } = useAuthGuard({
        requireAuth: true,
        requireVerified: true,
        redirectTo: '/auth/login'
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    // removed selectedRole state as it is no longer used

    // Get the user type from metadata (set during signup)
    const existingUserType = user?.unsafeMetadata?.userType as 'organizer' | 'sponsor' | undefined

    // Form state for organizer
    const [organizerData, setOrganizerData] = useState({
        organizationName: (user?.unsafeMetadata?.organizationName as string) || '',
        officialTitle: (user?.unsafeMetadata?.officialTitle as string) || '',
        bio: (user?.unsafeMetadata?.bio as string) || ''
    })

    // Form state for sponsor
    const [sponsorData, setSponsorData] = useState({
        companyName: (user?.unsafeMetadata?.companyName as string) || '',
        companyDescription: (user?.unsafeMetadata?.companyDescription as string) || '',
        sponsorshipPreferences: (user?.unsafeMetadata?.sponsorshipPreferences as string) || ''
    })

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const effectiveUserType = existingUserType

        if (!effectiveUserType) {
            setError('Please select a role')
            setLoading(false)
            return
        }

        try {
            // Update user's metadata with completed profile
            await user?.update({
                unsafeMetadata: {
                    ...user.unsafeMetadata,
                    userType: effectiveUserType,
                    ...(effectiveUserType === 'organizer' ? organizerData : sponsorData)
                }
            })

            // Redirect based on user type
            if (effectiveUserType === 'organizer') {
                router.push('/organizer/home')
            } else {
                router.push('/sponsor/home')
            }
        } catch (err) {
            console.error('Error updating profile:', err)
            setError('Failed to update profile. Please try again.')
            setLoading(false)
        }
    }

    // Show loading while checking auth
    if (authLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    // Determine effective user type
    const effectiveUserType = existingUserType

    // If no user type yet, this is an error state - redirect to account error
    if (!effectiveUserType) {
        // We need to wait for router to be ready/user to be loaded before redirecting
        // but since we check 'user' existence above, we can just return null and redirect
        // However, useAuthGuard might already be redirecting, so we can just show loading or error
        if (typeof window !== 'undefined') {
            router.push('/auth/account-error')
        }
        return null
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-2">
                        Complete Your Profile
                    </h1>
                    <p className="text-gray-600">
                        {effectiveUserType === 'organizer'
                            ? 'Tell us about your organization'
                            : 'Tell us about your company'}
                    </p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {effectiveUserType === 'organizer' ? (
                            <>
                                {/* Organizer Fields */}
                                <Input
                                    label="Organization/Club/Institute Name"
                                    placeholder="e.g., University Tech Club"
                                    value={organizerData.organizationName}
                                    onChange={(e) => setOrganizerData({
                                        ...organizerData,
                                        organizationName: e.target.value
                                    })}
                                    required
                                />

                                <Input
                                    label="Official Title/Position"
                                    placeholder="e.g., Club President, Event Coordinator"
                                    value={organizerData.officialTitle}
                                    onChange={(e) => setOrganizerData({
                                        ...organizerData,
                                        officialTitle: e.target.value
                                    })}
                                    required
                                />

                                <Textarea
                                    label="Bio (Optional)"
                                    placeholder="Tell sponsors about yourself and your organization..."
                                    value={organizerData.bio}
                                    onChange={(e) => setOrganizerData({
                                        ...organizerData,
                                        bio: e.target.value
                                    })}
                                    rows={4}
                                />
                            </>
                        ) : (
                            <>
                                {/* Sponsor Fields */}
                                <Input
                                    label="Company Name"
                                    placeholder="e.g., TechCo Inc."
                                    value={sponsorData.companyName}
                                    onChange={(e) => setSponsorData({
                                        ...sponsorData,
                                        companyName: e.target.value
                                    })}
                                    required
                                />

                                <Textarea
                                    label="Company Description"
                                    placeholder="Tell organizers about your company and mission..."
                                    value={sponsorData.companyDescription}
                                    onChange={(e) => setSponsorData({
                                        ...sponsorData,
                                        companyDescription: e.target.value
                                    })}
                                    required
                                    rows={4}
                                />

                                <Textarea
                                    label="Sponsorship Preferences"
                                    placeholder="What types of events or causes do you like to sponsor? (e.g., tech events, youth initiatives, education)"
                                    value={sponsorData.sponsorshipPreferences}
                                    onChange={(e) => setSponsorData({
                                        ...sponsorData,
                                        sponsorshipPreferences: e.target.value
                                    })}
                                    required
                                    rows={4}
                                />
                            </>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            variant="primary"
                            fullWidth
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Complete Profile'}
                        </Button>
                    </form>
                </div>

                {/* Help Text */}
                <p className="text-center text-sm text-gray-500 mt-6">
                    You can update this information later in your profile settings
                </p>
            </div>
        </div>
    )
}
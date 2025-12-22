'use client'

import { useUser } from '@clerk/nextjs'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'

export default function CompleteProfilePage() {
    const { user } = useUser()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Get the user type from unsafeMetadata (set during signup)
    const userType = user?.unsafeMetadata?.userType as 'organizer' | 'sponsor' | undefined

    // Form state for organizer
    const [organizerData, setOrganizerData] = useState({
        organizationName: '',
        officialTitle: '',
        bio: ''
    })

    // Form state for sponsor
    const [sponsorData, setSponsorData] = useState({
        companyName: '',
        companyDescription: '',
        sponsorshipPreferences: ''
    })

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            // Update user's public metadata with completed profile
            await user?.update({
                unsafeMetadata: {
                    ...user.unsafeMetadata,
                    userType: userType,
                    ...(userType === 'organizer' ? organizerData : sponsorData)
                }
            })

            // Redirect based on user type
            if (userType === 'organizer') {
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

    // Loading state
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    // If no user type, redirect to signup
    if (!userType) {
        router.push('/signup')
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
                        {userType === 'organizer'
                            ? 'Tell us about your organization'
                            : 'Tell us about your company'}
                    </p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {userType === 'organizer' ? (
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
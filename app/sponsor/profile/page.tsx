// app/sponsor/profile/page.tsx
'use client'

import { useUser, UserButton } from '@clerk/nextjs'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { useState, useEffect } from 'react'
import { Edit2, Save, X, CheckCircle } from 'lucide-react'
import { useAuthGuard } from '@/hooks/useAuthGuard'

export default function SponsorProfilePage() {
    const { user } = useUser()
    const { isLoading: authLoading } = useAuthGuard({
        requireAuth: true,
        requireVerified: true,
        allowedUserTypes: ['sponsor'],
        redirectTo: '/login'
    })

    // Edit mode state
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    // Form state
    const [formData, setFormData] = useState({
        companyName: '',
        companyDescription: '',
        sponsorshipPreferences: ''
    })

    // Initialize form data when user loads
    useEffect(() => {
        if (user?.unsafeMetadata) {
            setFormData({
                companyName: (user.unsafeMetadata.companyName as string) || '',
                companyDescription: (user.unsafeMetadata.companyDescription as string) || '',
                sponsorshipPreferences: (user.unsafeMetadata.sponsorshipPreferences as string) || ''
            })
        }
    }, [user])

    // Handle form submission
    const handleSave = async () => {
        setLoading(true)
        setError('')
        setSuccess(false)

        try {
            // Validate required fields
            if (!formData.companyName || !formData.companyDescription || !formData.sponsorshipPreferences) {
                setError('All fields are required')
                setLoading(false)
                return
            }

            // Update Clerk user metadata
            await user?.update({
                unsafeMetadata: {
                    ...user.unsafeMetadata,
                    companyName: formData.companyName,
                    companyDescription: formData.companyDescription,
                    sponsorshipPreferences: formData.sponsorshipPreferences
                }
            })

            setSuccess(true)
            setIsEditing(false)
            setTimeout(() => setSuccess(false), 3000)
        } catch (err) {
            console.error('Error updating profile:', err)
            setError('Failed to update profile. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    // Handle cancel
    const handleCancel = () => {
        if (user?.unsafeMetadata) {
            setFormData({
                companyName: (user.unsafeMetadata.companyName as string) || '',
                companyDescription: (user.unsafeMetadata.companyDescription as string) || '',
                sponsorshipPreferences: (user.unsafeMetadata.sponsorshipPreferences as string) || ''
            })
        }
        setIsEditing(false)
        setError('')
    }

    // Show loading state
    if (authLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 pb-24">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">SL</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900">Profile</span>
                    </div>
                    <UserButton
                        afterSignOutUrl="/login"
                        appearance={{
                            elements: {
                                avatarBox: 'w-10 h-10'
                            }
                        }}
                    />
                </div>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-8">
                {/* Success Message */}
                {success && (
                    <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <p className="text-green-800 font-medium">Profile updated successfully!</p>
                    </div>
                )}

                <Card>
                    {/* Profile Header */}
                    <div className="text-center mb-6">
                        <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <span className="text-white text-3xl font-bold">
                                {user?.unsafeMetadata?.companyName?.toString()[0] || 'C'}
                            </span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {user?.unsafeMetadata?.companyName as string || 'Company Name'}
                        </h2>
                        <p className="text-gray-600">{user?.firstName} {user?.lastName}</p>
                    </div>

                    {/* Edit/Save Buttons */}
                    <div className="flex justify-end gap-3 mb-6">
                        {!isEditing ? (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsEditing(true)}
                            >
                                <Edit2 className="w-4 h-4 mr-2" />
                                Edit Profile
                            </Button>
                        ) : (
                            <>
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={handleCancel}
                                    disabled={loading}
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Cancel
                                </Button>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={handleSave}
                                    disabled={loading}
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Profile Content */}
                    <div className="space-y-6">
                        {isEditing ? (
                            <>
                                <Input
                                    label="Company Name"
                                    value={formData.companyName}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        companyName: e.target.value
                                    })}
                                    placeholder="e.g., TechCo Inc."
                                    required
                                />

                                <Textarea
                                    label="Company Description"
                                    value={formData.companyDescription}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        companyDescription: e.target.value
                                    })}
                                    placeholder="Tell organizers about your company and mission..."
                                    rows={4}
                                    required
                                />

                                <Textarea
                                    label="Sponsorship Preferences"
                                    value={formData.sponsorshipPreferences}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        sponsorshipPreferences: e.target.value
                                    })}
                                    placeholder="What types of events or causes do you like to sponsor?"
                                    rows={4}
                                    required
                                />
                            </>
                        ) : (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Company Name
                                    </label>
                                    <p className="text-gray-900 text-lg">
                                        {user?.unsafeMetadata?.companyName as string || 'Not set'}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Company Description
                                    </label>
                                    <p className="text-gray-900 text-lg leading-relaxed">
                                        {user?.unsafeMetadata?.companyDescription as string || 'Not set'}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Sponsorship Preferences
                                    </label>
                                    <p className="text-gray-900 text-lg leading-relaxed">
                                        {user?.unsafeMetadata?.sponsorshipPreferences as string || 'Not set'}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Account Info */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Account Information</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                            <p>Contact Email: {user?.primaryEmailAddress?.emailAddress}</p>
                            <p>Account Type: Sponsor</p>
                            <p>Member since: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
                        </div>
                    </div>
                </Card>
            </main>
        </div>
    )
}
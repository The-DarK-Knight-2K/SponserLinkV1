// app/organizer/home/page.tsx
'use client'

import { useUser, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Plus, Search } from 'lucide-react'
import { useAuthGuard } from '@/hooks/useAuthGuard'

export default function OrganizerHomePage() {
    const { user } = useUser()
    const { isLoading } = useAuthGuard({
        requireAuth: true,
        requireVerified: true,
        allowedUserTypes: ['organizer'],
        redirectTo: '/login'
    })

    // Get organizer info from metadata
    const organizationName = user?.unsafeMetadata?.organizationName as string
    const officialTitle = user?.unsafeMetadata?.officialTitle as string
    const userName = user?.firstName || 'there'

    // Show loading state
    if (isLoading || !user) {
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">SL</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900">Sponsorlink</span>
                    </div>

                    {/* User Menu */}
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600 hidden sm:block">
                            {organizationName}
                        </span>
                        <UserButton
                            afterSignOutUrl="/login"
                            appearance={{
                                elements: {
                                    avatarBox: 'w-10 h-10'
                                }
                            }}
                        />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8 pb-24">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome back, {userName}!
                    </h1>
                    <p className="text-gray-600">
                        {officialTitle} at {organizationName}
                    </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="text-center">
                        <div className="text-4xl font-bold text-blue-600 mb-2">0</div>
                        <p className="text-gray-600">Active Projects</p>
                    </Card>
                    <Card className="text-center">
                        <div className="text-4xl font-bold text-green-600 mb-2">0</div>
                        <p className="text-gray-600">Sponsors Reached</p>
                    </Card>
                    <Card className="text-center">
                        <div className="text-4xl font-bold text-purple-600 mb-2">0</div>
                        <p className="text-gray-600">Prospects</p>
                    </Card>
                </div>

                {/* My Projects Section */}
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">My Projects</h2>
                        <Link href="/organizer/project/new">
                            <Button variant="primary" size="md">
                                <Plus className="w-5 h-5 mr-2" />
                                Create Project
                            </Button>
                        </Link>
                    </div>

                    {/* Empty State */}
                    <Card className="text-center py-12">
                        <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <Plus className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No projects yet
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            Create your first project to start connecting with sponsors who believe in your vision.
                        </p>
                        <Link href="/organizer/project/new">
                            <Button variant="primary">
                                Create Your First Project
                            </Button>
                        </Link>
                    </Card>
                </section>

                {/* Browse Sponsors Section */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Browse Sponsors</h2>
                        <Link href="/organizer/browse-sponsors">
                            <Button variant="outline" size="md">
                                <Search className="w-5 h-5 mr-2" />
                                View All
                            </Button>
                        </Link>
                    </div>

                    {/* Empty State */}
                    <Card className="text-center py-12">
                        <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <Search className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Discover Sponsors
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            Browse our directory of sponsors looking to support projects like yours.
                        </p>
                        <Link href="/organizer/browse-sponsors">
                            <Button variant="primary">
                                Browse Sponsors
                            </Button>
                        </Link>
                    </Card>
                </section>
            </main>
        </div>
    )
}
'use client'

import { useUser, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Plus, Search, User } from 'lucide-react'

export default function OrganizerHomePage() {
    const { user } = useUser()

    // Get organizer info from metadata
    const organizationName = user?.unsafeMetadata?.organizationName as string
    const officialTitle = user?.unsafeMetadata?.officialTitle as string
    const userName = user?.firstName || 'there'

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">SL</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900">Sponsorlink-org</span>
                    </div>

                    {/* User Menu */}
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600 hidden sm:block">
                            {organizationName}
                        </span>
                        <UserButton
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
            <main className="max-w-7xl mx-auto px-4 py-8">
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

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:hidden">
                <div className="flex justify-around py-3">
                    <Link href="/organizer/home" className="flex flex-col items-center gap-1 text-blue-600">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                        </div>
                        <span className="text-xs font-medium">Home</span>
                    </Link>

                    <Link href="/organizer/project/new" className="flex flex-col items-center gap-1 text-gray-500">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Plus className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-medium">Add</span>
                    </Link>

                    <Link href="/organizer/browse-sponsors" className="flex flex-col items-center gap-1 text-gray-500">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Search className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-medium">Browse</span>
                    </Link>

                    <Link href="/organizer/profile" className="flex flex-col items-center gap-1 text-gray-500">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <User className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-medium">Profile</span>
                    </Link>
                </div>
            </nav>
        </div>
    )
}
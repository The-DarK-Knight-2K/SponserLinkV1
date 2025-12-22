'use client'

import { useUser, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Search, User, Bell } from 'lucide-react'

export default function SponsorHomePage() {
    const { user } = useUser()

    // Get sponsor info from metadata
    const companyName = user?.unsafeMetadata?.companyName as string
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
                        <span className="text-xl font-bold text-gray-900">Sponsorlink-spo</span>
                    </div>

                    {/* User Menu */}
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600 hidden sm:block">
                            {companyName}
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
                        {companyName}
                    </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="text-center">
                        <div className="text-4xl font-bold text-blue-600 mb-2">0</div>
                        <p className="text-gray-600">Tagged Projects</p>
                    </Card>
                    <Card className="text-center">
                        <div className="text-4xl font-bold text-green-600 mb-2">0</div>
                        <p className="text-gray-600">Projects Viewed</p>
                    </Card>
                    <Card className="text-center">
                        <div className="text-4xl font-bold text-purple-600 mb-2">0</div>
                        <p className="text-gray-600">Prospects</p>
                    </Card>
                </div>

                {/* Tagged For You Section */}
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                Tagged For You
                                <span className="bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
                                    0 new
                                </span>
                            </h2>
                            <p className="text-gray-600 text-sm mt-1">
                                Projects that specifically selected you as a sponsor
                            </p>
                        </div>
                    </div>

                    {/* Empty State */}
                    <Card className="text-center py-12">
                        <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <Bell className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            No tagged projects yet
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            When organizers select you for their projects, they&apos;ll appear here. Check out all projects to discover opportunities.
                        </p>
                        <Link href="/sponsor/browse-projects">
                            <Button variant="primary">
                                Browse All Projects
                            </Button>
                        </Link>
                    </Card>
                </section>

                {/* All Projects Section */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">All Projects</h2>
                        <Link href="/sponsor/browse-projects">
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
                            Discover Projects
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                            Explore all available projects and find the perfect match for your brand.
                        </p>
                        <Link href="/sponsor/browse-projects">
                            <Button variant="primary">
                                Browse Projects
                            </Button>
                        </Link>
                    </Card>
                </section>
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:hidden">
                <div className="flex justify-around py-3">
                    <Link href="/sponsor/home" className="flex flex-col items-center gap-1 text-blue-600">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                        </div>
                        <span className="text-xs font-medium">Home</span>
                    </Link>

                    <Link href="/sponsor/browse-projects" className="flex flex-col items-center gap-1 text-gray-500">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Search className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-medium">Browse</span>
                    </Link>

                    <Link href="/sponsor/profile" className="flex flex-col items-center gap-1 text-gray-500">
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
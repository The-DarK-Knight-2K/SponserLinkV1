'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Bookmark, User } from 'lucide-react'

export function SponsorNav() {
    const pathname = usePathname()

    // Helper function to check if a nav item is active
    const isActive = (path: string) => {
        return pathname === path || pathname.startsWith(path)
    }

    // Navigation items configuration
    const navItems = [
        {
            name: 'Home',
            href: '/sponsor/home',
            icon: Home,
        },
        {
            name: 'Browse',
            href: '/sponsor/browse-projects',
            icon: Search,
        },
        {
            name: 'Prospects',
            href: '/sponsor/prospects',
            icon: Bookmark,
        },
        {
            name: 'Profile',
            href: '/sponsor/profile',
            icon: User,
        },
    ]

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 safe-area-inset-bottom">
            <div className="max-w-lg mx-auto">
                <div className="flex justify-around items-center h-16">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const active = isActive(item.href)

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="flex flex-col items-center justify-center flex-1 h-full group"
                            >
                                {/* Icon Container */}
                                <div className={`
                  relative transition-all duration-200
                  ${active ? 'scale-110' : 'scale-100 group-hover:scale-105'}
                `}>
                                    <Icon
                                        className={`
                      w-6 h-6 transition-colors duration-200
                      ${active
                                                ? 'text-blue-600 stroke-[2.5]'
                                                : 'text-gray-600 group-hover:text-gray-900'
                                            }
                    `}
                                        fill={active && item.name === 'Prospects' ? 'currentColor' : 'none'}
                                    />

                                    {/* Active indicator dot */}
                                    {active && (
                                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                                            <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                                        </div>
                                    )}
                                </div>

                                {/* Label */}
                                <span className={`
                  text-xs font-medium mt-1 transition-colors duration-200
                  ${active
                                        ? 'text-blue-600'
                                        : 'text-gray-600 group-hover:text-gray-900'
                                    }
                `}>
                                    {item.name}
                                </span>
                            </Link>
                        )
                    })}
                </div>
            </div>
        </nav>
    )
}
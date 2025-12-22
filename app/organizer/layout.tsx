import { OrganizerNav } from '@/components/navigation/OrganizerNav'

export default function OrganizerLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            {/* Main Content */}
            {children}

            {/* Bottom Navigation - Shared across all organizer pages */}
            <OrganizerNav />
        </>
    )
}
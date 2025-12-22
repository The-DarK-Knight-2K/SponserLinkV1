import { SponsorNav } from '@/components/navigation/SponsorNav'

export default function SponsorLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            {/* Main Content */}
            {children}

            {/* Bottom Navigation - Shared across all sponsor pages */}
            <SponsorNav />
        </>
    )
}
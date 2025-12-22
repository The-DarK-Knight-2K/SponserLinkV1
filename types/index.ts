// User types
export type UserType = 'organizer' | 'sponsor'

// This extends Clerk's User type with our custom metadata
export interface UserPublicMetadata {
    userType?: UserType
    organizationName?: string
    officialTitle?: string
    companyName?: string
    companyDescription?: string
    sponsorshipPreferences?: string
}

// Helper to check if user has completed signup
export function hasCompletedSignup(metadata: UserPublicMetadata): boolean {
    return !!metadata.userType
}

// Type guard to check user type
export function isOrganizer(metadata: UserPublicMetadata): boolean {
    return metadata.userType === 'organizer'
}

export function isSponsor(metadata: UserPublicMetadata): boolean {
    return metadata.userType === 'sponsor'
}
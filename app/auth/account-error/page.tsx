'use client'

import { useClerk } from '@clerk/nextjs'
import { Button } from '@/components/ui/Button'
import { AlertTriangle } from 'lucide-react'

export default function AccountErrorPage() {
    const { signOut } = useClerk()

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    Account Error
                </h1>

                <p className="text-gray-600 mb-6">
                    Your account is missing required information and cannot be accessed.
                </p>

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8">
                    <p className="text-sm text-blue-800">
                        Please contact support at <a href="mailto:support@sponsorlink.com" className="font-semibold underline">support@sponsorlink.com</a> for assistance.
                    </p>
                </div>

                <Button
                    onClick={() => signOut({ redirectUrl: '/' })}
                    variant="outline"
                    fullWidth
                >
                    Sign Out
                </Button>
            </div>
        </div>
    )
}

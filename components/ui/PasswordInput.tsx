// Path: components/ui/PasswordInput.tsx

'use client'

import { InputHTMLAttributes, forwardRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ className = '', label, error, ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false)

        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}

                <div className="relative">
                    <input
                        ref={ref}
                        type={showPassword ? 'text' : 'password'}
                        className={`
                            w-full px-4 py-3 pr-12 rounded-lg border-2 transition-colors
                            ${error
                                ? 'border-red-500 focus:border-red-600 focus:ring-red-500'
                                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                            }
                            focus:outline-none focus:ring-2 focus:ring-offset-1
                            disabled:bg-gray-100 disabled:cursor-not-allowed
                            ${className}
                        `.trim().replace(/\s+/g, ' ')}
                        {...props}
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                        tabIndex={-1}
                    >
                        {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                        ) : (
                            <Eye className="w-5 h-5" />
                        )}
                    </button>
                </div>

                {error && (
                    <p className="mt-1 text-sm text-red-600">{error}</p>
                )}
            </div>
        )
    }
)

PasswordInput.displayName = 'PasswordInput'

export { PasswordInput }
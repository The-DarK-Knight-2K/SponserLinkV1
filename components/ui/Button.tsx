import { ButtonHTMLAttributes, forwardRef } from 'react'

// Define props for our Button component
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline'
    size?: 'sm' | 'md' | 'lg'
    fullWidth?: boolean
}

// forwardRef allows parent components to access the button's DOM element
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({
        className = '',
        variant = 'primary',
        size = 'md',
        fullWidth = false,
        children,
        ...props
    }, ref) => {

        // Base styles that all buttons share
        const baseStyles = 'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

        // Variant-specific styles
        const variantStyles = {
            primary: 'bg-blue-600 text-white hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg focus:ring-blue-500',
            secondary: 'bg-gray-100 text-gray-900 border-2 border-gray-300 hover:bg-gray-200 hover:-translate-y-0.5 hover:border-gray-400 focus:ring-gray-500',
            outline: 'bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500'
        }

        // Size-specific styles
        const sizeStyles = {
            sm: 'px-3 py-1.5 text-sm',
            md: 'px-4 py-3 text-base',
            lg: 'px-6 py-4 text-lg'
        }

        // Combine all styles
        const combinedStyles = `
      ${baseStyles}
      ${variantStyles[variant]}
      ${sizeStyles[size]}
      ${fullWidth ? 'w-full' : ''}
      ${className}
    `.trim().replace(/\s+/g, ' ')

        return (
            <button
                ref={ref}
                className={combinedStyles}
                {...props}
            >
                {children}
            </button>
        )
    }
)

Button.displayName = 'Button'

export { Button }
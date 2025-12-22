import { HTMLAttributes, forwardRef } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    hover?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className = '', hover = false, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={`
          bg-white rounded-2xl shadow-lg p-10
          ${hover ? 'hover:shadow-xl transition-all duration-300 hover:-translate-y-1' : ''}
          ${className}
        `.trim().replace(/\s+/g, ' ')}
                {...props}
            >
                {children}
            </div>
        )
    }
)

Card.displayName = 'Card'

export { Card }
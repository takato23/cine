'use client'

import { type HTMLAttributes, forwardRef, type ReactNode } from 'react'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
    size?: 'sm' | 'md'
    dot?: boolean
    icon?: ReactNode
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
    ({ children, variant = 'default', size = 'md', dot = false, icon, className = '', ...props }, ref) => {
        const baseStyles = 'inline-flex items-center gap-1.5 rounded-full font-semibold'

        const variantStyles = {
            default: 'bg-neutral-800 text-neutral-200 border border-neutral-700',
            primary: 'bg-primary-500/20 text-primary-300 border border-primary-500/30',
            secondary: 'bg-secondary-500/20 text-secondary-400 border border-secondary-500/30',
            success: 'bg-success/20 text-green-300 border border-success/30',
            warning: 'bg-warning/20 text-yellow-300 border border-warning/30',
            error: 'bg-error/20 text-red-300 border border-error/30',
            info: 'bg-info/20 text-blue-300 border border-info/30',
        }

        const sizeStyles = {
            sm: 'text-xs px-2 py-0.5',
            md: 'text-xs px-3 py-1',
        }

        const dotColors = {
            default: 'bg-neutral-400',
            primary: 'bg-primary-400',
            secondary: 'bg-secondary-400',
            success: 'bg-success',
            warning: 'bg-warning',
            error: 'bg-error',
            info: 'bg-info',
        }

        return (
            <span
                ref={ref}
                className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
                {...props}
            >
                {dot && (
                    <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />
                )}
                {icon && <span className="w-3 h-3">{icon}</span>}
                {children}
            </span>
        )
    }
)

Badge.displayName = 'Badge'

// Status-specific badges for convenience
export function StatusBadge({ status, className = '' }: { status: 'ESTRENO' | 'CARTELERA' | 'PROXIMAMENTE' | string; className?: string }) {
    const config = {
        ESTRENO: { variant: 'primary' as const, label: 'Estreno', dot: true },
        CARTELERA: { variant: 'success' as const, label: 'En Cartelera', dot: true },
        PROXIMAMENTE: { variant: 'secondary' as const, label: 'Próximamente', dot: true },
    }

    const { variant, label, dot } = config[status as keyof typeof config] || { variant: 'default' as const, label: status, dot: false }

    return (
        <Badge variant={variant} dot={dot} className={className}>
            {label}
        </Badge>
    )
}

'use client'

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    isLoading?: boolean
    leftIcon?: ReactNode
    rightIcon?: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            children,
            variant = 'primary',
            size = 'md',
            isLoading = false,
            leftIcon,
            rightIcon,
            disabled,
            className = '',
            ...props
        },
        ref
    ) => {
        const baseStyles =
            'inline-flex select-none items-center justify-center gap-2 rounded-2xl font-semibold ' +
            'transition-all duration-fast ease-out ' +
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary ' +
            'active:translate-y-[1px] disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed'

        const variantStyles = {
            primary: 'bg-primary-500 text-white shadow-glow-primary hover:bg-primary-600',
            secondary:
                'bg-white/5 text-white border border-white/10 backdrop-blur-xl shadow-inner-glow hover:bg-white/8 hover:border-white/15',
            ghost: 'bg-transparent text-white/80 hover:text-white hover:bg-white/5',
            outline: 'bg-transparent border border-primary-500/40 text-primary-300 hover:bg-primary-500/10 hover:border-primary-500/60',
            danger: 'bg-error text-white shadow-lg hover:bg-red-500',
        }

        const sizeStyles = {
            sm: 'h-9 text-sm px-3',
            md: 'h-11 text-sm px-5',
            lg: 'h-12 text-base px-7',
        }

        const iconClass = 'h-4 w-4 shrink-0'

        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                aria-busy={isLoading || undefined}
                data-loading={isLoading ? 'true' : 'false'}
                className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
                {...props}
            >
                {isLoading ? (
                    <Loader2 className={cn(iconClass, 'animate-spin')} />
                ) : leftIcon ? (
                    <span className={iconClass} aria-hidden="true">
                        {leftIcon}
                    </span>
                ) : null}
                {children}
                {rightIcon && !isLoading && (
                    <span className={iconClass} aria-hidden="true">
                        {rightIcon}
                    </span>
                )}
            </button>
        )
    }
)

Button.displayName = 'Button'

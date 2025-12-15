'use client'

import { type ReactNode, type HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/cn'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'elevated' | 'glow' | 'outlined'
    padding?: 'none' | 'sm' | 'md' | 'lg'
    hover?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ children, variant = 'default', padding = 'md', hover = false, className = '', ...props }, ref) => {
        const baseStyles = 'rounded-3xl transition-all duration-normal ease-out'

        const variantStyles = {
            default: 'bg-bg-secondary/80 backdrop-blur-xl border border-white/10 shadow-card',
            elevated: 'bg-bg-secondary border border-white/10 shadow-enterprise',
            glow: 'bg-bg-secondary/80 backdrop-blur-xl border border-white/10 shadow-card hover:shadow-glow-soft hover:border-primary-500/30',
            outlined: 'bg-transparent border border-white/10',
        }

        const paddingStyles = {
            none: '',
            sm: 'p-4',
            md: 'p-6',
            lg: 'p-8',
        }

        const hoverStyles = hover
            ? 'hover:shadow-card-hover hover:border-white/15 hover:bg-white/[0.04] hover:scale-[1.01] cursor-pointer'
            : ''

        return (
            <div
                ref={ref}
                className={cn(baseStyles, variantStyles[variant], paddingStyles[padding], hoverStyles, className)}
                {...props}
            >
                {children}
            </div>
        )
    }
)

Card.displayName = 'Card'

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> { }

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
    ({ children, className = '', ...props }, ref) => (
        <div ref={ref} className={cn('mb-4', className)} {...props}>
            {children}
        </div>
    )
)

CardHeader.displayName = 'CardHeader'

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
    as?: 'h1' | 'h2' | 'h3' | 'h4'
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
    ({ children, as: Component = 'h3', className = '', ...props }, ref) => (
        <Component ref={ref} className={cn('text-xl font-bold text-white tracking-tight', className)} {...props}>
            {children}
        </Component>
    )
)

CardTitle.displayName = 'CardTitle'

export interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> { }

export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
    ({ children, className = '', ...props }, ref) => (
        <p ref={ref} className={cn('text-sm text-white/65 mt-1', className)} {...props}>
            {children}
        </p>
    )
)

CardDescription.displayName = 'CardDescription'

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> { }

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
    ({ children, className = '', ...props }, ref) => (
        <div ref={ref} className={className} {...props}>
            {children}
        </div>
    )
)

CardContent.displayName = 'CardContent'

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> { }

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
    ({ children, className = '', ...props }, ref) => (
        <div ref={ref} className={cn('mt-4 pt-4 border-t border-white/10', className)} {...props}>
            {children}
        </div>
    )
)

CardFooter.displayName = 'CardFooter'

'use client'

import { type InputHTMLAttributes, type TextareaHTMLAttributes, forwardRef, useId } from 'react'
import { cn } from '@/lib/cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    hint?: string
    icon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, hint, icon, className = '', id, ...props }, ref) => {
        const reactId = useId()
        const inputId = id || props.name || reactId
        const errorId = error ? `${inputId}-error` : undefined
        const hintId = hint ? `${inputId}-hint` : undefined
        const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-neutral-200 mb-2"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        id={inputId}
                        aria-invalid={!!error || undefined}
                        aria-describedby={describedBy}
                        className={cn(
                            'w-full rounded-2xl px-4 py-3 text-sm text-white',
                            'bg-bg-tertiary/70 border border-white/10 backdrop-blur-xl shadow-inner-glow',
                            'placeholder:text-white/35',
                            'transition-all duration-fast ease-out',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary',
                            'disabled:opacity-60 disabled:cursor-not-allowed',
                            error ? 'border-error/50 focus-visible:ring-error/40' : 'hover:border-white/15',
                            icon ? 'pl-11' : '',
                            className
                        )}
                        {...props}
                    />
                </div>
                {error && (
                    <p id={errorId} className="mt-1.5 text-xs text-error">
                        {error}
                    </p>
                )}
                {hint && !error && (
                    <p id={hintId} className="mt-1.5 text-xs text-white/55">
                        {hint}
                    </p>
                )}
            </div>
        )
    }
)

Input.displayName = 'Input'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string
    error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, className = '', id, ...props }, ref) => {
        const reactId = useId()
        const inputId = id || props.name || reactId
        const errorId = error ? `${inputId}-error` : undefined

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-neutral-200 mb-2"
                    >
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    id={inputId}
                    aria-invalid={!!error || undefined}
                    aria-describedby={errorId}
                    className={cn(
                        'w-full rounded-2xl px-4 py-3 text-sm text-white',
                        'bg-bg-tertiary/70 border border-white/10 backdrop-blur-xl shadow-inner-glow',
                        'placeholder:text-white/35 resize-none',
                        'transition-all duration-fast ease-out',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary',
                        'disabled:opacity-60 disabled:cursor-not-allowed',
                        error ? 'border-error/50 focus-visible:ring-error/40' : 'hover:border-white/15',
                        className
                    )}
                    rows={4}
                    {...props}
                />
                {error && (
                    <p id={errorId} className="mt-1.5 text-xs text-error">
                        {error}
                    </p>
                )}
            </div>
        )
    }
)

Textarea.displayName = 'Textarea'

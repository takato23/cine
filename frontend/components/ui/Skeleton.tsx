'use client'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
}

export function Skeleton({ className = '', variant = 'rectangular' }: SkeletonProps) {
  // Shimmer premium (ver keyframes `shimmer` en globals.css)
  const baseClasses =
    'bg-gradient-to-r from-bg-secondary via-bg-tertiary to-bg-secondary bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]'
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      aria-hidden="true"
    />
  )
}

export function MovieCardSkeleton() {
  return (
    <div className="bg-bg-secondary rounded-lg overflow-hidden">
      <Skeleton className="aspect-[2/3] w-full" />
      <div className="p-4 space-y-2">
        <Skeleton variant="text" className="h-5 w-3/4" />
        <Skeleton variant="text" className="h-4 w-1/2" />
      </div>
    </div>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-bg-tertiary rounded-lg p-4">
      <Skeleton className="aspect-square w-full mb-3" />
      <Skeleton variant="text" className="h-5 w-3/4 mb-2" />
      <Skeleton variant="text" className="h-4 w-1/2" />
    </div>
  )
}


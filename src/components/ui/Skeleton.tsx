import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

/**
 * Skeleton loading placeholder component
 * Shows animated placeholder while content is loading
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
}) => {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700';

  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: '',
    rounded: 'rounded-xl',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%]',
    none: '',
  };

  const style: React.CSSProperties = {
    width: width,
    height: height,
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
    />
  );
};

/**
 * Pizza card skeleton for loading state
 */
export const PizzaCardSkeleton: React.FC = () => {
  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-2xl shadow-card overflow-hidden">
      {/* Image skeleton */}
      <Skeleton className="aspect-[4/3] w-full" variant="rectangular" />

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <Skeleton className="h-6 w-3/4" variant="rounded" />

        {/* Description */}
        <Skeleton className="h-4 w-full" variant="rounded" />
        <Skeleton className="h-4 w-2/3" variant="rounded" />

        {/* Prep time */}
        <Skeleton className="h-4 w-20" variant="rounded" />

        {/* Price */}
        <div className="pt-2">
          <Skeleton className="h-8 w-24" variant="rounded" />
        </div>

        {/* Buttons */}
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-10 w-24" variant="rounded" />
          <Skeleton className="h-10 flex-1" variant="rounded" />
        </div>
      </div>
    </div>
  );
};

/**
 * Grid of pizza card skeletons
 */
export const PizzaGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <PizzaCardSkeleton key={index} />
      ))}
    </div>
  );
};

/**
 * Cart item skeleton
 */
export const CartItemSkeleton: React.FC = () => {
  return (
    <div className="flex gap-4 p-3 bg-white dark:bg-gray-800 rounded-xl">
      <Skeleton className="w-20 h-20" variant="rounded" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-2/3" variant="rounded" />
        <Skeleton className="h-4 w-1/3" variant="rounded" />
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-8 w-24" variant="rounded" />
          <Skeleton className="h-6 w-16" variant="rounded" />
        </div>
      </div>
    </div>
  );
};

export default Skeleton;

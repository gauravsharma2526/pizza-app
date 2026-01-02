import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
  style?: React.CSSProperties;
}

/**
 * Reusable Card component with optional hover effects
 */
export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  padding = 'md',
  onClick,
  style,
}) => {
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4 md:p-5',
    lg: 'p-6 md:p-8',
  };

  const hoverStyles = hover ? 'cursor-pointer hover:shadow-card-hover hover:-translate-y-1' : '';

  return (
    <div
      className={`bg-surface-light dark:bg-surface-dark rounded-2xl shadow-card transition-all duration-300 ease-out ${paddingStyles[padding]} ${hoverStyles} ${className}`}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  );
};

export default Card;

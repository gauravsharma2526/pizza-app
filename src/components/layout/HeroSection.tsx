import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface HeroBadge {
  icon: React.ReactNode;
  text: string;
}

export interface HeroSectionProps {
  /** Color theme: 'primary' or 'secondary' */
  theme?: 'primary' | 'secondary';
  /** Subtitle text shown above the title */
  subtitle: string;
  /** Main heading text */
  title: string;
  /** Description paragraph */
  description: string;
  /** Array of stat badges to display */
  badges?: HeroBadge[];
  /** Show back button with navigation to specified path */
  backTo?: string;
  /** Back button label */
  backLabel?: string;
}

/**
 * Reusable hero section component for page headers
 */
export const HeroSection: React.FC<HeroSectionProps> = ({
  theme = 'primary',
  subtitle,
  title,
  description,
  badges = [],
  backTo,
  backLabel = 'Back',
}) => {
  const navigate = useNavigate();

  // Theme-based gradient classes
  const gradientClass = theme === 'primary'
    ? 'from-primary-800 via-primary-700 to-primary-900'
    : 'from-secondary-800 via-secondary-700 to-secondary-900';

  // Accent color for decorative blobs
  const accentBlobClass = theme === 'primary'
    ? 'bg-secondary-400'
    : 'bg-primary-400';

  // Badge icon accent color
  const badgeIconClass = theme === 'primary'
    ? 'text-secondary-400'
    : 'text-primary-400';

  return (
    <section className={`relative bg-gradient-to-br ${gradientClass} overflow-hidden`}>
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl" />
        <div className={`absolute bottom-10 right-10 w-40 h-40 ${accentBlobClass} rounded-full blur-3xl`} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white rounded-full blur-3xl opacity-5" />
      </div>
      
      {/* Pattern overlay */}
      <div 
        className="absolute inset-0 opacity-5" 
        style={{ 
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', 
          backgroundSize: '32px 32px' 
        }} 
      />
      
      <div className="relative page-container py-16 md:py-20">
        {/* Back button */}
        {backTo && (
          <button
            onClick={() => navigate(backTo)}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            {backLabel}
          </button>
        )}
        
        <div className="text-center max-w-3xl mx-auto">
          {/* Subtitle */}
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-8 h-px bg-white/40" />
            <span className="text-white/90 text-sm md:text-base font-medium tracking-wider uppercase">
              {subtitle}
            </span>
            <span className="w-8 h-px bg-white/40" />
          </div>
          
          {/* Main heading */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            {title}
          </h1>
          
          {/* Description */}
          <p className="text-white/80 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            {description}
          </p>
          
          {/* Stats badges */}
          {badges.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
              {badges.map((badge, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20"
                >
                  <span className={badgeIconClass}>{badge.icon}</span>
                  <span className="text-white text-sm font-medium">{badge.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Bottom curve */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path 
            d="M0 60L60 55C120 50 240 40 360 35C480 30 600 30 720 32.5C840 35 960 40 1080 42.5C1200 45 1320 45 1380 45L1440 45V60H1380C1320 60 1200 60 1080 60C960 60 840 60 720 60C600 60 480 60 360 60C240 60 120 60 60 60H0V60Z" 
            className="fill-gray-50 dark:fill-gray-900"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;

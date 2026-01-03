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

  // Theme-based styles
  const isPrimary = theme === 'primary';

  return (
    <section className={`relative overflow-hidden ${
      isPrimary 
        ? 'bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700' 
        : 'bg-gradient-to-br from-secondary-600 via-secondary-500 to-secondary-700'
    }`}>
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large floating orbs */}
        <div className={`absolute -top-20 -left-20 w-80 h-80 rounded-full blur-3xl opacity-30 animate-float ${
          isPrimary ? 'bg-white' : 'bg-white'
        }`} />
        <div className={`absolute -bottom-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-20 ${
          isPrimary ? 'bg-secondary-300' : 'bg-primary-300'
        }`} style={{ animation: 'float 8s ease-in-out infinite reverse' }} />
        <div className={`absolute top-1/3 right-1/4 w-48 h-48 rounded-full blur-2xl opacity-20 ${
          isPrimary ? 'bg-yellow-300' : 'bg-amber-300'
        }`} style={{ animation: 'floatDelayed 6s ease-in-out infinite' }} />
        
        {/* Mesh gradient overlay */}
        <div className="absolute inset-0 opacity-30"
          style={{
            background: isPrimary
              ? 'radial-gradient(ellipse at 20% 30%, rgba(251, 191, 36, 0.3) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(255, 255, 255, 0.2) 0%, transparent 50%)'
              : 'radial-gradient(ellipse at 20% 30%, rgba(239, 68, 68, 0.3) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(255, 255, 255, 0.2) 0%, transparent 50%)'
          }}
        />
        
        {/* Subtle dot pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{ 
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', 
            backgroundSize: '24px 24px' 
          }} 
        />
      </div>
      
      {/* Content */}
      <div className="relative page-container py-12 md:py-16 lg:py-20">
        {/* Back button */}
        {backTo && (
          <button
            onClick={() => navigate(backTo)}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-all duration-200 mb-6 group bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="text-sm font-medium">{backLabel}</span>
          </button>
        )}
        
        <div className="text-center max-w-3xl mx-auto">
          {/* Subtitle pill */}
          <div className="inline-flex items-center gap-3 mb-5">
            <span className={`w-10 h-[2px] rounded-full ${isPrimary ? 'bg-secondary-400' : 'bg-primary-400'}`} />
            <span className="text-white/95 text-xs md:text-sm font-semibold tracking-[0.2em] uppercase">
              {subtitle}
            </span>
            <span className={`w-10 h-[2px] rounded-full ${isPrimary ? 'bg-secondary-400' : 'bg-primary-400'}`} />
          </div>
          
          {/* Main heading with gradient text effect */}
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 tracking-tight leading-[1.1]">
            <span className="drop-shadow-lg">{title}</span>
          </h1>
          
          {/* Description */}
          <p className="text-white/85 text-base md:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto font-light">
            {description}
          </p>
          
          {/* Stats badges */}
          {badges.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
              {badges.map((badge, index) => (
                <div 
                  key={index}
                  className={`flex items-center gap-2.5 px-5 py-2.5 rounded-full border backdrop-blur-md transition-all duration-300 hover:scale-105 ${
                    isPrimary 
                      ? 'bg-white/15 border-white/25 hover:bg-white/25' 
                      : 'bg-white/15 border-white/25 hover:bg-white/25'
                  }`}
                >
                  <span className={isPrimary ? 'text-secondary-300' : 'text-primary-300'}>
                    {badge.icon}
                  </span>
                  <span className="text-white text-sm font-medium">{badge.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Smooth bottom transition */}
      <div className="absolute bottom-0 left-0 right-0 h-16 md:h-20 overflow-hidden">
        <svg 
          viewBox="0 0 1440 120" 
          preserveAspectRatio="none" 
          className="absolute bottom-0 w-full h-full"
          fill="none"
        >
          {/* Subtle wave layers for depth */}
          <path 
            d="M0 120L48 105C96 90 192 60 288 55C384 50 480 70 576 77.5C672 85 768 80 864 70C960 60 1056 45 1152 42.5C1248 40 1344 50 1392 55L1440 60V120H0Z"
            className="fill-[#fefefe] dark:fill-[#0f0f0f]"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;

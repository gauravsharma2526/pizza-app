import React, { useState, useCallback } from 'react';
import { Quote, ChevronLeft, ChevronRight, Star, Sparkles } from 'lucide-react';
import reviewsData from '../../data/reviews.json';

interface Review {
  id: number;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  review: string;
  date: string;
  highlight: string;
}

/**
 * Customer Reviews carousel component with sliding animation
 */
export const CustomerReviews: React.FC = () => {
  const reviews: Review[] = reviewsData;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');

  const reviewsPerPage = 3;
  const maxIndex = Math.max(0, reviews.length - reviewsPerPage);

  const handleSlide = useCallback(
    (direction: 'left' | 'right') => {
      if (isSliding) return;

      setSlideDirection(direction);
      setIsSliding(true);

      setTimeout(() => {
        if (direction === 'right') {
          setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
        } else {
          setCurrentIndex((prev) => Math.max(prev - 1, 0));
        }

        setTimeout(() => {
          setIsSliding(false);
        }, 50);
      }, 200);
    },
    [isSliding, maxIndex]
  );

  const handleDotClick = useCallback(
    (index: number) => {
      if (isSliding || index === currentIndex) return;

      setSlideDirection(index > currentIndex ? 'right' : 'left');
      setIsSliding(true);

      setTimeout(() => {
        setCurrentIndex(index);
        setTimeout(() => {
          setIsSliding(false);
        }, 50);
      }, 200);
    },
    [isSliding, currentIndex]
  );

  const visibleReviews = reviews.slice(currentIndex, currentIndex + reviewsPerPage);

  return (
    <section className="py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-xl">
            <Quote className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Customer Reviews
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              What our pizza lovers are saying
            </p>
          </div>
        </div>

        {/* Navigation arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSlide('left')}
            disabled={currentIndex === 0 || isSliding}
            className="p-2 rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all border border-gray-100 dark:border-gray-700"
            aria-label="Previous reviews"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={() => handleSlide('right')}
            disabled={currentIndex >= maxIndex || isSliding}
            className="p-2 rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed transition-all border border-gray-100 dark:border-gray-700"
            aria-label="Next reviews"
          >
            <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Reviews Grid with Slide Animation */}
      <div className="overflow-hidden">
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-4 transition-all duration-300 ease-out ${
            isSliding
              ? slideDirection === 'right'
                ? 'opacity-0 translate-x-8'
                : 'opacity-0 -translate-x-8'
              : 'opacity-100 translate-x-0'
          }`}
        >
          {visibleReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>

      {/* Pagination dots */}
      <div className="flex items-center justify-center gap-1.5 mt-5">
        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
          <button
            key={i}
            onClick={() => handleDotClick(i)}
            disabled={isSliding}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === currentIndex
                ? 'w-6 bg-primary-500'
                : 'w-1.5 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
            }`}
            aria-label={`Go to review page ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

/**
 * Individual review card component - compact design
 */
const ReviewCard: React.FC<{ review: Review }> = ({ review }) => {
  return (
    <div className="group relative bg-white dark:bg-gray-800 rounded-xl p-4 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5">
      {/* Quote decoration */}
      <div className="absolute top-3 right-3 opacity-5 group-hover:opacity-10 transition-opacity">
        <Quote className="w-8 h-8 text-primary-500" />
      </div>

      {/* Customer info - top */}
      <div className="flex items-center gap-2.5 mb-3">
        <img
          src={review.avatar}
          alt={review.name}
          className="w-9 h-9 rounded-full object-cover ring-2 ring-primary-100 dark:ring-primary-900/30"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm text-gray-900 dark:text-white truncate">
            {review.name}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{review.role}</p>
        </div>
        {/* Rating */}
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${
                i < review.rating
                  ? 'text-secondary-500 fill-secondary-500'
                  : 'text-gray-300 dark:text-gray-600'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Highlight badge */}
      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs font-medium mb-2">
        <Sparkles className="w-2.5 h-2.5" />
        {review.highlight}
      </div>

      {/* Review text */}
      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
        "{review.review}"
      </p>

      {/* Date */}
      <span className="block text-xs text-gray-400 dark:text-gray-500 mt-2">{review.date}</span>
    </div>
  );
};

export default CustomerReviews;

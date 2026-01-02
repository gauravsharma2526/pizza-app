import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import {
  Skeleton,
  PizzaCardSkeleton,
  PizzaGridSkeleton,
  CartItemSkeleton,
} from '../components/ui/Skeleton';

describe('Skeleton Components', () => {
  describe('Skeleton', () => {
    it('renders with default props', () => {
      const { container } = render(<Skeleton />);
      const skeleton = container.firstChild as HTMLElement;

      expect(skeleton).toBeInTheDocument();
      expect(skeleton).toHaveClass('bg-gray-200');
      expect(skeleton).toHaveClass('animate-pulse');
    });

    it('renders with circular variant', () => {
      const { container } = render(<Skeleton variant="circular" />);
      const skeleton = container.firstChild as HTMLElement;

      expect(skeleton).toHaveClass('rounded-full');
    });

    it('renders with rounded variant', () => {
      const { container } = render(<Skeleton variant="rounded" />);
      const skeleton = container.firstChild as HTMLElement;

      expect(skeleton).toHaveClass('rounded-xl');
    });

    it('renders with text variant', () => {
      const { container } = render(<Skeleton variant="text" />);
      const skeleton = container.firstChild as HTMLElement;

      expect(skeleton).toHaveClass('rounded');
    });

    it('applies custom width and height', () => {
      const { container } = render(<Skeleton width="200px" height="100px" />);
      const skeleton = container.firstChild as HTMLElement;

      expect(skeleton).toHaveStyle({ width: '200px', height: '100px' });
    });

    it('applies custom className', () => {
      const { container } = render(<Skeleton className="custom-class" />);
      const skeleton = container.firstChild as HTMLElement;

      expect(skeleton).toHaveClass('custom-class');
    });

    it('renders with wave animation', () => {
      const { container } = render(<Skeleton animation="wave" />);
      const skeleton = container.firstChild as HTMLElement;

      expect(skeleton).toHaveClass('animate-shimmer');
    });

    it('renders with no animation', () => {
      const { container } = render(<Skeleton animation="none" />);
      const skeleton = container.firstChild as HTMLElement;

      expect(skeleton).not.toHaveClass('animate-pulse');
      expect(skeleton).not.toHaveClass('animate-shimmer');
    });
  });

  describe('PizzaCardSkeleton', () => {
    it('renders pizza card skeleton structure', () => {
      const { container } = render(<PizzaCardSkeleton />);

      // Should have multiple skeleton elements for image, title, description, etc.
      const skeletons = container.querySelectorAll('[class*="bg-gray-200"]');
      expect(skeletons.length).toBeGreaterThan(3);
    });
  });

  describe('PizzaGridSkeleton', () => {
    it('renders default 6 skeleton cards', () => {
      const { container } = render(<PizzaGridSkeleton />);

      // Should have a grid container
      const grid = container.querySelector('.grid');
      expect(grid).toBeInTheDocument();

      // Default count is 6
      const cards = grid?.children;
      expect(cards?.length).toBe(6);
    });

    it('renders custom number of skeleton cards', () => {
      const { container } = render(<PizzaGridSkeleton count={3} />);

      const grid = container.querySelector('.grid');
      const cards = grid?.children;
      expect(cards?.length).toBe(3);
    });
  });

  describe('CartItemSkeleton', () => {
    it('renders cart item skeleton structure', () => {
      const { container } = render(<CartItemSkeleton />);

      // Should have skeleton elements
      const skeletons = container.querySelectorAll('[class*="bg-gray-200"]');
      expect(skeletons.length).toBeGreaterThan(2);
    });
  });
});

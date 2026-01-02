import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from './test-utils';
import { FloatingCartButton } from '../components/ui/FloatingCartButton';

describe('FloatingCartButton', () => {
  it('should not render when cart is empty', () => {
    render(<FloatingCartButton />);

    // Component should not be visible when cart is empty
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should render when cart has items', () => {
    render(<FloatingCartButton />, {
      preloadedState: {
        cart: {
          items: [{ pizzaId: 'pizza-1', quantity: 2 }],
          isOpen: false,
        },
        pizzas: {
          items: [
            {
              id: 'pizza-1',
              name: 'Test Pizza',
              description: 'Test description',
              price: 12.99,
              category: 'classic',
              ingredients: ['tomato', 'cheese'],
              imageUrl: 'test.jpg',
              isVegetarian: true,
              isSpicy: false,
              rating: 4.5,
              prepTime: 15,
            },
          ],
          filters: {
            search: '',
            category: 'all',
            isVegetarian: null,
            isSpicy: null,
            maxPrice: null,
            ingredient: '',
          },
          sortOption: { field: 'name', direction: 'asc' },
          isLoading: false,
          error: null,
        },
      },
    });

    // Should show price
    expect(screen.getByText(/\$\d+\.\d{2}/)).toBeInTheDocument();
  });

  it('should show cart count badge', () => {
    render(<FloatingCartButton />, {
      preloadedState: {
        cart: {
          items: [
            { pizzaId: 'pizza-1', quantity: 2 },
            { pizzaId: 'pizza-2', quantity: 3 },
          ],
          isOpen: false,
        },
        pizzas: {
          items: [
            {
              id: 'pizza-1',
              name: 'Test Pizza 1',
              description: 'Test',
              price: 10,
              category: 'classic',
              ingredients: ['tomato'],
              imageUrl: 'test.jpg',
              isVegetarian: true,
              isSpicy: false,
              rating: 4,
              prepTime: 15,
            },
            {
              id: 'pizza-2',
              name: 'Test Pizza 2',
              description: 'Test',
              price: 12,
              category: 'classic',
              ingredients: ['tomato'],
              imageUrl: 'test.jpg',
              isVegetarian: false,
              isSpicy: true,
              rating: 4.5,
              prepTime: 20,
            },
          ],
          filters: {
            search: '',
            category: 'all',
            isVegetarian: null,
            isSpicy: null,
            maxPrice: null,
            ingredient: '',
          },
          sortOption: { field: 'name', direction: 'asc' },
          isLoading: false,
          error: null,
        },
      },
    });

    // Should show total item count (2 + 3 = 5)
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should expand on click to show details', async () => {
    const user = userEvent.setup();

    render(<FloatingCartButton />, {
      preloadedState: {
        cart: {
          items: [{ pizzaId: 'pizza-1', quantity: 1 }],
          isOpen: false,
        },
        pizzas: {
          items: [
            {
              id: 'pizza-1',
              name: 'Test Pizza',
              description: 'Test',
              price: 15,
              category: 'classic',
              ingredients: ['tomato'],
              imageUrl: 'test.jpg',
              isVegetarian: true,
              isSpicy: false,
              rating: 4,
              prepTime: 15,
            },
          ],
          filters: {
            search: '',
            category: 'all',
            isVegetarian: null,
            isSpicy: null,
            maxPrice: null,
            ingredient: '',
          },
          sortOption: { field: 'name', direction: 'asc' },
          isLoading: false,
          error: null,
        },
      },
    });

    // Click to expand
    const button = screen.getByText('$15.00');
    await user.click(button);

    // Should show "Your Cart" text when expanded
    expect(screen.getByText('Your Cart')).toBeInTheDocument();
    expect(screen.getByText('View Cart')).toBeInTheDocument();
  });
});

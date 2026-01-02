import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from './test-utils';
import { PizzaCard } from '../components/pizza/PizzaCard';
import type { Pizza } from '../types';

const mockPizza: Pizza = {
  id: 'test-pizza-1',
  name: 'Test Margherita',
  description: 'A test pizza description',
  price: 12.99,
  category: 'classic',
  ingredients: ['tomato', 'mozzarella', 'basil'],
  imageUrl: 'https://example.com/pizza.jpg',
  isVegetarian: true,
  isSpicy: false,
  rating: 4.5,
  prepTime: 15,
};

describe('PizzaCard', () => {
  it('renders pizza name and price correctly', () => {
    render(<PizzaCard pizza={mockPizza} />);

    expect(screen.getByText('Test Margherita')).toBeInTheDocument();
    expect(screen.getByText('$12.99')).toBeInTheDocument();
  });

  it('displays vegetarian badge when pizza is vegetarian', () => {
    render(<PizzaCard pizza={mockPizza} />);

    expect(screen.getByText('Veg')).toBeInTheDocument();
  });

  it('displays ingredients list', () => {
    render(<PizzaCard pizza={mockPizza} />);

    expect(screen.getByText(/tomato, mozzarella, basil/i)).toBeInTheDocument();
  });

  it('displays prep time', () => {
    render(<PizzaCard pizza={mockPizza} />);

    expect(screen.getByText('15 min')).toBeInTheDocument();
  });

  it('displays rating', () => {
    render(<PizzaCard pizza={mockPizza} />);

    expect(screen.getByText('4.5')).toBeInTheDocument();
  });

  it('increments quantity when plus button is clicked', async () => {
    const user = userEvent.setup();
    render(<PizzaCard pizza={mockPizza} />);

    const incrementButton = screen.getByLabelText('Increase quantity');
    await user.click(incrementButton);

    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('decrements quantity when minus button is clicked', async () => {
    const user = userEvent.setup();
    render(<PizzaCard pizza={mockPizza} />);

    // First increment to 2
    const incrementButton = screen.getByLabelText('Increase quantity');
    await user.click(incrementButton);
    expect(screen.getByText('2')).toBeInTheDocument();

    // Then decrement back to 1
    const decrementButton = screen.getByLabelText('Decrease quantity');
    await user.click(decrementButton);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('does not go below 1 when decrementing', async () => {
    const user = userEvent.setup();
    render(<PizzaCard pizza={mockPizza} />);

    const decrementButton = screen.getByLabelText('Decrease quantity');
    await user.click(decrementButton);
    await user.click(decrementButton);

    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('shows discount hint when quantity is 3 or more', async () => {
    const user = userEvent.setup();
    render(<PizzaCard pizza={mockPizza} />);

    const incrementButton = screen.getByLabelText('Increase quantity');
    await user.click(incrementButton);
    await user.click(incrementButton);

    // Text includes emoji "🎉 10% off!"
    expect(screen.getByText(/10% off!/i)).toBeInTheDocument();
  });

  it('displays spicy badge for spicy pizzas', () => {
    const spicyPizza: Pizza = { ...mockPizza, isSpicy: true };
    render(<PizzaCard pizza={spicyPizza} />);

    expect(screen.getByText('Spicy')).toBeInTheDocument();
  });
});

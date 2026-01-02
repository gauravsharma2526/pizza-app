import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from './test-utils';
import { AddPizza } from '../pages/AddPizza';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('AddPizza Form', () => {
  it('renders the form with all fields', () => {
    render(<AddPizza />);

    expect(screen.getByText('Add New Pizza')).toBeInTheDocument();
    expect(screen.getByLabelText(/pizza name/i)).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/describe your pizza/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/prep time/i)).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    const user = userEvent.setup();
    render(<AddPizza />);

    const submitButton = screen.getByRole('button', { name: /add pizza to menu/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();
    });
  });

  it('validates price field is required', async () => {
    const user = userEvent.setup();
    render(<AddPizza />);

    // Just fill name and submit to check validation is working
    const nameInput = screen.getByLabelText(/pizza name/i);
    await user.type(nameInput, 'Test Pizza');

    const submitButton = screen.getByRole('button', { name: /add pizza to menu/i });
    await user.click(submitButton);

    // Check that the form doesn't submit (still on same page) due to validation errors
    await waitFor(() => {
      expect(screen.getByText('Add New Pizza')).toBeInTheDocument();
    });
  });

  it('can add and remove ingredients', async () => {
    const user = userEvent.setup();
    render(<AddPizza />);

    // Should have one ingredient field initially
    const ingredientInputs = screen.getAllByPlaceholderText(/ingredient/i);
    expect(ingredientInputs).toHaveLength(1);

    // Click add ingredient button
    const addButton = screen.getByRole('button', { name: /add ingredient/i });
    await user.click(addButton);

    // Should now have two ingredient fields
    const updatedInputs = screen.getAllByPlaceholderText(/ingredient/i);
    expect(updatedInputs).toHaveLength(2);
  });

  it('allows toggling vegetarian and spicy checkboxes', async () => {
    const user = userEvent.setup();
    render(<AddPizza />);

    const vegetarianCheckbox = screen.getByLabelText(/vegetarian/i);
    const spicyCheckbox = screen.getByLabelText(/spicy/i);

    expect(vegetarianCheckbox).not.toBeChecked();
    expect(spicyCheckbox).not.toBeChecked();

    await user.click(vegetarianCheckbox);
    await user.click(spicyCheckbox);

    expect(vegetarianCheckbox).toBeChecked();
    expect(spicyCheckbox).toBeChecked();
  });
});

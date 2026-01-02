import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CartItem } from '../../types';
import { CART_LIMITS } from '../../constants/cart';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

const initialState: CartState = {
  items: [],
  isOpen: false,
};

/**
 * Helper to calculate total quantity in cart
 */
const getTotalQuantity = (items: CartItem[]): number =>
  items.reduce((sum, item) => sum + item.quantity, 0);

/**
 * Helper to get item quantity by pizza ID
 */
const getItemQuantity = (items: CartItem[], pizzaId: string): number => {
  const item = items.find((i) => i.pizzaId === pizzaId);
  return item?.quantity || 0;
};

/**
 * Result type for add operations that may be clamped
 */
export interface AddToCartResult {
  added: number;
  limitReached: 'none' | 'per_item' | 'total';
}

/**
 * Cart slice manages the shopping cart state
 * Handles adding, removing, and updating quantities with limit enforcement
 */
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    /**
     * Add item to cart or increase quantity if already exists
     * Enforces both per-item and total cart limits
     */
    addToCart: (state, action: PayloadAction<{ pizzaId: string; quantity: number }>) => {
      const { pizzaId, quantity } = action.payload;
      const currentItemQuantity = getItemQuantity(state.items, pizzaId);
      const currentTotal = getTotalQuantity(state.items);

      // Calculate how much we can actually add
      const remainingPerItem = CART_LIMITS.MAX_QUANTITY_PER_ITEM - currentItemQuantity;
      const remainingTotal = CART_LIMITS.MAX_TOTAL_ITEMS - currentTotal;

      // Clamp to the minimum of requested, per-item limit, and total limit
      const quantityToAdd = Math.min(quantity, remainingPerItem, remainingTotal);

      if (quantityToAdd <= 0) return;

      const existingItem = state.items.find((item) => item.pizzaId === pizzaId);

      if (existingItem) {
        existingItem.quantity += quantityToAdd;
      } else {
        state.items.push({ pizzaId, quantity: quantityToAdd });
      }
    },

    /**
     * Remove item from cart
     */
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.pizzaId !== action.payload);
    },

    /**
     * Update item quantity with limit enforcement
     */
    updateQuantity: (state, action: PayloadAction<{ pizzaId: string; quantity: number }>) => {
      const { pizzaId, quantity } = action.payload;
      const item = state.items.find((item) => item.pizzaId === pizzaId);

      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter((i) => i.pizzaId !== pizzaId);
        } else {
          // Calculate the difference to check total limit
          const diff = quantity - item.quantity;
          const currentTotal = getTotalQuantity(state.items);
          const remainingTotal = CART_LIMITS.MAX_TOTAL_ITEMS - currentTotal;

          // Clamp to per-item limit
          let newQuantity = Math.min(quantity, CART_LIMITS.MAX_QUANTITY_PER_ITEM);

          // If increasing, also check total limit
          if (diff > 0) {
            const maxIncrease = Math.min(diff, remainingTotal);
            newQuantity = Math.min(item.quantity + maxIncrease, CART_LIMITS.MAX_QUANTITY_PER_ITEM);
          }

          item.quantity = newQuantity;
        }
      }
    },

    /**
     * Increment item quantity by 1 with limit enforcement
     */
    incrementQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find((item) => item.pizzaId === action.payload);
      if (item) {
        const currentTotal = getTotalQuantity(state.items);

        // Check both limits before incrementing
        const canIncrementPerItem = item.quantity < CART_LIMITS.MAX_QUANTITY_PER_ITEM;
        const canIncrementTotal = currentTotal < CART_LIMITS.MAX_TOTAL_ITEMS;

        if (canIncrementPerItem && canIncrementTotal) {
          item.quantity += 1;
        }
      }
    },

    /**
     * Decrement item quantity by 1
     */
    decrementQuantity: (state, action: PayloadAction<string>) => {
      const item = state.items.find((item) => item.pizzaId === action.payload);
      if (item) {
        if (item.quantity <= 1) {
          state.items = state.items.filter((i) => i.pizzaId !== action.payload);
        } else {
          item.quantity -= 1;
        }
      }
    },

    /**
     * Clear all items from cart
     */
    clearCart: (state) => {
      state.items = [];
    },

    /**
     * Toggle cart visibility
     */
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },

    /**
     * Set cart open state
     */
    setCartOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  incrementQuantity,
  decrementQuantity,
  clearCart,
  toggleCart,
  setCartOpen,
} = cartSlice.actions;

export default cartSlice.reducer;

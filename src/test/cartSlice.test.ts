import { describe, it, expect } from 'vitest';
import cartReducer, {
  addToCart,
  removeFromCart,
  updateQuantity,
  incrementQuantity,
  decrementQuantity,
  clearCart,
} from '../store/slices/cartSlice';
import { CART_LIMITS } from '../constants/cart';

describe('cartSlice', () => {
  const initialState = {
    items: [],
    isOpen: false,
  };

  it('should return the initial state', () => {
    expect(cartReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should add a new item to cart', () => {
    const state = cartReducer(initialState, addToCart({ pizzaId: 'pizza-1', quantity: 2 }));

    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toEqual({ pizzaId: 'pizza-1', quantity: 2 });
  });

  it('should increase quantity when adding existing item', () => {
    const stateWithItem = {
      ...initialState,
      items: [{ pizzaId: 'pizza-1', quantity: 2 }],
    };

    const state = cartReducer(stateWithItem, addToCart({ pizzaId: 'pizza-1', quantity: 3 }));

    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(5);
  });

  it('should remove item from cart', () => {
    const stateWithItems = {
      ...initialState,
      items: [
        { pizzaId: 'pizza-1', quantity: 2 },
        { pizzaId: 'pizza-2', quantity: 1 },
      ],
    };

    const state = cartReducer(stateWithItems, removeFromCart('pizza-1'));

    expect(state.items).toHaveLength(1);
    expect(state.items[0].pizzaId).toBe('pizza-2');
  });

  it('should update item quantity', () => {
    const stateWithItem = {
      ...initialState,
      items: [{ pizzaId: 'pizza-1', quantity: 2 }],
    };

    const state = cartReducer(stateWithItem, updateQuantity({ pizzaId: 'pizza-1', quantity: 5 }));

    expect(state.items[0].quantity).toBe(5);
  });

  it('should remove item when updating quantity to 0', () => {
    const stateWithItem = {
      ...initialState,
      items: [{ pizzaId: 'pizza-1', quantity: 2 }],
    };

    const state = cartReducer(stateWithItem, updateQuantity({ pizzaId: 'pizza-1', quantity: 0 }));

    expect(state.items).toHaveLength(0);
  });

  it('should increment item quantity', () => {
    const stateWithItem = {
      ...initialState,
      items: [{ pizzaId: 'pizza-1', quantity: 2 }],
    };

    const state = cartReducer(stateWithItem, incrementQuantity('pizza-1'));

    expect(state.items[0].quantity).toBe(3);
  });

  it('should decrement item quantity', () => {
    const stateWithItem = {
      ...initialState,
      items: [{ pizzaId: 'pizza-1', quantity: 3 }],
    };

    const state = cartReducer(stateWithItem, decrementQuantity('pizza-1'));

    expect(state.items[0].quantity).toBe(2);
  });

  it('should remove item when decrementing from quantity 1', () => {
    const stateWithItem = {
      ...initialState,
      items: [{ pizzaId: 'pizza-1', quantity: 1 }],
    };

    const state = cartReducer(stateWithItem, decrementQuantity('pizza-1'));

    expect(state.items).toHaveLength(0);
  });

  it('should clear all items from cart', () => {
    const stateWithItems = {
      ...initialState,
      items: [
        { pizzaId: 'pizza-1', quantity: 2 },
        { pizzaId: 'pizza-2', quantity: 1 },
        { pizzaId: 'pizza-3', quantity: 4 },
      ],
    };

    const state = cartReducer(stateWithItems, clearCart());

    expect(state.items).toHaveLength(0);
  });

  // ==================== Cart Limit Tests ====================

  describe('cart limits', () => {
    it('should clamp quantity to MAX_QUANTITY_PER_ITEM when adding', () => {
      const state = cartReducer(
        initialState,
        addToCart({ pizzaId: 'pizza-1', quantity: CART_LIMITS.MAX_QUANTITY_PER_ITEM + 10 })
      );

      expect(state.items[0].quantity).toBe(CART_LIMITS.MAX_QUANTITY_PER_ITEM);
    });

    it('should not exceed MAX_QUANTITY_PER_ITEM when adding to existing item', () => {
      const stateWithItem = {
        ...initialState,
        items: [{ pizzaId: 'pizza-1', quantity: CART_LIMITS.MAX_QUANTITY_PER_ITEM - 2 }],
      };

      const state = cartReducer(stateWithItem, addToCart({ pizzaId: 'pizza-1', quantity: 10 }));

      expect(state.items[0].quantity).toBe(CART_LIMITS.MAX_QUANTITY_PER_ITEM);
    });

    it('should not add if item is already at MAX_QUANTITY_PER_ITEM', () => {
      const stateWithItem = {
        ...initialState,
        items: [{ pizzaId: 'pizza-1', quantity: CART_LIMITS.MAX_QUANTITY_PER_ITEM }],
      };

      const state = cartReducer(stateWithItem, addToCart({ pizzaId: 'pizza-1', quantity: 5 }));

      // Should remain at max
      expect(state.items[0].quantity).toBe(CART_LIMITS.MAX_QUANTITY_PER_ITEM);
    });

    it('should not increment beyond MAX_QUANTITY_PER_ITEM', () => {
      const stateWithItem = {
        ...initialState,
        items: [{ pizzaId: 'pizza-1', quantity: CART_LIMITS.MAX_QUANTITY_PER_ITEM }],
      };

      const state = cartReducer(stateWithItem, incrementQuantity('pizza-1'));

      expect(state.items[0].quantity).toBe(CART_LIMITS.MAX_QUANTITY_PER_ITEM);
    });

    it('should clamp updateQuantity to MAX_QUANTITY_PER_ITEM', () => {
      const stateWithItem = {
        ...initialState,
        items: [{ pizzaId: 'pizza-1', quantity: 5 }],
      };

      const state = cartReducer(
        stateWithItem,
        updateQuantity({ pizzaId: 'pizza-1', quantity: CART_LIMITS.MAX_QUANTITY_PER_ITEM + 10 })
      );

      expect(state.items[0].quantity).toBe(CART_LIMITS.MAX_QUANTITY_PER_ITEM);
    });

    it('should respect MAX_TOTAL_ITEMS when adding new items', () => {
      // Create a cart with items totaling MAX_TOTAL_ITEMS - 5
      const stateNearLimit = {
        ...initialState,
        items: [{ pizzaId: 'pizza-1', quantity: CART_LIMITS.MAX_TOTAL_ITEMS - 5 }],
      };

      // Try to add 10 more (should only add 5)
      const state = cartReducer(stateNearLimit, addToCart({ pizzaId: 'pizza-2', quantity: 10 }));

      const totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
      expect(totalQuantity).toBe(CART_LIMITS.MAX_TOTAL_ITEMS);
    });

    it('should not add anything when cart is at MAX_TOTAL_ITEMS', () => {
      const stateAtLimit = {
        ...initialState,
        items: [{ pizzaId: 'pizza-1', quantity: CART_LIMITS.MAX_TOTAL_ITEMS }],
      };

      const state = cartReducer(stateAtLimit, addToCart({ pizzaId: 'pizza-2', quantity: 5 }));

      // Should not add the new item
      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toBe(CART_LIMITS.MAX_TOTAL_ITEMS);
    });

    it('should not increment when cart is at MAX_TOTAL_ITEMS', () => {
      const stateAtLimit = {
        ...initialState,
        items: [
          { pizzaId: 'pizza-1', quantity: CART_LIMITS.MAX_TOTAL_ITEMS - 5 },
          { pizzaId: 'pizza-2', quantity: 5 },
        ],
      };

      const state = cartReducer(stateAtLimit, incrementQuantity('pizza-1'));

      const totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
      expect(totalQuantity).toBe(CART_LIMITS.MAX_TOTAL_ITEMS);
    });

    it('should allow increment after removing items', () => {
      const stateAtLimit = {
        ...initialState,
        items: [{ pizzaId: 'pizza-1', quantity: CART_LIMITS.MAX_TOTAL_ITEMS }],
      };

      // Remove some items
      let state = cartReducer(stateAtLimit, decrementQuantity('pizza-1'));

      // Now should be able to add more
      state = cartReducer(state, addToCart({ pizzaId: 'pizza-2', quantity: 1 }));

      const totalQuantity = state.items.reduce((sum, item) => sum + item.quantity, 0);
      expect(totalQuantity).toBe(CART_LIMITS.MAX_TOTAL_ITEMS);
    });
  });
});

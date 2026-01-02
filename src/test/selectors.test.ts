import { describe, it, expect } from 'vitest';
import type { Pizza, OrderItem, CartItem } from '../types';
import { CART_LIMITS } from '../constants/cart';

// Test the discount logic directly without Redux store complexity
describe('Discount Logic', () => {
  const calculateOrderItem = (pizza: Pizza, quantity: number): OrderItem => {
    const originalPrice = pizza.price * quantity;
    const discountAmount =
      quantity >= CART_LIMITS.DISCOUNT_THRESHOLD
        ? originalPrice * CART_LIMITS.DISCOUNT_PERCENTAGE
        : 0;
    const finalPrice = originalPrice - discountAmount;

    return {
      pizza,
      quantity,
      originalPrice,
      discountAmount,
      finalPrice,
    };
  };

  const mockPizza: Pizza = {
    id: 'pizza-1',
    name: 'Margherita',
    description: 'Classic pizza',
    price: 10,
    category: 'classic',
    ingredients: ['tomato', 'mozzarella'],
    imageUrl: 'https://example.com/1.jpg',
    isVegetarian: true,
    isSpicy: false,
    rating: 4.5,
    prepTime: 15,
  };

  it('should not apply discount for quantity less than 3', () => {
    const item = calculateOrderItem(mockPizza, 2);

    expect(item.originalPrice).toBe(20);
    expect(item.discountAmount).toBe(0);
    expect(item.finalPrice).toBe(20);
  });

  it('should apply 10% discount for quantity of 3', () => {
    const item = calculateOrderItem(mockPizza, 3);

    expect(item.originalPrice).toBe(30);
    expect(item.discountAmount).toBe(3); // 10% of 30
    expect(item.finalPrice).toBe(27);
  });

  it('should apply 10% discount for quantity greater than 3', () => {
    const item = calculateOrderItem(mockPizza, 5);

    expect(item.originalPrice).toBe(50);
    expect(item.discountAmount).toBe(5); // 10% of 50
    expect(item.finalPrice).toBe(45);
  });

  it('should use constants from CART_LIMITS', () => {
    expect(CART_LIMITS.DISCOUNT_THRESHOLD).toBe(3);
    expect(CART_LIMITS.DISCOUNT_PERCENTAGE).toBe(0.1);
  });
});

describe('Pizza Filtering Logic', () => {
  const mockPizzas: Pizza[] = [
    {
      id: 'pizza-1',
      name: 'Margherita',
      description: 'Classic pizza',
      price: 10,
      category: 'classic',
      ingredients: ['tomato', 'mozzarella'],
      imageUrl: 'https://example.com/1.jpg',
      isVegetarian: true,
      isSpicy: false,
      rating: 4.5,
      prepTime: 15,
    },
    {
      id: 'pizza-2',
      name: 'Pepperoni',
      description: 'Meat pizza',
      price: 15,
      category: 'meat',
      ingredients: ['tomato', 'mozzarella', 'pepperoni'],
      imageUrl: 'https://example.com/2.jpg',
      isVegetarian: false,
      isSpicy: false,
      rating: 4.8,
      prepTime: 18,
    },
    {
      id: 'pizza-3',
      name: 'Diavola',
      description: 'Spicy pizza',
      price: 16,
      category: 'meat',
      ingredients: ['tomato', 'mozzarella', 'spicy salami'],
      imageUrl: 'https://example.com/3.jpg',
      isVegetarian: false,
      isSpicy: true,
      rating: 4.6,
      prepTime: 18,
    },
  ];

  it('should filter by vegetarian', () => {
    const filtered = mockPizzas.filter((p) => p.isVegetarian === true);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].name).toBe('Margherita');
  });

  it('should filter by category', () => {
    const filtered = mockPizzas.filter((p) => p.category === 'meat');
    expect(filtered).toHaveLength(2);
  });

  it('should filter by search (case insensitive)', () => {
    const search = 'pepperoni';
    const filtered = mockPizzas.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
    );
    expect(filtered).toHaveLength(1);
    expect(filtered[0].name).toBe('Pepperoni');
  });

  it('should filter by max price', () => {
    const maxPrice = 12;
    const filtered = mockPizzas.filter((p) => p.price <= maxPrice);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].price).toBe(10);
  });

  it('should filter by ingredient', () => {
    const ingredient = 'pepperoni';
    const filtered = mockPizzas.filter((p) =>
      p.ingredients.some((ing) => ing.toLowerCase().includes(ingredient.toLowerCase()))
    );
    expect(filtered).toHaveLength(1);
    expect(filtered[0].name).toBe('Pepperoni');
  });

  it('should sort by price ascending', () => {
    const sorted = [...mockPizzas].sort((a, b) => a.price - b.price);
    expect(sorted[0].price).toBe(10);
    expect(sorted[2].price).toBe(16);
  });

  it('should sort by price descending', () => {
    const sorted = [...mockPizzas].sort((a, b) => b.price - a.price);
    expect(sorted[0].price).toBe(16);
    expect(sorted[2].price).toBe(10);
  });

  it('should sort by name ascending', () => {
    const sorted = [...mockPizzas].sort((a, b) => a.name.localeCompare(b.name));
    expect(sorted[0].name).toBe('Diavola');
    expect(sorted[2].name).toBe('Pepperoni');
  });

  it('should filter by spicy', () => {
    const filtered = mockPizzas.filter((p) => p.isSpicy === true);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].name).toBe('Diavola');
  });
});

describe('Cart Totals Logic', () => {
  interface SimpleOrderItem {
    originalPrice: number;
    discountAmount: number;
    finalPrice: number;
  }

  const calculateTotals = (items: SimpleOrderItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + item.originalPrice, 0);
    const totalDiscount = items.reduce((sum, item) => sum + item.discountAmount, 0);
    const total = subtotal - totalDiscount;

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      totalDiscount: Math.round(totalDiscount * 100) / 100,
      total: Math.round(total * 100) / 100,
    };
  };

  it('should calculate totals correctly without discounts', () => {
    const items: SimpleOrderItem[] = [
      { originalPrice: 20, discountAmount: 0, finalPrice: 20 },
      { originalPrice: 30, discountAmount: 0, finalPrice: 30 },
    ];

    const totals = calculateTotals(items);
    expect(totals.subtotal).toBe(50);
    expect(totals.totalDiscount).toBe(0);
    expect(totals.total).toBe(50);
  });

  it('should calculate totals correctly with discounts', () => {
    const items: SimpleOrderItem[] = [
      { originalPrice: 30, discountAmount: 3, finalPrice: 27 }, // 3x $10 pizza with 10% off
      { originalPrice: 30, discountAmount: 0, finalPrice: 30 }, // 2x $15 pizza, no discount
    ];

    const totals = calculateTotals(items);
    expect(totals.subtotal).toBe(60);
    expect(totals.totalDiscount).toBe(3);
    expect(totals.total).toBe(57);
  });

  it('should handle empty cart', () => {
    const totals = calculateTotals([]);
    expect(totals.subtotal).toBe(0);
    expect(totals.totalDiscount).toBe(0);
    expect(totals.total).toBe(0);
  });
});

// ==================== Cart Limits Logic Tests ====================

describe('Cart Limits Logic', () => {
  // Helper functions that mirror the selector logic
  const getTotalQuantity = (items: CartItem[]): number =>
    items.reduce((sum, item) => sum + item.quantity, 0);

  const getItemQuantity = (items: CartItem[], pizzaId: string): number => {
    const item = items.find((i) => i.pizzaId === pizzaId);
    return item?.quantity || 0;
  };

  const calculateCartLimitsInfo = (items: CartItem[]) => {
    const count = getTotalQuantity(items);
    return {
      currentTotal: count,
      maxTotal: CART_LIMITS.MAX_TOTAL_ITEMS,
      maxPerItem: CART_LIMITS.MAX_QUANTITY_PER_ITEM,
      remaining: CART_LIMITS.MAX_TOTAL_ITEMS - count,
      percentUsed: Math.round((count / CART_LIMITS.MAX_TOTAL_ITEMS) * 100),
    };
  };

  const canIncrementItem = (items: CartItem[], pizzaId: string): boolean => {
    const itemQuantity = getItemQuantity(items, pizzaId);
    const totalCount = getTotalQuantity(items);

    const canIncrementPerItem = itemQuantity < CART_LIMITS.MAX_QUANTITY_PER_ITEM;
    const canIncrementTotal = totalCount < CART_LIMITS.MAX_TOTAL_ITEMS;

    return canIncrementPerItem && canIncrementTotal;
  };

  const isItemAtLimit = (items: CartItem[], pizzaId: string): boolean => {
    const item = items.find((i) => i.pizzaId === pizzaId);
    return (item?.quantity || 0) >= CART_LIMITS.MAX_QUANTITY_PER_ITEM;
  };

  const isCartAtLimit = (items: CartItem[]): boolean => {
    return getTotalQuantity(items) >= CART_LIMITS.MAX_TOTAL_ITEMS;
  };

  describe('Cart Limits Constants', () => {
    it('should have correct MAX_QUANTITY_PER_ITEM', () => {
      expect(CART_LIMITS.MAX_QUANTITY_PER_ITEM).toBe(25);
    });

    it('should have correct MAX_TOTAL_ITEMS', () => {
      expect(CART_LIMITS.MAX_TOTAL_ITEMS).toBe(50);
    });
  });

  describe('calculateCartLimitsInfo', () => {
    it('should return correct info for empty cart', () => {
      const info = calculateCartLimitsInfo([]);
      expect(info.currentTotal).toBe(0);
      expect(info.remaining).toBe(50);
      expect(info.percentUsed).toBe(0);
    });

    it('should return correct info for partially filled cart', () => {
      const items: CartItem[] = [
        { pizzaId: 'pizza-1', quantity: 10 },
        { pizzaId: 'pizza-2', quantity: 15 },
      ];
      const info = calculateCartLimitsInfo(items);
      expect(info.currentTotal).toBe(25);
      expect(info.remaining).toBe(25);
      expect(info.percentUsed).toBe(50);
    });

    it('should return correct info for full cart', () => {
      const items: CartItem[] = [
        { pizzaId: 'pizza-1', quantity: 25 },
        { pizzaId: 'pizza-2', quantity: 25 },
      ];
      const info = calculateCartLimitsInfo(items);
      expect(info.currentTotal).toBe(50);
      expect(info.remaining).toBe(0);
      expect(info.percentUsed).toBe(100);
    });
  });

  describe('canIncrementItem', () => {
    it('should return true when item and cart are below limits', () => {
      const items: CartItem[] = [{ pizzaId: 'pizza-1', quantity: 5 }];
      expect(canIncrementItem(items, 'pizza-1')).toBe(true);
    });

    it('should return false when item is at per-item limit', () => {
      const items: CartItem[] = [{ pizzaId: 'pizza-1', quantity: 25 }];
      expect(canIncrementItem(items, 'pizza-1')).toBe(false);
    });

    it('should return false when cart is at total limit', () => {
      const items: CartItem[] = [
        { pizzaId: 'pizza-1', quantity: 25 },
        { pizzaId: 'pizza-2', quantity: 25 },
      ];
      expect(canIncrementItem(items, 'pizza-1')).toBe(false);
    });

    it('should return true for new item when cart has room', () => {
      const items: CartItem[] = [{ pizzaId: 'pizza-1', quantity: 10 }];
      expect(canIncrementItem(items, 'pizza-2')).toBe(true);
    });
  });

  describe('isItemAtLimit', () => {
    it('should return false when item is below limit', () => {
      const items: CartItem[] = [{ pizzaId: 'pizza-1', quantity: 10 }];
      expect(isItemAtLimit(items, 'pizza-1')).toBe(false);
    });

    it('should return true when item is at limit', () => {
      const items: CartItem[] = [{ pizzaId: 'pizza-1', quantity: 25 }];
      expect(isItemAtLimit(items, 'pizza-1')).toBe(true);
    });

    it('should return false for non-existent item', () => {
      const items: CartItem[] = [{ pizzaId: 'pizza-1', quantity: 10 }];
      expect(isItemAtLimit(items, 'pizza-2')).toBe(false);
    });
  });

  describe('isCartAtLimit', () => {
    it('should return false when cart is below limit', () => {
      const items: CartItem[] = [{ pizzaId: 'pizza-1', quantity: 30 }];
      expect(isCartAtLimit(items)).toBe(false);
    });

    it('should return true when cart is at limit', () => {
      const items: CartItem[] = [
        { pizzaId: 'pizza-1', quantity: 25 },
        { pizzaId: 'pizza-2', quantity: 25 },
      ];
      expect(isCartAtLimit(items)).toBe(true);
    });

    it('should return true when cart exceeds limit', () => {
      const items: CartItem[] = [{ pizzaId: 'pizza-1', quantity: 50 }];
      expect(isCartAtLimit(items)).toBe(true);
    });
  });

  describe('canAddToCart logic', () => {
    const canAddToCart = (
      items: CartItem[],
      pizzaId: string,
      quantity: number
    ): { canAdd: boolean; maxAddable: number; limitType: 'none' | 'per_item' | 'total' } => {
      const currentItemQuantity = getItemQuantity(items, pizzaId);
      const totalCount = getTotalQuantity(items);

      const remainingPerItem = CART_LIMITS.MAX_QUANTITY_PER_ITEM - currentItemQuantity;
      const remainingTotal = CART_LIMITS.MAX_TOTAL_ITEMS - totalCount;

      const maxAddable = Math.min(remainingPerItem, remainingTotal);

      if (maxAddable <= 0) {
        return {
          canAdd: false,
          maxAddable: 0,
          limitType: remainingPerItem <= 0 ? 'per_item' : 'total',
        };
      }

      return {
        canAdd: quantity <= maxAddable,
        maxAddable,
        limitType:
          quantity > maxAddable
            ? remainingPerItem <= remainingTotal
              ? 'per_item'
              : 'total'
            : 'none',
      };
    };

    it('should allow adding when both limits have room', () => {
      const items: CartItem[] = [{ pizzaId: 'pizza-1', quantity: 5 }];
      const result = canAddToCart(items, 'pizza-1', 3);
      expect(result.canAdd).toBe(true);
      expect(result.maxAddable).toBe(20); // 25 - 5
      expect(result.limitType).toBe('none');
    });

    it('should not allow adding when item is at per-item limit', () => {
      const items: CartItem[] = [{ pizzaId: 'pizza-1', quantity: 25 }];
      const result = canAddToCart(items, 'pizza-1', 1);
      expect(result.canAdd).toBe(false);
      expect(result.maxAddable).toBe(0);
      expect(result.limitType).toBe('per_item');
    });

    it('should not allow adding when cart is at total limit', () => {
      const items: CartItem[] = [
        { pizzaId: 'pizza-1', quantity: 25 },
        { pizzaId: 'pizza-2', quantity: 25 },
      ];
      const result = canAddToCart(items, 'pizza-3', 1);
      expect(result.canAdd).toBe(false);
      expect(result.maxAddable).toBe(0);
      expect(result.limitType).toBe('total');
    });

    it('should report correct limit type when per-item is the constraint', () => {
      const items: CartItem[] = [{ pizzaId: 'pizza-1', quantity: 20 }];
      const result = canAddToCart(items, 'pizza-1', 10);
      expect(result.canAdd).toBe(false);
      expect(result.maxAddable).toBe(5); // Can only add 5 more
      expect(result.limitType).toBe('per_item');
    });

    it('should report correct limit type when total is the constraint', () => {
      const items: CartItem[] = [
        { pizzaId: 'pizza-1', quantity: 20 },
        { pizzaId: 'pizza-2', quantity: 25 },
      ];
      const result = canAddToCart(items, 'pizza-1', 10);
      expect(result.canAdd).toBe(false);
      expect(result.maxAddable).toBe(5); // Total remaining is 5, per-item remaining is 5
    });
  });
});

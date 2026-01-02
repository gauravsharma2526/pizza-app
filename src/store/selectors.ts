import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from './index';
import type { Pizza, OrderItem } from '../types';
import { CART_LIMITS } from '../constants/cart';

// ==================== Pizza Selectors ====================

/**
 * Get all pizzas from state
 */
export const selectAllPizzas = (state: RootState) => state.pizzas.items;

/**
 * Get pizza filters
 */
export const selectPizzaFilters = (state: RootState) => state.pizzas.filters;

/**
 * Get pizza sort option
 */
export const selectPizzaSortOption = (state: RootState) => state.pizzas.sortOption;

/**
 * Get a pizza by ID
 */
export const selectPizzaById = (id: string) => (state: RootState) =>
  state.pizzas.items.find((pizza) => pizza.id === id);

/**
 * Get filtered and sorted pizzas
 * Applies all active filters and sorts the results
 */
export const selectFilteredPizzas = createSelector(
  [selectAllPizzas, selectPizzaFilters, selectPizzaSortOption],
  (pizzas, filters, sortOption): Pizza[] => {
    let filtered = [...pizzas];

    // Apply search filter (searches name, description, and ingredients)
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (pizza) =>
          pizza.name.toLowerCase().includes(searchLower) ||
          pizza.description.toLowerCase().includes(searchLower) ||
          pizza.ingredients.some((ing) => ing.toLowerCase().includes(searchLower))
      );
    }

    // Apply category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter((pizza) => pizza.category === filters.category);
    }

    // Apply vegetarian filter
    if (filters.isVegetarian !== null) {
      filtered = filtered.filter((pizza) => pizza.isVegetarian === filters.isVegetarian);
    }

    // Apply spicy filter
    if (filters.isSpicy !== null) {
      filtered = filtered.filter((pizza) => pizza.isSpicy === filters.isSpicy);
    }

    // Apply max price filter
    if (filters.maxPrice !== null) {
      filtered = filtered.filter((pizza) => pizza.price <= filters.maxPrice!);
    }

    // Apply ingredient filter
    if (filters.ingredient) {
      const ingredientLower = filters.ingredient.toLowerCase();
      filtered = filtered.filter((pizza) =>
        pizza.ingredients.some((ing) => ing.toLowerCase().includes(ingredientLower))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortOption.field) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        default:
          comparison = 0;
      }

      return sortOption.direction === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }
);

/**
 * Get unique ingredients from all pizzas
 */
export const selectUniqueIngredients = createSelector([selectAllPizzas], (pizzas): string[] => {
  const ingredients = new Set<string>();
  pizzas.forEach((pizza) => {
    pizza.ingredients.forEach((ing) => ingredients.add(ing));
  });
  return Array.from(ingredients).sort();
});

// ==================== Cart Selectors ====================

/**
 * Get cart items
 */
export const selectCartItems = (state: RootState) => state.cart.items;

/**
 * Get cart open state
 */
export const selectCartIsOpen = (state: RootState) => state.cart.isOpen;

/**
 * Get total items count in cart
 */
export const selectCartItemsCount = createSelector([selectCartItems], (items): number =>
  items.reduce((total, item) => total + item.quantity, 0)
);

/**
 * Get quantity of a specific pizza in cart
 */
export const selectCartItemQuantity = (pizzaId: string) =>
  createSelector([selectCartItems], (items): number => {
    const item = items.find((i) => i.pizzaId === pizzaId);
    return item?.quantity || 0;
  });

/**
 * Get remaining capacity for a specific pizza (per-item limit)
 */
export const selectRemainingItemCapacity = (pizzaId: string) =>
  createSelector([selectCartItems], (items): number => {
    const item = items.find((i) => i.pizzaId === pizzaId);
    const currentQuantity = item?.quantity || 0;
    return CART_LIMITS.MAX_QUANTITY_PER_ITEM - currentQuantity;
  });

/**
 * Get remaining total cart capacity
 */
export const selectRemainingCartCapacity = createSelector(
  [selectCartItemsCount],
  (count): number => CART_LIMITS.MAX_TOTAL_ITEMS - count
);

/**
 * Check if cart is at total limit
 */
export const selectIsCartAtLimit = createSelector(
  [selectCartItemsCount],
  (count): boolean => count >= CART_LIMITS.MAX_TOTAL_ITEMS
);

/**
 * Check if a specific item is at its per-item limit
 */
export const selectIsItemAtLimit = (pizzaId: string) =>
  createSelector([selectCartItems], (items): boolean => {
    const item = items.find((i) => i.pizzaId === pizzaId);
    return (item?.quantity || 0) >= CART_LIMITS.MAX_QUANTITY_PER_ITEM;
  });

/**
 * Check if we can increment a specific item
 * Must not exceed per-item limit AND total cart limit
 */
export const selectCanIncrementItem = (pizzaId: string) =>
  createSelector([selectCartItems, selectCartItemsCount], (items, totalCount): boolean => {
    const item = items.find((i) => i.pizzaId === pizzaId);
    const itemQuantity = item?.quantity || 0;

    const canIncrementPerItem = itemQuantity < CART_LIMITS.MAX_QUANTITY_PER_ITEM;
    const canIncrementTotal = totalCount < CART_LIMITS.MAX_TOTAL_ITEMS;

    return canIncrementPerItem && canIncrementTotal;
  });

/**
 * Check if we can add more of a specific pizza to cart
 */
export const selectCanAddToCart = (pizzaId: string, quantity: number = 1) =>
  createSelector(
    [selectCartItems, selectCartItemsCount],
    (
      items,
      totalCount
    ): { canAdd: boolean; maxAddable: number; limitType: 'none' | 'per_item' | 'total' } => {
      const item = items.find((i) => i.pizzaId === pizzaId);
      const currentItemQuantity = item?.quantity || 0;

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
    }
  );

/**
 * Get cart limits info for display
 */
export const selectCartLimitsInfo = createSelector([selectCartItemsCount], (count) => ({
  currentTotal: count,
  maxTotal: CART_LIMITS.MAX_TOTAL_ITEMS,
  maxPerItem: CART_LIMITS.MAX_QUANTITY_PER_ITEM,
  remaining: CART_LIMITS.MAX_TOTAL_ITEMS - count,
  percentUsed: Math.round((count / CART_LIMITS.MAX_TOTAL_ITEMS) * 100),
}));

/**
 * Get cart items with full pizza details and calculated prices
 * Applies discount logic: 3+ of same pizza = 10% discount
 */
export const selectCartWithDetails = createSelector(
  [selectCartItems, selectAllPizzas],
  (cartItems, pizzas): OrderItem[] => {
    return cartItems
      .map((cartItem) => {
        const pizza = pizzas.find((p) => p.id === cartItem.pizzaId);
        if (!pizza) return null;

        const originalPrice = pizza.price * cartItem.quantity;

        // Apply 10% discount if quantity >= 3
        const discountAmount =
          cartItem.quantity >= CART_LIMITS.DISCOUNT_THRESHOLD
            ? originalPrice * CART_LIMITS.DISCOUNT_PERCENTAGE
            : 0;

        const finalPrice = originalPrice - discountAmount;

        return {
          pizza,
          quantity: cartItem.quantity,
          originalPrice,
          discountAmount,
          finalPrice,
        };
      })
      .filter((item): item is OrderItem => item !== null);
  }
);

/**
 * Get cart totals
 */
export const selectCartTotals = createSelector(
  [selectCartWithDetails],
  (
    items
  ): {
    subtotal: number;
    totalDiscount: number;
    total: number;
  } => {
    const subtotal = items.reduce((sum, item) => sum + item.originalPrice, 0);
    const totalDiscount = items.reduce((sum, item) => sum + item.discountAmount, 0);
    const total = subtotal - totalDiscount;

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      totalDiscount: Math.round(totalDiscount * 100) / 100,
      total: Math.round(total * 100) / 100,
    };
  }
);

// ==================== Order Selectors ====================

/**
 * Get all orders
 */
export const selectAllOrders = (state: RootState) => state.orders.orders;

/**
 * Get current order ID
 */
export const selectCurrentOrderId = (state: RootState) => state.orders.currentOrderId;

/**
 * Get order processing state
 */
export const selectIsProcessing = (state: RootState) => state.orders.isProcessing;

/**
 * Get current order details
 */
export const selectCurrentOrder = createSelector(
  [selectAllOrders, selectCurrentOrderId],
  (orders, currentId) => (currentId ? orders.find((o) => o.id === currentId) : null)
);

// ==================== UI Selectors ====================

/**
 * Get current theme
 */
export const selectTheme = (state: RootState) => state.ui.theme;

/**
 * Get notifications
 */
export const selectNotifications = (state: RootState) => state.ui.notifications;

/**
 * Get mobile menu state
 */
export const selectIsMobileMenuOpen = (state: RootState) => state.ui.isMobileMenuOpen;

// ==================== Chart Data Selectors ====================

/**
 * Get pizza price chart data
 */
export const selectPriceChartData = createSelector([selectFilteredPizzas], (pizzas) =>
  pizzas.slice(0, 8).map((pizza) => ({
    name: pizza.name.length > 12 ? pizza.name.slice(0, 12) + '...' : pizza.name,
    price: pizza.price,
    fill: '#ef4444',
  }))
);

/**
 * Get order distribution chart data
 */
export const selectOrderDistributionData = createSelector([selectCartWithDetails], (items) =>
  items.map((item, index) => {
    const colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'];
    return {
      name: item.pizza.name,
      value: item.quantity,
      fill: colors[index % colors.length],
    };
  })
);

// ==================== Favorites Selectors ====================

/**
 * Get all favorite pizza IDs
 */
export const selectFavoriteItems = (state: RootState) => state.favorites.items;

/**
 * Get favorite pizza IDs as a Set for quick lookup
 */
export const selectFavoriteIds = createSelector(
  [selectFavoriteItems],
  (items) => new Set(items.map((item) => item.pizzaId))
);

/**
 * Check if a specific pizza is favorited
 */
export const selectIsFavorite = (pizzaId: string) =>
  createSelector([selectFavoriteIds], (favoriteIds) => favoriteIds.has(pizzaId));

/**
 * Get full pizza details for favorites
 */
export const selectFavoritePizzas = createSelector(
  [selectFavoriteItems, selectAllPizzas],
  (favorites, pizzas) =>
    favorites
      .map((fav) => pizzas.find((p) => p.id === fav.pizzaId))
      .filter((pizza): pizza is Pizza => pizza !== undefined)
);

/**
 * Get favorites count
 */
export const selectFavoritesCount = createSelector([selectFavoriteItems], (items) => items.length);

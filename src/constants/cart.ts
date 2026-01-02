/**
 * Cart limit constants
 * These constants define the maximum quantities allowed in the cart
 */

export const CART_LIMITS = {
  /** Maximum quantity allowed per pizza type (e.g., max 25 Margheritas) */
  MAX_QUANTITY_PER_ITEM: 25,

  /** Maximum total pizzas allowed in cart (sum of all quantities) */
  MAX_TOTAL_ITEMS: 50,

  /** Quantity threshold for bulk discount */
  DISCOUNT_THRESHOLD: 3,

  /** Discount percentage (10% = 0.10) */
  DISCOUNT_PERCENTAGE: 0.1,
} as const;

/**
 * Error messages for cart limits
 */
export const CART_LIMIT_MESSAGES = {
  MAX_PER_ITEM: (name: string) =>
    `Maximum ${CART_LIMITS.MAX_QUANTITY_PER_ITEM} ${name} allowed per order`,
  MAX_TOTAL: `Cart limit reached! Maximum ${CART_LIMITS.MAX_TOTAL_ITEMS} pizzas allowed`,
  PARTIAL_ADD: (added: number, name: string) => `Added ${added} ${name}. Cart limit reached!`,
} as const;

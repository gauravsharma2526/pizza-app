/**
 * Pizza entity representing a menu item
 */
export interface Pizza {
  id: string;
  name: string;
  description: string;
  price: number;
  category: PizzaCategory;
  ingredients: string[];
  imageUrl: string;
  isVegetarian: boolean;
  isSpicy: boolean;
  rating: number;
  prepTime: number; // in minutes
}

/**
 * Pizza categories for filtering
 */
export type PizzaCategory = 'classic' | 'meat' | 'vegetarian' | 'specialty';

/**
 * Item in the shopping cart/order
 */
export interface OrderItem {
  pizza: Pizza;
  quantity: number;
  originalPrice: number; // price * quantity before discount
  discountAmount: number; // discount applied to this line item
  finalPrice: number; // price after discount
}

/**
 * Complete order with all details
 */
export interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  totalDiscount: number;
  total: number;
  createdAt: string; // ISO timestamp
  status: OrderStatus;
}

/**
 * Order status types
 */
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered';

/**
 * Cart item for adding/updating quantities
 */
export interface CartItem {
  pizzaId: string;
  quantity: number;
}

/**
 * Favorite pizza entry
 */
export interface FavoriteItem {
  pizzaId: string;
  addedAt: string; // ISO timestamp
}

/**
 * Filter options for pizza menu
 */
export interface PizzaFilters {
  search: string;
  category: PizzaCategory | 'all';
  isVegetarian: boolean | null;
  isSpicy: boolean | null;
  maxPrice: number | null;
  ingredient: string;
}

/**
 * Sort options for pizza menu
 */
export interface PizzaSortOption {
  field: 'name' | 'price' | 'rating';
  direction: 'asc' | 'desc';
}

/**
 * Theme mode
 */
export type ThemeMode = 'light' | 'dark';

/**
 * Form data for adding a new pizza
 */
export interface AddPizzaFormData {
  name: string;
  description: string;
  price: number;
  category: PizzaCategory;
  ingredients: string[];
  imageUrl: string;
  isVegetarian: boolean;
  isSpicy: boolean;
  prepTime: number;
}

/**
 * Notification/Toast types
 */
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

/**
 * Chart data types for visualizations
 */
export interface PriceChartData {
  name: string;
  price: number;
  fill?: string;
}

export interface OrderDistributionData {
  name: string;
  value: number;
  fill?: string;
}

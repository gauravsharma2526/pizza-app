# 🍕 Crust & Co - Pizza Ordering Application

A modern, full-featured React application for ordering pizzas. Built with TypeScript, Redux Toolkit, and Tailwind CSS. Features production-level UX with animations, infinite scroll, search autocomplete, and more.

![Crust & Co](https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=400&fit=crop)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Data Structure](#-data-structure)
- [Discount Rules](#-discount-rules)
- [Design Decisions](#-design-decisions)
- [Testing](#-testing)
- [Scripts](#-scripts)
- [Advanced Features](#-advanced-features)

## ✨ Features

### Core Functionality
- **Pizza Menu**: Browse pizzas loaded from local JSON with "Load More" pagination
- **Filtering & Sorting**: Filter by category, vegetarian, spicy, price range, or ingredients
- **Debounced Search**: Real-time search with 300ms debounce for smooth UX
- **Search Autocomplete**: Suggestions with recent searches and popular terms
- **Shopping Cart**: Add pizzas with quantities, slide-out drawer + dedicated cart page
- **Bulk Discount**: 10% discount when ordering 3+ of the same pizza
- **Order Confirmation**: Confirm orders with celebration confetti animation

### Pages
| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Landing page with hero, best sellers, quick picks |
| `/menu` | Menu | Pizza grid, filters, order summary, charts |
| `/pizza/:id` | Pizza Details | Full pizza info with similar recommendations |
| `/add-pizza` | Add Pizza | Form to add new pizzas with validation |
| `/cart` | Cart | Full-page checkout with order summary |
| `/orders` | Order History | View past orders with quick reorder |

### Production-Level UX Features
- 🎉 **Confetti Animation**: Celebration effect on order confirmation
- ⏳ **Skeleton Loaders**: Smooth loading states for pizza cards
- 📱 **Floating Cart Button**: Mobile-friendly quick cart access
- 🎊 **Success Modal**: Animated order confirmation modal
- ❤️ **Favorites System**: Save favorite pizzas (persisted)
- 🔄 **Quick Reorder**: One-click reorder from history
- 📄 **Load More / Infinite Scroll**: Pagination options for large lists
- 🔍 **Search Autocomplete**: Type-ahead suggestions with recent searches
- 🌙 **Dark/Light Theme**: Full theming with system preference detection
- 📊 **Data Visualizations**: Interactive charts (Recharts)
- 💾 **Persistent State**: Cart, orders, and favorites saved across sessions

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 19** | UI library |
| **TypeScript** | Type safety |
| **Redux Toolkit** | State management |
| **Redux Persist** | State persistence |
| **React Router DOM** | Client-side routing |
| **React Hook Form** | Form handling |
| **Zod** | Schema validation |
| **Tailwind CSS** | Styling |
| **Recharts** | Data visualizations |
| **Lucide React** | Icons |
| **Canvas Confetti** | Celebration animations |
| **Vitest** | Testing framework |
| **React Testing Library** | Component testing |
| **Vite** | Build tool |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/crust-and-co.git
   cd crust-and-co
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
npm run preview  # Preview the production build
```

## 📁 Project Structure

```
src/
├── components/
│   ├── cart/           # CartDrawer, CartItem
│   ├── charts/         # PriceChart, OrderDistributionChart
│   ├── layout/         # Header, Footer, Layout
│   ├── order/          # OrderSummary, OrderHistory
│   ├── pizza/          # PizzaCard, PizzaFilters, PizzaGrid
│   └── ui/             # Reusable components
│       ├── Button, Input, Card, Badge, Select, Modal
│       ├── Skeleton (loading states)
│       ├── FloatingCartButton (mobile)
│       ├── OrderSuccessModal (celebration)
│       ├── SearchAutocomplete (type-ahead)
│       └── Toast (notifications)
├── data/
│   └── pizzas.json     # Initial pizza data (12 pizzas)
├── hooks/
│   ├── useDebounce.ts  # Value/callback debouncing
│   └── useInfiniteScroll.ts # Intersection Observer hook
├── pages/
│   ├── Home.tsx        # Landing page with hero & featured sections
│   ├── Menu.tsx        # Pizza grid with filters & sidebar
│   ├── PizzaDetails.tsx # Individual pizza view
│   ├── AddPizza.tsx    # Add new pizza form
│   ├── Cart.tsx        # Full checkout page
│   └── Orders.tsx      # Order history
├── store/
│   ├── slices/         # Redux slices
│   │   ├── pizzaSlice.ts    # Pizza menu state
│   │   ├── cartSlice.ts     # Shopping cart
│   │   ├── orderSlice.ts    # Order history
│   │   ├── favoritesSlice.ts # Favorites
│   │   └── uiSlice.ts       # Theme, notifications
│   ├── hooks.ts        # Typed Redux hooks
│   ├── selectors.ts    # Memoized selectors
│   └── index.ts        # Store config with persist
├── test/               # 74 test cases
├── types/              # TypeScript interfaces
├── utils/
│   └── confetti.ts     # Celebration effects
├── App.tsx             # Main app with routing
├── main.tsx            # Entry point
└── index.css           # Global styles
```

## 📊 Data Structure

### Pizza (pizzas.json)

```typescript
interface Pizza {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'classic' | 'meat' | 'vegetarian' | 'specialty';
  ingredients: string[];
  imageUrl: string;
  isVegetarian: boolean;
  isSpicy: boolean;
  rating: number;
  prepTime: number;
}
```

### Order (persisted via Redux Persist)

```typescript
interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  totalDiscount: number;
  total: number;
  createdAt: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered';
}

interface OrderItem {
  pizza: Pizza;
  quantity: number;
  originalPrice: number;  // Before discount
  discountAmount: number; // Savings
  finalPrice: number;     // After discount
}
```

## 💰 Discount Rules

The application implements a **bulk discount** system:

| Condition | Discount | Display |
|-----------|----------|---------|
| 1-2 of same pizza | 0% | Shows "Add X more for 10% off" |
| 3+ of same pizza | **10% off** | Original price strikethrough + savings |

**Example**:
- 3× Margherita ($12.99 each) = $38.97
- 10% discount = -$3.90
- **Final price**: $35.07
- ✅ "You save $3.90 with bulk discount!"

## 🎨 Design Decisions

### State Management: Redux Toolkit

**Why Redux over Context API?**
- Complex state with 5 slices (pizzas, cart, orders, favorites, UI)
- Memoized selectors for discount calculations
- DevTools support for debugging
- Redux Persist integration for localStorage

### Custom Hooks

| Hook | Purpose |
|------|---------|
| `useDebounce` | Debounce search input (300ms) |
| `useDebouncedCallback` | Debounce any callback function |
| `useInfiniteScroll` | Intersection Observer for infinite scroll |

### Form Handling: React Hook Form + Zod

- Performant form state management
- Schema-based validation with Zod
- Type-safe form data
- Field array handling for ingredients

### Styling: Tailwind CSS

- Custom theme with primary/secondary colors
- CSS animations (slide-up, bounce-in, fade-in, shimmer)
- Dark mode via class strategy
- Responsive breakpoints

### Color Theme

| Color | Usage | Association |
|-------|-------|-------------|
| **Primary (Red)** | CTAs, branding | Italian/pizza aesthetics |
| **Secondary (Gold)** | Accents, ratings | Cheese, warmth |
| **Accent (Green)** | Discounts, success | Fresh basil, savings |

## 🧪 Testing

### Running Tests

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with coverage
npm run test:coverage
```

### Test Coverage (74 tests)

| Test File | Tests | Coverage |
|-----------|-------|----------|
| `selectors.test.ts` | 15 | Filtering, sorting, discounts |
| `cartSlice.test.ts` | 10 | Cart CRUD operations |
| `favoritesSlice.test.ts` | 10 | Favorites toggle/clear |
| `PizzaCard.test.tsx` | 10 | Card rendering, interactions |
| `AddPizza.test.tsx` | 5 | Form validation |
| `Skeleton.test.tsx` | 12 | Loading components |
| `FloatingCartButton.test.tsx` | 4 | Mobile cart button |
| `useDebounce.test.ts` | 8 | Debounce timing |

## 📜 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |
| `npm run format` | Format code with Prettier |
| `npm test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |
| `npm run test:coverage` | Run tests with coverage |

## 🔧 Advanced Features

### Search Autocomplete

```tsx
<SearchAutocomplete
  value={searchValue}
  onChange={setSearchValue}
  onSelect={(pizza) => navigate(`/pizza/${pizza.id}`)}
/>
```

Features:
- Debounced search (200ms)
- Recent searches (localStorage)
- Popular search suggestions
- Keyboard navigation (↑↓ Enter Esc)
- Pizza preview with image, rating, price

### Infinite Scroll / Load More

```tsx
<PizzaGrid
  initialItemsToShow={6}
  itemsPerLoad={6}
  paginationMode="infiniteScroll" // or "loadMore" or "none"
/>
```

Features:
- Intersection Observer for efficient scroll detection
- Progress indicator
- "Show All" option
- Auto-reset on filter change

### Favorites System

```tsx
// Toggle favorite
dispatch(toggleFavorite(pizzaId));

// Check if favorited
const isFavorite = useAppSelector(selectIsFavorite(pizzaId));

// Get all favorites
const favorites = useAppSelector(selectFavoritePizzas);
```

### Confetti Celebration

```tsx
import { triggerPizzaConfetti } from '../utils/confetti';

// On order confirmation
triggerPizzaConfetti();
```

## 📱 Responsive Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | < 640px | Single column, floating cart |
| `sm` | 640px+ | 2 columns |
| `md` | 768px+ | Mobile menu hidden |
| `lg` | 1024px+ | 3 columns |
| `xl` | 1280px+ | Sidebar layout |

## 🙏 Acknowledgments

- Pizza images from [Unsplash](https://unsplash.com)
- Icons from [Lucide](https://lucide.dev)
- Fonts: Playfair Display, Nunito (Google Fonts)

---

Built with ❤️ and fresh ingredients 🍕

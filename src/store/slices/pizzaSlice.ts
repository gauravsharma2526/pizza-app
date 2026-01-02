import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Pizza, PizzaFilters, PizzaSortOption, PizzaCategory } from '../../types';
import pizzasData from '../../data/pizzas.json';

interface PizzaState {
  items: Pizza[];
  filters: PizzaFilters;
  sortOption: PizzaSortOption;
  isLoading: boolean;
  error: string | null;
}

const initialFilters: PizzaFilters = {
  search: '',
  category: 'all',
  isVegetarian: null,
  isSpicy: null,
  maxPrice: null,
  ingredient: '',
};

const initialState: PizzaState = {
  items: pizzasData as Pizza[],
  filters: initialFilters,
  sortOption: { field: 'name', direction: 'asc' },
  isLoading: false,
  error: null,
};

const pizzaSlice = createSlice({
  name: 'pizzas',
  initialState,
  reducers: {
    // Add a new pizza to the menu
    addPizza: (state, action: PayloadAction<Pizza>) => {
      state.items.push(action.payload);
    },

    // Update an existing pizza
    updatePizza: (state, action: PayloadAction<Pizza>) => {
      const index = state.items.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },

    // Remove a pizza from the menu
    removePizza: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((p) => p.id !== action.payload);
    },

    // Set search filter
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
    },

    // Set category filter
    setCategoryFilter: (state, action: PayloadAction<PizzaCategory | 'all'>) => {
      state.filters.category = action.payload;
    },

    // Set vegetarian filter
    setVegetarianFilter: (state, action: PayloadAction<boolean | null>) => {
      state.filters.isVegetarian = action.payload;
    },

    // Set spicy filter
    setSpicyFilter: (state, action: PayloadAction<boolean | null>) => {
      state.filters.isSpicy = action.payload;
    },

    // Set max price filter
    setMaxPriceFilter: (state, action: PayloadAction<number | null>) => {
      state.filters.maxPrice = action.payload;
    },

    // Set ingredient filter
    setIngredientFilter: (state, action: PayloadAction<string>) => {
      state.filters.ingredient = action.payload;
    },

    // Reset all filters
    resetFilters: (state) => {
      state.filters = initialFilters;
    },

    // Set sort option
    setSortOption: (state, action: PayloadAction<PizzaSortOption>) => {
      state.sortOption = action.payload;
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Set error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  addPizza,
  updatePizza,
  removePizza,
  setSearchFilter,
  setCategoryFilter,
  setVegetarianFilter,
  setSpicyFilter,
  setMaxPriceFilter,
  setIngredientFilter,
  resetFilters,
  setSortOption,
  setLoading,
  setError,
} = pizzaSlice.actions;

export default pizzaSlice.reducer;

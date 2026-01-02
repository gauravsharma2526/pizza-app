import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { FavoriteItem } from '../../types';

interface FavoritesState {
  items: FavoriteItem[];
}

const initialState: FavoritesState = {
  items: [],
};

/**
 * Favorites slice manages user's favorite pizzas
 * Persisted via Redux Persist for user convenience
 */
const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    // Add pizza to favorites
    addToFavorites: (state, action: PayloadAction<string>) => {
      const pizzaId = action.payload;
      const exists = state.items.some((item) => item.pizzaId === pizzaId);

      if (!exists) {
        state.items.push({
          pizzaId,
          addedAt: new Date().toISOString(),
        });
      }
    },

    // Remove pizza from favorites
    removeFromFavorites: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.pizzaId !== action.payload);
    },

    // Toggle favorite status
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const pizzaId = action.payload;
      const index = state.items.findIndex((item) => item.pizzaId === pizzaId);

      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push({
          pizzaId,
          addedAt: new Date().toISOString(),
        });
      }
    },

    // Clear all favorites
    clearFavorites: (state) => {
      state.items = [];
    },
  },
});

export const { addToFavorites, removeFromFavorites, toggleFavorite, clearFavorites } =
  favoritesSlice.actions;

export default favoritesSlice.reducer;

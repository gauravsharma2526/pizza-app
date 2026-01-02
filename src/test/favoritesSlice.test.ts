import { describe, it, expect } from 'vitest';
import favoritesReducer, {
  addToFavorites,
  removeFromFavorites,
  toggleFavorite,
  clearFavorites,
} from '../store/slices/favoritesSlice';

describe('favoritesSlice', () => {
  const initialState = {
    items: [],
  };

  describe('addToFavorites', () => {
    it('should add a pizza to favorites', () => {
      const state = favoritesReducer(initialState, addToFavorites('pizza-1'));

      expect(state.items).toHaveLength(1);
      expect(state.items[0].pizzaId).toBe('pizza-1');
      expect(state.items[0].addedAt).toBeDefined();
    });

    it('should not add duplicate pizzas to favorites', () => {
      let state = favoritesReducer(initialState, addToFavorites('pizza-1'));
      state = favoritesReducer(state, addToFavorites('pizza-1'));

      expect(state.items).toHaveLength(1);
    });

    it('should add multiple different pizzas to favorites', () => {
      let state = favoritesReducer(initialState, addToFavorites('pizza-1'));
      state = favoritesReducer(state, addToFavorites('pizza-2'));
      state = favoritesReducer(state, addToFavorites('pizza-3'));

      expect(state.items).toHaveLength(3);
    });
  });

  describe('removeFromFavorites', () => {
    it('should remove a pizza from favorites', () => {
      let state = favoritesReducer(initialState, addToFavorites('pizza-1'));
      state = favoritesReducer(state, addToFavorites('pizza-2'));
      state = favoritesReducer(state, removeFromFavorites('pizza-1'));

      expect(state.items).toHaveLength(1);
      expect(state.items[0].pizzaId).toBe('pizza-2');
    });

    it('should handle removing non-existent pizza gracefully', () => {
      const state = favoritesReducer(initialState, removeFromFavorites('non-existent'));

      expect(state.items).toHaveLength(0);
    });
  });

  describe('toggleFavorite', () => {
    it('should add pizza if not in favorites', () => {
      const state = favoritesReducer(initialState, toggleFavorite('pizza-1'));

      expect(state.items).toHaveLength(1);
      expect(state.items[0].pizzaId).toBe('pizza-1');
    });

    it('should remove pizza if already in favorites', () => {
      let state = favoritesReducer(initialState, addToFavorites('pizza-1'));
      state = favoritesReducer(state, toggleFavorite('pizza-1'));

      expect(state.items).toHaveLength(0);
    });

    it('should toggle correctly multiple times', () => {
      let state = favoritesReducer(initialState, toggleFavorite('pizza-1'));
      expect(state.items).toHaveLength(1);

      state = favoritesReducer(state, toggleFavorite('pizza-1'));
      expect(state.items).toHaveLength(0);

      state = favoritesReducer(state, toggleFavorite('pizza-1'));
      expect(state.items).toHaveLength(1);
    });
  });

  describe('clearFavorites', () => {
    it('should clear all favorites', () => {
      let state = favoritesReducer(initialState, addToFavorites('pizza-1'));
      state = favoritesReducer(state, addToFavorites('pizza-2'));
      state = favoritesReducer(state, addToFavorites('pizza-3'));
      state = favoritesReducer(state, clearFavorites());

      expect(state.items).toHaveLength(0);
    });

    it('should handle clearing empty favorites', () => {
      const state = favoritesReducer(initialState, clearFavorites());

      expect(state.items).toHaveLength(0);
    });
  });
});

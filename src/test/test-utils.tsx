/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import pizzaReducer from '../store/slices/pizzaSlice';
import cartReducer from '../store/slices/cartSlice';
import orderReducer from '../store/slices/orderSlice';
import uiReducer from '../store/slices/uiSlice';
import favoritesReducer from '../store/slices/favoritesSlice';

const rootReducer = combineReducers({
  pizzas: pizzaReducer,
  cart: cartReducer,
  orders: orderReducer,
  ui: uiReducer,
  favorites: favoritesReducer,
});

type TestRootState = ReturnType<typeof rootReducer>;

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<TestRootState>;
}

/**
 * Custom render function with Redux Provider and Router
 */
export function renderWithProviders(
  ui: React.ReactElement,
  { preloadedState = {}, ...renderOptions }: ExtendedRenderOptions = {}
) {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState: preloadedState as Partial<TestRootState>,
  });

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <BrowserRouter>{children}</BrowserRouter>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

export * from '@testing-library/react';
export { renderWithProviders as render };

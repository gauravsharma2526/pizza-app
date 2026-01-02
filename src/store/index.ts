import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import pizzaReducer from './slices/pizzaSlice';
import cartReducer from './slices/cartSlice';
import orderReducer from './slices/orderSlice';
import uiReducer from './slices/uiSlice';
import favoritesReducer from './slices/favoritesSlice';

const rootReducer = combineReducers({
  pizzas: pizzaReducer,
  cart: cartReducer,
  orders: orderReducer,
  ui: uiReducer,
  favorites: favoritesReducer,
});

const persistConfig = {
  key: 'pizza-app-root',
  version: 1,
  storage,
  whitelist: ['pizzas', 'cart', 'orders', 'ui', 'favorites'], // Persist all reducers
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

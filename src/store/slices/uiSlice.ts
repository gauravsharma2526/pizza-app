import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ThemeMode, Notification } from '../../types';

interface UIState {
  theme: ThemeMode;
  notifications: Notification[];
  isMobileMenuOpen: boolean;
}

const initialState: UIState = {
  theme: 'light',
  notifications: [],
  isMobileMenuOpen: false,
};

/**
 * UI slice manages global UI state
 * Theme, notifications, mobile menu, etc.
 */
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Toggle between light and dark theme
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },

    // Set specific theme
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.theme = action.payload;
    },

    // Add a notification
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.push(action.payload);
    },

    // Remove a notification by id
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },

    // Clear all notifications
    clearNotifications: (state) => {
      state.notifications = [];
    },

    // Toggle mobile menu
    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },

    // Set mobile menu state
    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.isMobileMenuOpen = action.payload;
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  addNotification,
  removeNotification,
  clearNotifications,
  toggleMobileMenu,
  setMobileMenuOpen,
} = uiSlice.actions;

export default uiSlice.reducer;

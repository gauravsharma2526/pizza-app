import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Order } from '../../types';

interface OrderState {
  orders: Order[];
  currentOrderId: string | null;
  isProcessing: boolean;
}

const initialState: OrderState = {
  orders: [],
  currentOrderId: null,
  isProcessing: false,
};

/**
 * Order slice manages confirmed orders
 * Simulates saving orders to a backend/database
 */
const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    // Add a new confirmed order
    addOrder: (state, action: PayloadAction<Order>) => {
      state.orders.push(action.payload);
      state.currentOrderId = action.payload.id;
    },

    // Update order status
    updateOrderStatus: (
      state,
      action: PayloadAction<{ orderId: string; status: Order['status'] }>
    ) => {
      const order = state.orders.find((o) => o.id === action.payload.orderId);
      if (order) {
        order.status = action.payload.status;
      }
    },

    // Set processing state
    setProcessing: (state, action: PayloadAction<boolean>) => {
      state.isProcessing = action.payload;
    },

    // Clear current order reference
    clearCurrentOrder: (state) => {
      state.currentOrderId = null;
    },

    // Remove an order (for admin purposes)
    removeOrder: (state, action: PayloadAction<string>) => {
      state.orders = state.orders.filter((o) => o.id !== action.payload);
    },
  },
});

export const { addOrder, updateOrderStatus, setProcessing, clearCurrentOrder, removeOrder } =
  orderSlice.actions;

export default orderSlice.reducer;

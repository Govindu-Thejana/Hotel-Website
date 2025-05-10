import { configureStore } from '@reduxjs/toolkit';
import ordersReducer from './ordersSlice';

export const store = configureStore({
  reducer: {
    orders: ordersReducer,
  },
});
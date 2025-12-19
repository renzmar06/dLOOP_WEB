import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import materialsReducer from './slices/materialsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    materials: materialsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
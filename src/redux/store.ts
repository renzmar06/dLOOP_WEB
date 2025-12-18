import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import businessverificationReducer from './slices/businessVerificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    businessVerification: businessverificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import businessverificationReducer from './slices/businessVerificationSlice';
import businessReducer from './slices/businessSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    businessVerification: businessverificationReducer,
    business: businessReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
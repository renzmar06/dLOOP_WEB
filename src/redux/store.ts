import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import materialsReducer from './slices/materialsSlice';
import businessverificationReducer from './slices/businessVerificationSlice';
import businessReducer from './slices/businessSlice';
import billingInformationReducer from'./slices/billingInformationSlice';
import SubscriptionBillingReducer from './slices/subscriptionBillingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    materials: materialsReducer,
    businessVerification: businessverificationReducer,
    business: businessReducer,
    billingInformation: billingInformationReducer,
    subscriptionBilling: SubscriptionBillingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
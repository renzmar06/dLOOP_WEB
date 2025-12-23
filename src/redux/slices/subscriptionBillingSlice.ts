import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface Subscription {
  _id: string;
  planName: string;
  planPrice: string;
  planExpiryDate: string;
  status: 'active' | 'paused' | 'cancelled';
  selectedAt: string;
}

interface SubscriptionBillingState {
  subscriptions: Subscription[];
  isLoading: boolean;
  error: string | null;
}

const initialState: SubscriptionBillingState = {
  subscriptions: [],
  isLoading: false,
  error: null,
};

export const fetchSubscriptions = createAsyncThunk(
  'subscriptionBilling/fetchSubscriptions',
  async () => {
    const response = await fetch('/api/subscription-billing');
    
    if (!response.ok) {
      throw new Error('Failed to fetch subscriptions');
    }
    
    return response.json();
  }
);

export const selectPlan = createAsyncThunk(
  'subscriptionBilling/selectPlan',
  async (subscriptionData: { planName: string; planPrice: string; planExpiryDate: string; status?: string }) => {
    const response = await fetch('/api/subscription-billing', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscriptionData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to select plan');
    }
    
    return response.json();
  }
);

const subscriptionBillingSlice = createSlice({
  name: 'subscriptionBilling',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscriptions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subscriptions = action.payload;
      })
      .addCase(fetchSubscriptions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch subscriptions';
      })
      .addCase(selectPlan.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(selectPlan.fulfilled, (state, action) => {
        state.isLoading = false;
        const existingIndex = state.subscriptions.findIndex(
          sub => sub.planName === action.payload.planName
        );
        if (existingIndex >= 0) {
          state.subscriptions[existingIndex] = action.payload;
        } else {
          state.subscriptions.push(action.payload);
        }
      })
      .addCase(selectPlan.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to select plan';
      });
  },
});

export const { clearError } = subscriptionBillingSlice.actions;
export default subscriptionBillingSlice.reducer;
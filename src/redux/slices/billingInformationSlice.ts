import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface BillingInfo {
  _id: string;
  cardNumber: string;
  expiration: string;
  cvc: string;
  cardholderName: string;
  isDefault: boolean;
  status: 'active' | 'inactive' | 'expired';
  createdAt: string;
}

interface BillingInformationState {
  billingInfo: BillingInfo[];
  isLoading: boolean;
  error: string | null;
}

const initialState: BillingInformationState = {
  billingInfo: [],
  isLoading: false,
  error: null,
};

export const fetchBillingInfo = createAsyncThunk(
  'billingInformation/fetchBillingInfo',
  async () => {
    const response = await fetch('/api/billing-information');
    
    if (!response.ok) {
      throw new Error('Failed to fetch billing information');
    }
    
    return response.json();
  }
);

export const updatePaymentMethod = createAsyncThunk(
  'billingInformation/updatePaymentMethod',
  async (billingData: { cardNumber: string; expiration: string; cvc: string; cardholderName: string; isDefault?: boolean }) => {
    const response = await fetch('/api/billing-information', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(billingData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update payment method');
    }
    
    return response.json();
  }
);

export const cancelSubscription = createAsyncThunk(
  'billingInformation/cancelSubscription',
  async (subscriptionId: string) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`/api/subscription-billing/${subscriptionId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to cancel subscription');
    }
    
    return response.json();
  }
);

const billingInformationSlice = createSlice({
  name: 'billingInformation',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBillingInfo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBillingInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.billingInfo = action.payload.data || action.payload;
      })
      .addCase(fetchBillingInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch billing information';
      })
      .addCase(updatePaymentMethod.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePaymentMethod.fulfilled, (state, action) => {
        state.isLoading = false;
        const paymentData = action.payload.data || action.payload;
        const existingIndex = state.billingInfo.findIndex(
          info => info._id === paymentData._id
        );
        if (existingIndex >= 0) {
          state.billingInfo[existingIndex] = paymentData;
        } else {
          state.billingInfo.push(paymentData);
        }
      })
      .addCase(updatePaymentMethod.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to update payment method';
      })
      .addCase(cancelSubscription.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(cancelSubscription.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(cancelSubscription.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to cancel subscription';
      });
  },
});

export const { clearError } = billingInformationSlice.actions;
export default billingInformationSlice.reducer;
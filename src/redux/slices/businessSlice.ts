import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface BusinessHours {
  open: string;
  close: string;
  closed: boolean;
}

interface BusinessHoursEntry {
  day: string;
  open: string;
  close: string;
  closed: boolean;
}

interface Business {
  _id?: string;
  businessName: string;
  logo: string;
  phone: string;
  email: string;
  website: string;
  googleLocation: string;
  serviceArea: string;
  businessType: string;
  industry: string;
  description: string;
  registeredId: string;
  legalName: string;
  businessHours: BusinessHoursEntry[];
  instagram: string;
  facebook: string;
  twitter: string;
  seoKeywords: string;
}

interface BusinessState {
  businesses: Business[];
  currentBusiness: Business | null;
  loading: boolean;
  error: string | null;
}

const initialState: BusinessState = {
  businesses: [],
  currentBusiness: null,
  loading: false,
  error: null,
};

export const fetchBusinesses = createAsyncThunk(
  'business/fetchBusinesses',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching businesses with token:', token);
      const response = await fetch('/api/business', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      console.log('API Response:', data);
      if (!data.success) throw new Error(data.message);
      return data.data;
    } catch (error) {
      console.error('Fetch businesses error:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch businesses');
    }
  }
);

export const createBusiness = createAsyncThunk(
  'business/createBusiness',
  async (businessData: Omit<Business, '_id'>, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/business', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(businessData),
      });
      const data = await response.json();
      if (!data.success) throw new Error(data.message);
      return data.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create business');
    }
  }
);

export const updateBusiness = createAsyncThunk(
  'business/updateBusiness',
  async ({ id, businessData }: { id: string; businessData: Partial<Business> }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/business/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(businessData),
      });
      const data = await response.json();
      if (!response.ok || (data.success === false)) {
        throw new Error(data.message || 'Failed to update business');
      }
      return { id, ...businessData };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update business');
    }
  }
);

const businessSlice = createSlice({
  name: 'business',
  initialState,
  reducers: {
    setCurrentBusiness: (state, action: PayloadAction<Business | null>) => {
      state.currentBusiness = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBusinesses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBusinesses.fulfilled, (state, action) => {
        console.log('Redux: fetchBusinesses fulfilled with payload:', action.payload);
        state.loading = false;
        state.businesses = action.payload;
        console.log('Redux: Updated businesses state:', state.businesses);
      })
      .addCase(fetchBusinesses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createBusiness.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBusiness.fulfilled, (state, action) => {
        state.loading = false;
        state.businesses.push(action.payload);
        state.currentBusiness = action.payload;
      })
      .addCase(createBusiness.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateBusiness.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBusiness.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.businesses.findIndex(b => b._id === action.payload.id);
        if (index !== -1) {
          state.businesses[index] = { ...state.businesses[index], ...action.payload };
        }
        if (state.currentBusiness?._id === action.payload.id) {
          state.currentBusiness = { ...state.currentBusiness, ...action.payload };
        }
      })
      .addCase(updateBusiness.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentBusiness, clearError } = businessSlice.actions;
export default businessSlice.reducer;
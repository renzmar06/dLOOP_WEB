import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Promotion {
  _id: string;
  userId: string;
  choosePromotionType: string;
  promotionTitle: string;
  description: string;
  materialSelection: string;
  bonusType: string;
  bonusValue: number;
  termsConditions: string;
  visibility: string;
  startDate: string;
  endDate: string;
  dailyRedemptionCap: number;
  totalBudgetCap: number;
  autoPauseWhenBudgetReached: boolean;
  status: string;
  currentRedemptions: number;
  currentSpend: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface PromotionsState {
  promotions: Promotion[];
  currentPromotion: Promotion | null;
  loading: boolean;
  error: string | null;
}

const initialState: PromotionsState = {
  promotions: [],
  currentPromotion: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchPromotions = createAsyncThunk(
  'promotions/fetchPromotions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/promotions');
      const data = await response.json();
      
      if (!data.success) {
        return rejectWithValue(data.message);
      }
      
      return data.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch promotions');
    }
  }
);

export const fetchPromotionById = createAsyncThunk(
  'promotions/fetchPromotionById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/promotions/promotions/${id}`);
      const data = await response.json();
      
      if (!data.success) {
        return rejectWithValue(data.message);
      }
      
      return data.data;
    } catch (error) {
      return rejectWithValue('Failed to fetch promotion');
    }
  }
);

export const createPromotion = createAsyncThunk(
  'promotions/createPromotion',
  async (promotionData: Omit<Promotion, '_id' | 'userId' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/promotions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(promotionData),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        return rejectWithValue(data.message);
      }
      
      return data.data;
    } catch (error) {
      return rejectWithValue('Failed to create promotion');
    }
  }
);

export const updatePromotion = createAsyncThunk(
  'promotions/updatePromotion',
  async ({ id, promotionData }: { id: string; promotionData: Partial<Promotion> }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/promotions/promotions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(promotionData),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        return rejectWithValue(data.message);
      }
      
      return data.data;
    } catch (error) {
      return rejectWithValue('Failed to update promotion');
    }
  }
);

const promotionsSlice = createSlice({
  name: 'promotions',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentPromotion: (state) => {
      state.currentPromotion = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch promotions
      .addCase(fetchPromotions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPromotions.fulfilled, (state, action) => {
        state.loading = false;
        state.promotions = action.payload;
      })
      .addCase(fetchPromotions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch promotion by ID
      .addCase(fetchPromotionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPromotionById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPromotion = action.payload;
      })
      .addCase(fetchPromotionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create promotion
      .addCase(createPromotion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPromotion.fulfilled, (state, action) => {
        state.loading = false;
        state.promotions.push(action.payload);
      })
      .addCase(createPromotion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update promotion
      .addCase(updatePromotion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePromotion.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.promotions.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.promotions[index] = action.payload;
        }
        if (state.currentPromotion?._id === action.payload._id) {
          state.currentPromotion = action.payload;
        }
      })
      .addCase(updatePromotion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearCurrentPromotion } = promotionsSlice.actions;
export default promotionsSlice.reducer;
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface Campaign {
  _id: string;
  boostType: string;
  title: string;
  dailyBudget: number;
  durationDays: number;
  isContinuous: boolean;
  audienceType: string;
  radiusKm: number;
  status: 'draft' | 'active' | 'paused' | 'completed';
  startDate: string;
  endDate: string;
  totalBudget: number;
  createdAt: string;
}

interface CampaignsState {
  campaigns: Campaign[];
  activeCampaigns: Campaign[];
  pausedCampaigns: Campaign[];
  completedCampaigns: Campaign[];
  loading: boolean;
  error: string | null;
}

const initialState: CampaignsState = {
  campaigns: [],
  activeCampaigns: [],
  pausedCampaigns: [],
  completedCampaigns: [],
  loading: false,
  error: null
};

// Async thunks
export const fetchCampaigns = createAsyncThunk(
  'campaigns/fetchCampaigns',
  async (status?: string) => {
    const url = status ? `/api/ads/campaigns?status=${status}` : '/api/ads/campaigns';
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error);
    }
    
    return data.data;
  }
);

export const createCampaign = createAsyncThunk(
  'campaigns/createCampaign',
  async (campaignData: any) => {
    const response = await fetch('/api/ads/campaign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(campaignData)
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error);
    }
    
    return data.data;
  }
);

export const updateCampaign = createAsyncThunk(
  'campaigns/updateCampaign',
  async ({ id, ...campaignData }: { id: string; [key: string]: any }) => {
    const response = await fetch(`/api/ads/campaign/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(campaignData)
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error);
    }
    
    return data.data;
  }
);

export const updateCampaignStatus = createAsyncThunk(
  'campaigns/updateStatus',
  async ({ campaignId, status }: { campaignId: string; status: string }) => {
    const response = await fetch(`/api/ads/campaign/${campaignId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error);
    }
    
    return data.data;
  }
);

export const getEstimate = createAsyncThunk(
  'campaigns/getEstimate',
  async (estimateData: any) => {
    try {
      const response = await fetch('/api/ads/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(estimateData)
      });
      
      const data = await response.json();
      
      if (!data.success) {
        // Return mock data if API fails
        return {
          dailyImpressions: Math.round(estimateData.dailyBudget * 50),
          dailyClicks: Math.round(estimateData.dailyBudget * 2.5),
          totalImpressions: Math.round(estimateData.dailyBudget * 50 * estimateData.durationDays),
          totalClicks: Math.round(estimateData.dailyBudget * 2.5 * estimateData.durationDays),
          estimatedCtr: 5.0,
          totalBudget: estimateData.dailyBudget * estimateData.durationDays
        };
      }
      
      return data.data;
    } catch (error) {
      // Return mock data if request fails
      return {
        dailyImpressions: Math.round(estimateData.dailyBudget * 50),
        dailyClicks: Math.round(estimateData.dailyBudget * 2.5),
        totalImpressions: Math.round(estimateData.dailyBudget * 50 * estimateData.durationDays),
        totalClicks: Math.round(estimateData.dailyBudget * 2.5 * estimateData.durationDays),
        estimatedCtr: 5.0,
        totalBudget: estimateData.dailyBudget * estimateData.durationDays
      };
    }
  }
);

const campaignsSlice = createSlice({
  name: 'campaigns',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch campaigns
    builder
      .addCase(fetchCampaigns.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCampaigns.fulfilled, (state, action) => {
        state.loading = false;
        state.campaigns = action.payload;
        
        // Categorize campaigns by status
        state.activeCampaigns = action.payload.filter((c: Campaign) => c.status === 'active');
        state.pausedCampaigns = action.payload.filter((c: Campaign) => c.status === 'paused');
        state.completedCampaigns = action.payload.filter((c: Campaign) => c.status === 'completed');
      })
      .addCase(fetchCampaigns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch campaigns';
      });

    // Create campaign
    builder
      .addCase(createCampaign.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCampaign.fulfilled, (state, action) => {
        state.loading = false;
        state.campaigns.unshift(action.payload);
        if (action.payload.status === 'active') {
          state.activeCampaigns.unshift(action.payload);
        }
      })
      .addCase(createCampaign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create campaign';
      });

    // Update campaign
    builder
      .addCase(updateCampaign.fulfilled, (state, action) => {
        const updatedCampaign = action.payload;
        const index = state.campaigns.findIndex(c => c._id === updatedCampaign._id);
        
        if (index !== -1) {
          state.campaigns[index] = updatedCampaign;
          
          // Re-categorize campaigns
          state.activeCampaigns = state.campaigns.filter(c => c.status === 'active');
          state.pausedCampaigns = state.campaigns.filter(c => c.status === 'paused');
          state.completedCampaigns = state.campaigns.filter(c => c.status === 'completed');
        }
      });

    // Update campaign status
    builder
      .addCase(updateCampaignStatus.fulfilled, (state, action) => {
        const updatedCampaign = action.payload;
        const index = state.campaigns.findIndex(c => c._id === updatedCampaign._id);
        
        if (index !== -1) {
          state.campaigns[index] = updatedCampaign;
          
          // Re-categorize campaigns
          state.activeCampaigns = state.campaigns.filter(c => c.status === 'active');
          state.pausedCampaigns = state.campaigns.filter(c => c.status === 'paused');
          state.completedCampaigns = state.campaigns.filter(c => c.status === 'completed');
        }
      });
  }
});

export const { clearError } = campaignsSlice.actions;
export default campaignsSlice.reducer;
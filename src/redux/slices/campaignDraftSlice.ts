import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CampaignDraftState {
  step: number;
  boostType: string;
  title: string;
  dailyBudget: number;
  durationDays: number;
  isContinuous: boolean;
  audienceType: 'local' | 'targeted' | 'broad';
  radiusKm: number;
  startDate: string;
  estimate: {
    dailyImpressions: number;
    dailyClicks: number;
    totalImpressions: number;
    totalClicks: number;
    estimatedCtr: number;
    totalBudget: number;
  } | null;
  isEstimating: boolean;
  isCreating: boolean;
}

const initialState: CampaignDraftState = {
  step: 1,
  boostType: '',
  title: '',
  dailyBudget: 10,
  durationDays: 7,
  isContinuous: false,
  audienceType: 'local',
  radiusKm: 5,
  startDate: new Date().toISOString().split('T')[0],
  estimate: null,
  isEstimating: false,
  isCreating: false
};

const campaignDraftSlice = createSlice({
  name: 'campaignDraft',
  initialState,
  reducers: {
    setStep: (state, action: PayloadAction<number>) => {
      state.step = action.payload;
    },
    setBoostType: (state, action: PayloadAction<string>) => {
      state.boostType = action.payload;
    },
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    setBudgetAndDuration: (state, action: PayloadAction<{ dailyBudget: number; durationDays: number; isContinuous: boolean }>) => {
      state.dailyBudget = action.payload.dailyBudget;
      state.durationDays = action.payload.durationDays;
      state.isContinuous = action.payload.isContinuous;
    },
    setAudience: (state, action: PayloadAction<{ audienceType: 'local' | 'targeted' | 'broad'; radiusKm: number }>) => {
      state.audienceType = action.payload.audienceType;
      state.radiusKm = action.payload.radiusKm;
    },
    setStartDate: (state, action: PayloadAction<string>) => {
      state.startDate = action.payload;
    },
    setEstimate: (state, action: PayloadAction<CampaignDraftState['estimate']>) => {
      state.estimate = action.payload;
    },
    setEstimating: (state, action: PayloadAction<boolean>) => {
      state.isEstimating = action.payload;
    },
    setCreating: (state, action: PayloadAction<boolean>) => {
      state.isCreating = action.payload;
    },
    resetDraft: () => initialState
  }
});

export const {
  setStep,
  setBoostType,
  setTitle,
  setBudgetAndDuration,
  setAudience,
  setStartDate,
  setEstimate,
  setEstimating,
  setCreating,
  resetDraft
} = campaignDraftSlice.actions;

export default campaignDraftSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface Material {
  id: number;
  name: string;
  materialType: string;
  unitType: string;
  crvPrice: string;
  scrapPrice: string;
  perUnit: string;
  minQuantity: string;
  maxQuantity: string;
  specialNotes: string;
  createdAt: string;
}

interface MaterialsState {
  materials: Material[];
  isLoading: boolean;
  error: string | null;
}

const initialState: MaterialsState = {
  materials: [],
  isLoading: false,
  error: null,
};

export const addMaterial = createAsyncThunk(
  'materials/add',
  async (materialData: Omit<Material, 'id' | 'createdAt'>) => {
    const response = await fetch('/api/materials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(materialData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to add material');
    }
    
    const data = await response.json();
    return data.material;
  }
);

const materialsSlice = createSlice({
  name: 'materials',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addMaterial.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addMaterial.fulfilled, (state, action) => {
        state.isLoading = false;
        state.materials.push(action.payload);
      })
      .addCase(addMaterial.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to add material';
      });
  },
});

export const { clearError } = materialsSlice.actions;
export default materialsSlice.reducer;
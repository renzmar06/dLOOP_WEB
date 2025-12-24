import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Material } from '@/models/Material';

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

export const fetchMaterials = createAsyncThunk(
  'materials/fetch',
  async () => {
    const response = await fetch('/api/materials');
    
    if (!response.ok) {
      throw new Error('Failed to fetch materials');
    }
    
    const data = await response.json();
    return data.materials;
  }
);

export const addMaterial = createAsyncThunk(
  'materials/add',
  async (materialData: Omit<Material, '_id' | 'createdAt' | 'updatedAt'>) => {
    const response = await fetch('/api/materials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(materialData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to add material');
    }
    
    const data = await response.json();
    return data.data;
  }
);

export const deleteSubmaterial = createAsyncThunk(
  'materials/deleteSubmaterial',
  async ({ materialId, submaterialId }: { materialId: string; submaterialId: string }) => {
    const response = await fetch(`/api/materials/${materialId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ submaterialId }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete submaterial');
    }
    
    return { materialId, submaterialId };
  }
);

export const updateSubmaterial = createAsyncThunk(
  'materials/updateSubmaterial',
  async ({ materialId, submaterialId, config }: { materialId: string; submaterialId: string; config: any }) => {
    const response = await fetch(`/api/materials/${materialId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ submaterialId, config }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update submaterial');
    }
    
    const data = await response.json();
    return data;
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
      .addCase(fetchMaterials.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMaterials.fulfilled, (state, action) => {
        state.isLoading = false;
        state.materials = action.payload;
      })
      .addCase(fetchMaterials.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch materials';
      })
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
      })
      .addCase(deleteSubmaterial.fulfilled, (state, action) => {
        const { materialId, submaterialId } = action.payload;
        const material = state.materials.find(m => m._id === materialId);
        if (material) {
          material.submaterial = material.submaterial.filter(sub => sub.id !== submaterialId);
        }
      })
      .addCase(updateSubmaterial.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateSubmaterial.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(updateSubmaterial.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to update submaterial';
      });
  },
});

export const { clearError } = materialsSlice.actions;
export default materialsSlice.reducer;
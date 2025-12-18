import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface Document {
  _id: string;
  documentType: string;
  url: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadedAt: string;
}

interface BusinessVerificationState {
  documents: Document[];
  isLoading: boolean;
  error: string | null;
}

const initialState: BusinessVerificationState = {
  documents: [],
  isLoading: false,
  error: null,
};

export const fetchDocuments = createAsyncThunk(
  'businessVerification/fetchDocuments',
  async () => {
    const response = await fetch('/api/business-verification');
    
    if (!response.ok) {
      throw new Error('Failed to fetch documents');
    }
    
    return response.json();
  }
);

export const uploadDocument = createAsyncThunk(
  'businessVerification/uploadDocument',
  async (documentData: { documentType: string; url: string; status?: string }) => {
    const response = await fetch('/api/business-verification', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(documentData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to save document');
    }
    
    return response.json();
  }
);

const businessVerificationSlice = createSlice({
  name: 'businessVerification',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocuments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.documents = action.payload;
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch documents';
      })
      .addCase(uploadDocument.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.isLoading = false;
        const existingIndex = state.documents.findIndex(
          doc => doc.documentType === action.payload.documentType
        );
        if (existingIndex >= 0) {
          state.documents[existingIndex] = action.payload;
        } else {
          state.documents.push(action.payload);
        }
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to upload document';
      });
  },
});

export const { clearError } = businessVerificationSlice.actions;
export default businessVerificationSlice.reducer;
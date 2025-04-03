import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface File {
  id: string;
  fileId: string;
  fileName: string;
  sourceLanguage?: string;
  translatedLanguage?: string;
  translated: boolean;
  approval_1: boolean;
  approval_2: boolean;
  approval_3?: boolean;
}

interface FileState {
  files: File[];
  loading: boolean;
  error: string | null;
}

const initialState: FileState = {
  files: [],
  loading: false,
  error: null,
};

const fileSlice = createSlice({
  name: "files",
  initialState,
  reducers: {
    addFile: (state, action: PayloadAction<File>) => {
      state.files.push(action.payload);
    },
    setFiles: (state, action: PayloadAction<File[]>) => {
      state.files = action.payload;
    },
    deleteFile: (state, action: PayloadAction<string>) => {
      state.files = state.files.filter((file) => file.id !== action.payload);
    },
    clearFiles: (state) => {
      state.files = [];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  addFile,
  setFiles,
  deleteFile,
  clearFiles,
  setLoading,
  setError,
} = fileSlice.actions;
export default fileSlice.reducer;

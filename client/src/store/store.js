import { configureStore } from "@reduxjs/toolkit";
import fileReducer from "./slices/fileSlice.js";

export const store = configureStore({
  reducer: {
    files: fileReducer,
  },
});

export default store;

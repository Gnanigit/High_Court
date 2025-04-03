import { configureStore } from "@reduxjs/toolkit";
import fileReducer from "./slices/fileSlice";

const store = configureStore({
  reducer: {
    files: fileReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

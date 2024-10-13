import { initialStateTypes } from "@/app/types/initialStateTypes";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: initialStateTypes = {
  isDarkMode: false,
  isSidebarCollapsed: false,
  isHeaderNameDefined: "",
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setIsSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.isSidebarCollapsed = action.payload;
    },
    setIsDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
    },
    setHeaderNameDefined: (state, action: PayloadAction<string>) => {
      state.isHeaderNameDefined = action.payload;
    },
  },
});

export const { setIsDarkMode, setIsSidebarCollapsed, setHeaderNameDefined } =
  globalSlice.actions;
export default globalSlice.reducer;

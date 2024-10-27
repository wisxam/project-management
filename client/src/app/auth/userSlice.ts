import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userId: null,
  },
  reducers: {
    setUserId(state, action) {
      state.userId = action.payload;
    },
    clearUser(state) {
      state.userId = null;
    },
  },
});

export const { setUserId, clearUser } = userSlice.actions;
export default userSlice.reducer;

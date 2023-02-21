import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userEmail: null,
  userPassword: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setActiveUser: (state, action) => {
      state.userEmail = action.payload.userEmail;
      state.userPassword = action.payload.userPassword;
    },
    setUserLogOutState: (state) => {
      state.userEmail = null;
      state.userPassword = null;
    },
  },
});

export const { setActiveUser, setUserLogOutState } = userSlice.actions;

export const selectUserEmail = (state) => state.user.userEmail;
export const selectUserPassword = (state) => state.user.userPassword;

export default userSlice.reducer;

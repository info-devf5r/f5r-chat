import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  onlineUsers: [],
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    getOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },

    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { getOnlineUsers } = userSlice.actions;

export default userSlice.reducer;

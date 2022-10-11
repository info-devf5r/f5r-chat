import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: {},
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      console.log(action.payload);
      const token = action.payload.token || localStorage.getItem('auth-token');
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('auth-token', token);
    },
    logoutUser: (state) => {
      state.user = {};
      state.isAuthenticated = false;
      localStorage.removeItem('auth-token');
    },
  },
});

export const { setUser, logoutUser } = authSlice.actions;

export default authSlice.reducer;

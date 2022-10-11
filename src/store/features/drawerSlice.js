import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: false,
};

export const drawerSlice = createSlice({
  name: 'drawer',
  initialState,
  reducers: {
    toggleSidebarOpen: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
  },
});

export const { toggleSidebarOpen } = drawerSlice.actions;

export default drawerSlice.reducer;

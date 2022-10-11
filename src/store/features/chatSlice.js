import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentChat: {},
  chats: [],
  groupBadgeList: [],
  socket: null,
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    getCurrentChat: (state, action) => {
      state.currentChat = action.payload;
    },
    getAllChats: (state, action) => {
      state.chats = action.payload;
    },
    createChat: (state, action) => {
      state.chats.push(action.payload);
    },
    getSocket: (state, action) => {
      state.socket = action.payload;
    },
    addToBadgeList: (state, action) => {
      const exist = state.groupBadgeList.some(
        (item) => item.id === action.payload.id
      );
      if (!exist) {
        state.groupBadgeList.push(action.payload);
      }
    },
    removeFromBadgeList: (state, action) => {
      state.groupBadgeList = state.groupBadgeList.filter((user) => {
        return user.id.toString() !== action.payload.toString();
      });
    },
  },
});

export const {
  getCurrentChat,
  getAllChats,
  getSocket,
  addToBadgeList,
  removeFromBadgeList,
} = chatSlice.actions;

export default chatSlice.reducer;

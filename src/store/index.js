import { configureStore } from '@reduxjs/toolkit';
import messageReducer from './features/messageSlice';
import authReducer from './features/authSlice';
import chatReducer from './features/chatSlice';
import modalReducer from './features/modalSlice';
import userReducer from './features/userSlice';
import drawerReducer from './features/drawerSlice';

export const store = configureStore({
  reducer: {
    message: messageReducer,
    auth: authReducer,
    chat: chatReducer,
    modal: modalReducer,
    user: userReducer,
    drawer: drawerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

import { configureStore } from '@reduxjs/toolkit';
import userReducer from "../reducers/user";
import avatarReducer from "../reducers/userColor";

const store = configureStore({
    reducer: {
        user: userReducer,
        avatar: avatarReducer,
    }
})

export default store;
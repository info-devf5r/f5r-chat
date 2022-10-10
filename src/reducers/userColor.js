import { createSlice } from "@reduxjs/toolkit";

export const avatarSlice = createSlice({
    name: "avatar",
    initialState: { value: "000" },
    reducers: {
        setColor: (state, action) => {
            state.value = action.payload;
        }
    }
});

export const { setColor } = avatarSlice.actions;
export default avatarSlice.reducer;

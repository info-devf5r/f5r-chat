import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: "user",
    initialState: { value: { userID: "", username: "" } },
    reducers: {
        join: (state, action) => {
            state.value = action.payload;
        }
    }
});

export const { join } = userSlice.actions;
export default userSlice.reducer;

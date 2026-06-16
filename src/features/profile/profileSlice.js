import { createSlice } from "@reduxjs/toolkit";
import { getUserInfo } from "../profile/profileThunk"


const initialState = {
    profileUser: null,
    profileLoading: false,
    profileError: null,
}

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

        //fetch profile info
            .addCase(getUserInfo.pending, (state) => {
                state.profileLoading = true;
                state.profileError = null;
            })
            .addCase(getUserInfo.fulfilled, (state, action) => {
                state.profileLoading = false;
                state.profileUser = action.payload;
            })
            .addCase(getUserInfo.rejected, (state, action) => {
                state.profileLoading = false;
                state.profileError = action.payload;
            })
    },
})

export default profileSlice.reducer;
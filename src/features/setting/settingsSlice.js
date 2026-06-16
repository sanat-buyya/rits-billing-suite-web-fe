import { createSlice } from "@reduxjs/toolkit";
import { updateSettings, fetchSettingData } from "./settingsThunk"


const initialState = {

  settingData: null,
  settingLoading: false,
  settingError: null,

  getSettingDataLoading:true,

};

const settingSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
           
          // update settings
            .addCase(updateSettings.pending, (state) => {
                state.settingLoading = true;
                state.settingError = null;
            })
            .addCase(updateSettings.fulfilled, (state, action) => {
                state.settingLoading = false;
                state.settingData = action.payload.data;
            })
            .addCase(updateSettings.rejected, (state, action) => {
                state.settingLoading = false;
                state.settingError = action.payload;
            })
 
 
               
            // fetch settings
            .addCase(fetchSettingData.pending, (state) => {
                state.getSettingDataLoading = true;
                state.settingError = null;
            })
            .addCase(fetchSettingData.fulfilled, (state, action) => {
                state.getSettingDataLoading = false;
                state.settingData = action.payload;
            })
            .addCase(fetchSettingData.rejected, (state, action) => {
                state.getSettingDataLoading = false;
                state.settingError = action.payload;
            })
           
    },
});
 
 
 
export default settingSlice.reducer;

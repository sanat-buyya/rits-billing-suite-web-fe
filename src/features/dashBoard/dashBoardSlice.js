import { createSlice } from "@reduxjs/toolkit";
import { fetchDashboardData,
        } from "./dashBoardThunk"

const initialState = {
 
  dashboardData: null,
  dashboardLoading: false,
  dashboardError: null,

};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.dashboardLoading = true;
        state.dashboardError = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.dashboardLoading = false;
        state.dashboardData = action.payload;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.dashboardLoading = false;
        state.dashboardError = action.payload;
      });
  },
});

export default dashboardSlice.reducer;

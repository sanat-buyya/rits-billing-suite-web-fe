import { createSlice } from "@reduxjs/toolkit";
import {
  getAllSubscriptionPlansThunk,
  getPlanDetailsThunk,
} from "./subscriptionThunk";

const initialState = {
  getAllSubscriptionsData: null,
  getAllSubscriptionsLoading: false,
  getAllSubscriptionsError: null,

  getPlanDetailsData: null,
  getPlanDetailsLoading: false,
  getPlanDetailsError: null,
};

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //get all subscriptions
      .addCase(getAllSubscriptionPlansThunk.pending, (state) => {
        state.getAllSubscriptionsLoading = true;
        state.getAllSubscriptionsError = null;
      })
      .addCase(getAllSubscriptionPlansThunk.fulfilled, (state, action) => {
        state.getAllSubscriptionsLoading = false;
        // console.log("payload in slice", action.payload);
        state.getAllSubscriptionsData = action.payload.data;
      })
      .addCase(getAllSubscriptionPlansThunk.rejected, (state, action) => {
        state.getAllSubscriptionsLoading = false;
        state.getAllSubscriptionsError = action.payload;
      })
      .addCase(getPlanDetailsThunk.pending, (state) => {
        state.getPlanDetailsLoading = true;
        state.getPlanDetailsError = null;
      })
      .addCase(getPlanDetailsThunk.fulfilled, (state, action) => {
        state.getPlanDetailsLoading = false;
        state.getPlanDetailsData = action.payload;
      })
      .addCase(getPlanDetailsThunk.rejected, (state, action) => {
        state.getPlanDetailsLoading = false;
        state.getPlanDetailsError = action.payload;
      });
  },
});
export default subscriptionSlice.reducer;

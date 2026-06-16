import { createSlice } from "@reduxjs/toolkit";

import { createOrderThunk,verifyPaymentThunk } from "./paymentThunk";

const initialState = {
  createOrderData: null,
  createOrderLoading: false,
  createOrderError: null,

  verifyPaymentData: null,
  verifyPaymentLoading: false,
  verifyPaymentError: null,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //create order
      .addCase(createOrderThunk.pending, (state) => {
        state.createOrderLoading = true;
        state.createOrderError = null;
      })
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.createOrderLoading = false;
        // console.log("payload in slice", action.payload);
        state.createOrderData = action.payload;
      })
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.createOrderLoading = false;
        state.createOrderError = action.payload;
      })

      //verify payment
      .addCase(verifyPaymentThunk.pending, (state) => {
        state.verifyPaymentLoading = true;
        state.verifyPaymentError = null;
      })
      .addCase(verifyPaymentThunk.fulfilled, (state, action) => {
        state.verifyPaymentLoading = false;
        state.verifyPaymentData = action.payload;
      })
      .addCase(verifyPaymentThunk.rejected, (state, action) => {
        state.verifyPaymentLoading = false;
        state.verifyPaymentError = action.payload;
      });
  },
});

export default paymentSlice.reducer;

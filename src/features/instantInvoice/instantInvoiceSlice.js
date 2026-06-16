import { createSlice } from "@reduxjs/toolkit";
import {
  getCustomerByNumber,
  getProductsByIds,
  createInstantInvoice,
} from "./instantInvoiceThunk";

const initialState = {
  customerData: null,
  customerDataLoading: false,
  customerDataError: null,

  fetchedProduct: null,
  fetchedProductLoading: false,
  fetchedProductError: null,

  createdInvoice: null,
  createInstantInvoiceLoading: false,
  createInstantInvoiceError: null,
};

const instantInvoiceSlice = createSlice({
  name: "instantInvoice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Customer fetch cases
      .addCase(getCustomerByNumber.pending, (state) => {
        state.customerDataLoading = true;
        state.customerDataError = null;
      })
      .addCase(getCustomerByNumber.fulfilled, (state, action) => {
        state.customerDataLoading = false;
        state.customerData = action.payload;
      })
      .addCase(getCustomerByNumber.rejected, (state, action) => {
        state.customerDataLoading = false;
        state.customerDataError = action.payload;
      })

      // Product fetch cases
      .addCase(getProductsByIds.pending, (state) => {
        state.fetchedProductLoading = true;
        state.fetchedProductError = null;
      })
      .addCase(getProductsByIds.fulfilled, (state, action) => {
        state.fetchedProductLoading = false;
        state.fetchedProduct = action.payload;
      })
      .addCase(getProductsByIds.rejected, (state, action) => {
        state.fetchedProductLoading = false;
        state.fetchedProductError = action.payload;
      })

      // Invoice creation cases
      .addCase(createInstantInvoice.pending, (state) => {
        state.createInstantInvoiceLoading = true;
        state.createInstantInvoiceError = null;
      })
      .addCase(createInstantInvoice.fulfilled, (state, action) => {
        state.createInstantInvoiceLoading = false;
        state.createdInvoice = action.payload;
      })
      .addCase(createInstantInvoice.rejected, (state, action) => {
        state.createInstantInvoiceLoading = false;
        state.createInstantInvoiceError = action.payload;
      });
  },
});

export default instantInvoiceSlice.reducer;

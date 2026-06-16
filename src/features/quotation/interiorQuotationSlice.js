import { createSlice } from "@reduxjs/toolkit";
import { createInteriorQuotation } from "./interiorQuotationThunk";

const interiorQuotationSlice = createSlice({
  name: "interiorQuotation",
  initialState: {
    interiorQuotationLoading: false,
    interiorQuotationSuccess: false,
    interiorQuotationError: null,
    interiorQuotationQuotation: null,
  },

  reducers: {
    resetQuotationState: (state) => {
      state.interiorQuotationLoading = false;
      state.interiorQuotationSuccess = false;
      state.interiorQuotationError = null;
      state.interiorQuotationQuotation = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(createInteriorQuotation.pending, (state) => {
        state.interiorQuotationLoading = true;
        state.interiorQuotationError = null;
      })
      .addCase(createInteriorQuotation.fulfilled, (state, action) => {
        state.interiorQuotationLoading = false;
        state.interiorQuotationSuccess = true;
        state.interiorQuotationQuotation = action.payload;
      })
      .addCase(createInteriorQuotation.rejected, (state, action) => {
        state.interiorQuotationLoading = false;
        state.interiorQuotationError = action.payload;
      });
  },
});

export const { resetQuotationState } = interiorQuotationSlice.actions;
export default interiorQuotationSlice.reducer;

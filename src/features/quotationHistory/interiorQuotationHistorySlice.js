import { createSlice } from "@reduxjs/toolkit";
import { fetchInteriorQuotationHistoryData } from "./interiorQuotationHistoryThunk";

const initialState = {
  interiorQuotationHistoryData: [],
  interiorQuotationHistoryLoading: false,
  interiorQuotationHistoryError: null,
  interiorQuotationHistoryPage: 1,
  interiorQuotationHistoryTotalPages: 1,
  interiorQuotationHasNextPage: false,
};

const interiorQuotationHistorySlice = createSlice({
  name: "interiorQuotationHistory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInteriorQuotationHistoryData.pending, (state) => {
        state.interiorQuotationHistoryLoading = true;
        state.interiorQuotationHistoryError = null;
      })
      .addCase(fetchInteriorQuotationHistoryData.fulfilled, (state, action) => {
        state.interiorQuotationHistoryLoading = false;
        // Replace data instead of appending for pagination
        state.interiorQuotationHistoryData = action.payload.data;
        state.interiorQuotationHistoryPage = action.payload.currentPage;
        state.interiorQuotationHistoryTotalPages = action.payload.totalPages;
        state.interiorQuotationHasNextPage = action.payload.hasNextPage;
        
        state.interiorQuotationSearchTerm = action.payload.search;
        state.interiorQuotationStatusFilter = action.payload.status;
      })
      .addCase(fetchInteriorQuotationHistoryData.rejected, (state, action) => {
        state.interiorQuotationHistoryLoading = false;
        state.interiorQuotationHistoryError = action.payload;
      });


      
  },
});

export default interiorQuotationHistorySlice.reducer;
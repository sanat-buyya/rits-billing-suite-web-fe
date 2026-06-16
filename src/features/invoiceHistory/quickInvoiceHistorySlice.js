import { createSlice } from "@reduxjs/toolkit";
import { fetchQuickInvoices, getInvoiceDataToPrint, returnProduct, quickInvoiceExportInvoice } from "./quickInvoiceHistoryThunk";

const initialState = {
 
  quickInvoiceData: null,
  quickInvoiceLoading: false,
  quickInvoiceError: null,

  quickInvoicePage: 1,
  quickInvoiceTotalPages: 1,
  quickInvoiceHasNextPage: false,
  quickInvoiceSearchTerm: "",

  invoiceDataToPrint: null,
  invoiceDataToPrintLoading: false,
  invoiceDataToPrintError: null,

  quickInvoiceExportLoading: false,
  quickInvoiceExportError: null,
  quickInvoiceExportSuccess: false,
};

const quickInvoiceHistorySlice = createSlice({
  name: "quickInvoiceHistory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // --- Fetch quick invoices ---
      .addCase(fetchQuickInvoices.pending, (state) => {
        state.quickInvoiceLoading = true;
        state.quickInvoiceError = null;
      })

      .addCase(fetchQuickInvoices.fulfilled, (state, action) => {
        state.quickInvoiceLoading = false;
        state.quickInvoiceData = action.payload.data ;

        state.quickInvoicePage = action.payload.currentPage;
        state.quickInvoiceTotalPages = action.payload.totalPages;
        state.quickInvoiceHasNextPage = action.payload.hasNextPage;
        state.quickInvoiceSearchTerm = action.payload.search;
      })

      .addCase(fetchQuickInvoices.rejected, (state, action) => {
        state.quickInvoiceLoading = false;
        state.quickInvoiceError = action.payload;
      })

      .addCase(getInvoiceDataToPrint.pending, (state) => {
        state.invoiceDataToPrintLoading = true;
        state.invoiceDataToPrintError = null;
      })
      .addCase(getInvoiceDataToPrint.fulfilled, (state, action) => {
        state.invoiceDataToPrintLoading = false;
        state.invoiceDataToPrint = action.payload;
      })
      .addCase(getInvoiceDataToPrint.rejected, (state, action) => {
        state.invoiceDataToPrintLoading = false;
        state.invoiceDataToPrintError = action.payload;
      })

      // return Product
      .addCase(returnProduct.pending, (state) => {
          state.invoiceHistoryLoading = true;
          state.invoiceHistoryError = null;
      })
      .addCase(returnProduct.fulfilled, (state, action) => {
          state.invoiceHistoryLoading = false;
          state.invoiceHistoryData = action.payload;
          })
      .addCase(returnProduct.rejected, (state, action) => {
          state.invoiceHistoryLoading = false;
          state.invoiceHistoryError = action.payload;
      })

       // export invoice
            .addCase(quickInvoiceExportInvoice.pending, (state) => {
                      state.quickInvoiceExportLoading = true;
                      state.quickInvoiceExportError = null;
                      state.quickInvoiceExportSuccess = false;
                  })
                  .addCase(quickInvoiceExportInvoice.fulfilled, (state, action) => {
                      state.quickInvoiceExportLoading = false;
                      state.quickInvoiceExportSuccess = true;
                  })
                  .addCase(quickInvoiceExportInvoice.rejected, (state, action) => {
                      state.quickInvoiceExportLoading = false;
                      state.quickInvoiceExportError = action.payload;
                      state.quickInvoiceExportSuccess = false;
                  });
  },
});

export default quickInvoiceHistorySlice.reducer;

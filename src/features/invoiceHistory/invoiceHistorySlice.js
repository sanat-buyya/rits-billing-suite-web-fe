import { createSlice } from "@reduxjs/toolkit";
import { fetchInvoiceHistoryData, getInvoiceDataToPrint, updateInvoiceStatus, returnProduct, exportInvoice } from "./invoiceHistoryThunk";

const initialState = {
  invoiceHistoryData: null,
  invoiceHistoryLoading: false,
  invoiceHistoryError: null,
  invoiceHistoryPage: 1,
  invoiceHistoryTotalPages: 1,
  invoiceHasNextPage: false,

  invoiceSearchTerm: "",
  invoiceStatusFilter: "ALL",

  invoiceDataToPrint: null,
  invoiceDataToPrintLoading: false,
  invoiceDataToPrintError: null,

  invoiceExportLoading: false,
  invoiceExportError: null,
  invoiceExportSuccess: false,
};

const invoiceHistorySlice = createSlice({
  name: "invoiceHistory",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoiceHistoryData.pending, (state) => {
        state.invoiceHistoryLoading = true;
        state.invoiceHistoryError = null;
      })
      .addCase(fetchInvoiceHistoryData.fulfilled, (state, action) => {
        state.invoiceHistoryLoading = false;
        // Replace data instead of appending for pagination
        state.invoiceHistoryData = action.payload.data;
        state.invoiceHistoryPage = action.payload.currentPage;
        state.invoiceHistoryTotalPages = action.payload.totalPages;
        state.invoiceHasNextPage = action.payload.hasNextPage;
        
        state.invoiceSearchTerm = action.payload.search;
        state.invoiceStatusFilter = action.payload.status;
      })
      .addCase(fetchInvoiceHistoryData.rejected, (state, action) => {
        state.invoiceHistoryLoading = false;
        state.invoiceHistoryError = action.payload;
      })

      //get invoice data to print 
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

      // update settings
      .addCase(updateInvoiceStatus.pending, (state) => {
          state.invoiceHistoryLoading = true;
          state.invoiceHistoryError = null;
      })
      .addCase(updateInvoiceStatus.fulfilled, (state, action) => {
          state.invoiceHistoryLoading = false;
          state.invoiceHistoryData = state.invoiceHistoryData.map((invoice) =>
              invoice.id === action.payload.data._id || invoice._id === action.payload.data._id
              ? { ...invoice, ...action.payload.data, id: action.payload.data._id }
              : invoice
          );
          })
      .addCase(updateInvoiceStatus.rejected, (state, action) => {
          state.invoiceHistoryLoading = false;
          state.invoiceHistoryError = action.payload;
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
      .addCase(exportInvoice.pending, (state) => {
                state.invoiceExportLoading = true;
                state.invoiceExportError = null;
                state.invoiceExportSuccess = false;
            })
            .addCase(exportInvoice.fulfilled, (state, action) => {
                state.invoiceExportLoading = false;
                state.invoiceExportSuccess = true;
            })
            .addCase(exportInvoice.rejected, (state, action) => {
                state.invoiceExportLoading = false;
                state.invoiceExportError = action.payload;
                state.invoiceExportSuccess = false;
            });
  },
});

export default invoiceHistorySlice.reducer;
import { createAsyncThunk } from "@reduxjs/toolkit";
import quickInvoiceHistoryApi from "../../api/quickInvoiceHistoryApi";

export const fetchQuickInvoices = createAsyncThunk(
  "quickInvoices/fetch",
  async ({ search = "", page = 1 }, { rejectWithValue }) => {
    try {
      const response = await quickInvoiceHistoryApi.getQuickInvoiceHistory(
        search,
        page
      );

      return {
        data: response.invoices || [],
        currentPage: response.pagination?.page || page,
        totalPages: response.pagination?.totalPages || 1,
        hasNextPage: response.pagination?.hasNextPage || false,
        search,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to load invoices");
    }
  }
);

export const getInvoiceDataToPrint = createAsyncThunk(
  "/invoiceHistory/getInvoiceDataToPrint",
  async (invoiceId, { rejectWithValue }) => {
    try {
      const response = await quickInvoiceHistoryApi.getInvoiceData(invoiceId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Return Prouct
export const returnProduct = createAsyncThunk(
  "quickInvoices/returnProduct",
  async ({ id, returnedProducts }, { rejectWithValue }) => {
    try {
      const response = await quickInvoiceHistoryApi.returnProduct(id, returnedProducts);
      return {
        data: response.invoice,
        message: response.message,
      };
    } catch (error) {
      console.log(error)
      return rejectWithValue(error.response?.data.error || "Something went wrong");
    }
  }
);

export const quickInvoiceExportInvoice = createAsyncThunk(
  "dashboard/quickInvoiceExportInvoice",
  async (_, { rejectWithValue }) => {
    try {
      const result = await quickInvoiceHistoryApi.quickInvoiceExportInvoiceApi();
      return result;
    } catch (error) {
      console.error("Export Invoice Error:", error);
      return rejectWithValue(error.response?.data || "Failed to export invoices");
    }
  }
);

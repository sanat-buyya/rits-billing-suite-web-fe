import { createAsyncThunk } from "@reduxjs/toolkit";
import invoiceHistoryApi from "../../api/invoiceHistoryApi";

export const fetchInvoiceHistoryData = createAsyncThunk(
  "invoiceHistory/fetchInvoiceHistoryData",
  async ({ search = "", page = 1, status = "ALL" }, { rejectWithValue }) => {
    try {
      const response = await invoiceHistoryApi.getInvoiceHistoryData(search, page, status);
      return {
        data: response.invoices || [],
        currentPage: response.pagination?.page || page,
        totalPages: response.pagination?.totalPages || 1,
        hasNextPage: response.pagination?.hasNextPage || false,
        search,
        status,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);



export const getInvoiceDataToPrint = createAsyncThunk(
  "/invoiceHistory/getInvoiceDataToPrint",
  async (invoiceId, { rejectWithValue }) => {
    try {
      const response = await invoiceHistoryApi.getInvoiceData(invoiceId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

//Invoice status update
export const updateInvoiceStatus = createAsyncThunk(
  "dashboard/updateInvoiceStatus",
  async ({ id, amount, paymentMode }, { rejectWithValue }) => {
    try {
      const response = await invoiceHistoryApi.updateInvoiceStatus(id, amount, paymentMode);
      return {
        data: response.invoice,
        message: response.message,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Return Prouct
export const returnProduct = createAsyncThunk(
  "dashboard/returnProduct",
  async ({ id, returnedProducts }, { rejectWithValue }) => {
    try {
      const response = await invoiceHistoryApi.returnProduct(id, returnedProducts);
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


// Export Invoice
export const exportInvoice = createAsyncThunk(
  "dashboard/exportInvoice",
  async (_, { rejectWithValue }) => {
    try {
      const result = await invoiceHistoryApi.exportInvoiceApi();
      return result;
    } catch (error) {
      console.error("Export Invoice Error:", error);
      return rejectWithValue(error.response?.data || "Failed to export invoices");
    }
  }
);
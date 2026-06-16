import { createAsyncThunk } from "@reduxjs/toolkit";
import instantInvoiceApi from "../../api/instantInvoiceApi";

export const getCustomerByNumber = createAsyncThunk(
  "createInvoice/getCustomerByNumber",
  async (number, { rejectWithValue }) => {
    try {
      const response = await instantInvoiceApi.getCustomerByNumber(number);
      // console.log('getCustomerByNumber response:', response);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getProductsByIds = createAsyncThunk(
  "createInvoice/getProductsByIds",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await instantInvoiceApi.getProductsByIds(productId);
      console.log('getProductsByIds response:', response);
      
      // Return the data directly
      return response.data || response;
    } catch (error) {
      // console.log("error from thunk", error.response.data)
      return rejectWithValue(error.response || error.message);
    }
  }
);

export const createInstantInvoice = createAsyncThunk(
  "quickInvoice/createQuickInvoice",
  async (invoiceData, { rejectWithValue }) => {
    try {
      const response = await instantInvoiceApi.createInstantInvoice(invoiceData);
      // console.log('createInstantInvoice response:', response);
      
      return response.data || response;
    } catch (error) {
      // console.log("error from thunk", error.response.data)
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

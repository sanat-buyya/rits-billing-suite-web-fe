import { createAsyncThunk } from "@reduxjs/toolkit";
import customerApi from "../../api/customerApi";


export const getCustomers = createAsyncThunk(
    "customer/getCustomers",
    async (page = 1, { rejectWithValue }) => {
        try {
            const response = await customerApi.getCustomerApi(page);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

export const searchCustomers = createAsyncThunk(
  "customer/searchCustomers",
  async ({ searchInput, page = 1 }, { rejectWithValue }) => {
    try {
      const response = await customerApi.serchCustomer({ searchInput, page });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const createCustomer = createAsyncThunk(
  "customer/createCustomer",
  async (customerData, { rejectWithValue }) => {
    try {
      const response = await customerApi.createCustomer(customerData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const updateCustomer = createAsyncThunk(
  "customer/updateCustomer",
  async ({ customerId, customerData }, { rejectWithValue }) => {
    try {
      const response = await customerApi.updateCustomer(customerId, customerData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteCustomer = createAsyncThunk(
  "customer/deleteCustomer",
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await customerApi.deleteCustomer(customerId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
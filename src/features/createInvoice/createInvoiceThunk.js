import { createAsyncThunk } from "@reduxjs/toolkit";
import createInvoiceApi from "../../api/createInvoiceApi";


export const getCustomerByNumber = createAsyncThunk(
    "createInvooice/getCustomerByNumber",
    async (number, { rejectWithValue }) => {
        try {
            const response = await createInvoiceApi.getCustomerByNumber(number);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const getProductsByIds = createAsyncThunk(
    "createInvoice/getProductsByIds",
    async (productId, { rejectWithValue }) => {
        try {
            const response = await createInvoiceApi.getProductsByIds(productId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)

export const createInvoice = createAsyncThunk(
    "createInvoice/createInvoice",
    async (data, { rejectWithValue }) => {
        try {
            const response = await createInvoiceApi.createInvoice(data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
)
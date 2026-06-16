import { createAsyncThunk } from "@reduxjs/toolkit";
import quotationApi from "../../api/quotationApi";


// get customers by mobilenumber
export const fetchCustomersByMobileNumber = createAsyncThunk(
    "quotation/fetchCustomersByMobileNumber",

    async(mobileNumber, { rejectWithValue }) => {
        console.log("Thunk called with mobile number:", mobileNumber);
        try {
          const response = await quotationApi.getCustomersByMobileNumber(mobileNumber);
          return response;
        } catch (error) {
          return rejectWithValue(error.response?.data || "Failed to fetch customer");
        }
      }
    );

    // search and get product by product ID

    export const fetchProductByIds = createAsyncThunk(
        "quotation/fetchProductById",
    async (productId, { rejectWithValue }) => {
      try {
        const response = await quotationApi.getProductsByIds(productId);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to fetch products");
      }
    }
  );

  // create quotation

  export const createQuotation = createAsyncThunk(
    "quotation/createQuotation",
    async (quotationData, { rejectWithValue }) => {
  
      try {
        console.log("🟦 [Thunk] Create Quotation Payload:", JSON.stringify(quotationData, null, 2));
        const response = await quotationApi.createQuotationApi(quotationData);
        console.log("🟩 [Thunk] API Response:", response);
        return response;
      } catch (error) {
        console.log("🟥 [Thunk] Create Quotation Error:", error.response?.data || error.message);
        return rejectWithValue(error.response?.data || "Failed to create Quotation");
      }
    }
  );

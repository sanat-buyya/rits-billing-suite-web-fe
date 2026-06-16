import { createAsyncThunk } from "@reduxjs/toolkit";
import interiorQuotationApi from "../../api/interiorQuotationApi";

export const createInteriorQuotation = createAsyncThunk(
  "interiorQuotation/create",
  async (payload, { rejectWithValue }) => {
    try {
      const response =
        await interiorQuotationApi.createInteriorQuotation(payload);
      return response;
    } catch (error) {
      console.error("Error creating quotation:", error.response?.data);

      return rejectWithValue(
        error.response?.data || "Failed to create quotation"
      );
    }
  }
);

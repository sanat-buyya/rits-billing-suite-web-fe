import { createAsyncThunk } from "@reduxjs/toolkit";
import interiorQuotationHistoryApi from "../../api/interiorQuotationHistoryApi";

export const fetchInteriorQuotationHistoryData = createAsyncThunk(
  "interiorQuotationHistory/fetchInteriorQuotationHistoryData",
  async ({ search = "", page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response =
        await interiorQuotationHistoryApi.getInteriorQuotationHistoryData(
          search,
          page,
          limit
        );

      return {
        data: response.data || [],
        currentPage: response.pagination?.page || page,
        totalPages: response.pagination?.totalPages || 1,
        hasNextPage: response.pagination?.hasNextPage || false,
        limit: response.pagination?.limit || limit,
        search,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Something went wrong"
      );
    }
  }
);





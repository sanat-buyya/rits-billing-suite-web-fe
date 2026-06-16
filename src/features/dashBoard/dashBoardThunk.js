import { createAsyncThunk } from "@reduxjs/toolkit";
import dashboardApi from "../../api/dashboardApi";

export const fetchDashboardData = createAsyncThunk(
  "dashboard/fetchDashboardData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardApi.getDashboardData();
      console.log("Dashboard Data:", response);
      return response;
    } catch (error) {
      console.log("Error fetching dashboard data:", error);
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);
import { createAsyncThunk } from "@reduxjs/toolkit";
import profileApi from "../../api/profileApi";


export const getUserInfo = createAsyncThunk(
  "user/getUserInfo",
  async (_, { rejectWithValue }) => {
    try {
      const data = await profileApi.getUserInfo();
      return data;
    } catch (error) {
      console.log("User Info Fetch Error:", error);
      return rejectWithValue(error.response?.data || "Failed to load user info");
    }
  }
);
import { createAsyncThunk } from "@reduxjs/toolkit";
import settingsApi from "../../api/settingsApi";



//update settings 
export const updateSettings = createAsyncThunk(
  "dashboard/updateSettings",
  async ({shopName, gst, state, address, accountName, bankName, accountNumber, ifsc, upiId, paymentNote, invoicePrefix, nextInvoiceNumber, defaultGstPercentage, printSetting, businessLogo}, { rejectWithValue }) => {
    try {
      const response = await settingsApi.updateSettingsApi({
        shopName,
        gst,
        state,
        address,
        accountName,
        bankName,
        accountNumber,
        ifsc,
        upiId,
        paymentNote,
        invoicePrefix,
        nextInvoiceNumber,
        defaultGstPercentage,
        printSetting,
        businessLogo
      });
      return {
        data: response.data,         // updated user object
        message: response.message,   // success message
        success: response.success,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
)


// fetch setting data  
export const fetchSettingData = createAsyncThunk(
  "dashboard/fetchSettings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await settingsApi.getBusinessInfoApi();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);
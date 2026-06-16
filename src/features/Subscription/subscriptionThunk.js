import subscriptionApi from "../../api/subscriptionApi";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getAllSubscriptionPlansThunk = createAsyncThunk(
  "subscription/getAllSubscriptionPlans",
  async (_, { rejectWithValue }) => {
    try {
      const response = await subscriptionApi.getAllSubscriptionPlansApi();
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getPlanDetailsThunk=createAsyncThunk("subscription/getPlanDetails",
    async(_,{rejectWithValue})=>{
        try{
            const response=await subscriptionApi.getPlanDetailsApi()
            return response
        }
        catch(error){
            return rejectWithValue(error.response.data)
        }
    }
)

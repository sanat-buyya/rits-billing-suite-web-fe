import { createAsyncThunk } from "@reduxjs/toolkit";
import paymentApi from "../../api/paymentApi";
import subscriptionApi from "../../api/subscriptionApi";
import storageService from "../../services/localStorage";

export const createOrderThunk = createAsyncThunk(
  "payment/createOrder",
  async (subscriptionId, { rejectWithValue }) => {
    try {
      const response = await paymentApi.createOrderApi(subscriptionId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const verifyPaymentThunk = createAsyncThunk(
  "payment/verifyPayment",
  async (
    {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      subscriptionPlanId,
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      // console.log(
      //   "Payment data in thunk:",
      //   razorpay_payment_id,
      //   razorpay_order_id,
      //   razorpay_signature,
      //   subscriptionPlanId
      // );
      const response = await paymentApi.verifyPaymentApi({
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
        subscriptionPlanId,
      });
      // console.log("respponse from the thunk", response.data.data.token);
      await storageService.setItem("userData", response.data.data);

      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

import { createAsyncThunk } from "@reduxjs/toolkit";
import authApi from "../../api/authApi";
import storageService from "../../services/localStorage";

export const restoreUser = createAsyncThunk(
  "auth/restoreUser",
  async (_, { rejectWithValue }) => {
    try {
      const data = storageService.getItem("userData");
      if (!data || !data.token) {
        return rejectWithValue("No user data found");
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await authApi.loginApi(email, password);
      const userData = response.data; // ✅ matches your backend's "data" field
      storageService.setItem("userData", userData);
      return userData;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ email, password, phone, fullName }, { rejectWithValue }) => {
    try {
      const response = await authApi.registerApi({
        email,
        password,
        phone,
        fullName,
      });
      return {
        status: response.message,
        info: response.data?.message || "Registration successful",
      };
    } catch (error) {
      console.log("this is the erorr", error);
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Registration failed";

      return rejectWithValue(message);
    }
  }
);


// Verify Email 
export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      console.log("📤 Sending verifyEmail payload:", { email, otp });
      const response = await authApi.verifyEmailApi({email, otp});
      const userData = {
        userId: response.data.userId,
        token: response.data.token,
      };

      // ✅ Save user data locally after successful verification
      await storageService.setItem("userData", userData);

      return {
        message: response.message,
        user: userData,
      };
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Email verification failed";

      return rejectWithValue(message);
    }
  }
);


// RESEND OTP
export const resendOtp = createAsyncThunk(
  "auth/resendOtp",
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await authApi.resendOtpApi({ email });

      if (!response.success) {
        return rejectWithValue(response.message || "Failed to resend OTP");
      }

      return response.message;
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to resend OTP";

      return rejectWithValue(message);
    }
  }
);

// FORGOT PASSWORD - SEND OTP
export const forgotPasswordOtp = createAsyncThunk(
  "auth/forgotPasswordOtp",
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await authApi.forgotPasswordOtpApi({ email });
      return response.message;
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to send OTP";

      return rejectWithValue(message);
    }
  }
);


// FORGOT PASSWORD - VERIFY OTP
export const forgotPasswordOtpVerify = createAsyncThunk(
  "auth/forgotPasswordOtpVerify",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await authApi.forgotPasswordOtpVerifyApi({ email, otp });
      return response.data; // includes resetToken
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Forgot password OTP verification failed";

      return rejectWithValue(message);
    }
  }
);

// FORGOT PASSWORD - RESEND OTP
export const forgotPasswordOtpResend = createAsyncThunk(
  "auth/forgotPasswordOtpResend",
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await authApi.forgotPasswordOtpResendApi({ email });
      return response.message;
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Forgot password resend OTP failed";

      return rejectWithValue(message);
    }
  }
);

// RESET PASSWORD
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ password, confirmPassword }, { rejectWithValue }) => {
    try {
      const response = await authApi.resetPasswordApi({ password, confirmPassword });
      return response.message;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to reset password"
      );
    }
  }
);

export const contactForm = createAsyncThunk(
  "auth/contactForm",
  async ({ name, email, message }, { rejectWithValue }) => {
    try {
      const response = await authApi.contactApi({ name, email, message});
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send message"
      );
    }
  }
);
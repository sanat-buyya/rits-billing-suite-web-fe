import { createSlice } from "@reduxjs/toolkit";
import { restoreUser, loginUser, registerUser,  verifyEmail, resendOtp, forgotPasswordOtp, forgotPasswordOtpVerify, forgotPasswordOtpResend, resetPassword, contactForm  } from "./authThunk";
import storageService from "../../services/localStorage";

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,

  // login / restore states
  loading: false,
  error: null,

  // register states (separate)
  registerLoading: false,
  registerError: null,
  registerMessage: null,

   // verify states
  verifyLoading: false,
  verifyError: null,
  verifyMessage: null,

  // resend OTP
  resendLoading: false,
  resendError: null,
  resendMessage: null,

  // forgot password - send OTP
  forgotPasswordOtpLoading: false,
  forgotPasswordOtpError: null,
  forgotPasswordOtpMessage: null,

  // forgot password - verify OTP
  forgotPasswordOtpVerifyLoading: false,
  forgotPasswordOtpVerifyError: null,
  forgotPasswordOtpVerifyMessage: null,
  resetToken: null,

  // forgot password - resend OTP
  forgotPasswordOtpResendLoading: false,
  forgotPasswordOtpResendError: null,
  forgotPasswordOtpResendMessage: null,

  // reset password
  resetPasswordLoading: false,
  resetPasswordError: null,
  resetPasswordMessage: null,

  //contact Message
  contactLoading: false,
  contactError: null,
  contactMessage: null,
  //checking subscription expiry
  subsCriptionExpired: false
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logOutUser: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      storageService.removeItem("userData");
    },

    clearVerifyState: (state) => {
      state.verifyMessage = null;
    },

    //expireing subscription
    subsCriptionExpired: (state) => {
      state.subsCriptionExpired = true
    },

    //making false to subscription expire
    changingSubscriptionState: (state) => {
      state.subsCriptionExpired = false
    }
  },
  extraReducers: (builder) => {
    builder

      // login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { userId: action.payload.userId };
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // restore
      .addCase(restoreUser.fulfilled, (state, action) => {
        state.user = { userId: action.payload.userId };
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(restoreUser.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })

      //REGISTER USER 
      .addCase(registerUser.pending, (state) => {
        state.registerLoading = true;
        state.registerError = null;
        state.registerMessage = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.registerLoading = false;
        state.registerMessage = {
          status: action.payload.status,
          info: action.payload.info,
        };
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerLoading = false;
        state.registerError = action.payload;
      })

      .addCase(verifyEmail.pending, (state) => {
        state.verifyLoading = true;
        state.verifyError = null;
        state.verifyMessage = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.verifyLoading = false;
        state.verifyMessage = action.payload.message;
        state.user = { userId: action.payload.user.userId };
        state.token = action.payload.user.token;
        state.isAuthenticated = true;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.verifyLoading = false;
        state.verifyError = action.payload;
      })

      // RESEND OTP
      .addCase(resendOtp.pending, (state) => {
        state.resendLoading = true;
        state.resendError = null;
        state.resendMessage = null;
      })
      .addCase(resendOtp.fulfilled, (state, action) => {
        state.resendLoading = false;
        state.resendMessage = action.payload;
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.resendLoading = false;
        state.resendError = action.payload;
      })

       // FORGOT PASSWORD - SEND OTP
      .addCase(forgotPasswordOtp.pending, (state) => {
        state.forgotPasswordOtpLoading = true;
        state.forgotPasswordOtpError = null;
        state.forgotPasswordOtpMessage = null;
      })
      .addCase(forgotPasswordOtp.fulfilled, (state, action) => {
        state.forgotPasswordOtpLoading = false;
        state.forgotPasswordOtpMessage = action.payload;
      })
      .addCase(forgotPasswordOtp.rejected, (state, action) => {
        state.forgotPasswordOtpLoading = false;
        state.forgotPasswordOtpError = action.payload;
      })

      // FORGOT PASSWORD - VERIFY OTP
      .addCase(forgotPasswordOtpVerify.pending, (state) => {
        state.forgotPasswordOtpVerifyLoading = true;
        state.forgotPasswordOtpVerifyError = null;
        state.forgotPasswordOtpVerifyMessage = null;
      })
      .addCase(forgotPasswordOtpVerify.fulfilled, (state, action) => {
        state.forgotPasswordOtpVerifyLoading = false;
        state.forgotPasswordOtpVerifyMessage = "OTP verified successfully!";
        state.resetToken = action.payload?.resetToken || null;
      })
      .addCase(forgotPasswordOtpVerify.rejected, (state, action) => {
        state.forgotPasswordOtpVerifyLoading = false;
        state.forgotPasswordOtpVerifyError = action.payload;
      })

      // FORGOT PASSWORD - RESEND OTP
      .addCase(forgotPasswordOtpResend.pending, (state) => {
        state.forgotPasswordOtpResendLoading = true;
        state.forgotPasswordOtpResendError = null;
        state.forgotPasswordOtpResendMessage = null;
      })
      .addCase(forgotPasswordOtpResend.fulfilled, (state, action) => {
        state.forgotPasswordOtpResendLoading = false;
        state.forgotPasswordOtpResendMessage = action.payload;
      })
      .addCase(forgotPasswordOtpResend.rejected, (state, action) => {
        state.forgotPasswordOtpResendLoading = false;
        state.forgotPasswordOtpResendError = action.payload;
      })

      // RESET PASSWORD
      .addCase(resetPassword.pending, (state) => {
        state.resetPasswordLoading = true;
        state.resetPasswordMessage = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.resetPasswordLoading = false;
        state.resetPasswordMessage = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.resetPasswordLoading = false;
        state.resetPasswordError = action.payload;
      })

      //contact Message
      .addCase(contactForm.pending, (state) => {
        state.contactLoading = true;
        state.contactError = null;
        state.contactMessage = null;
      })
      .addCase(contactForm.fulfilled, (state, action) => {
        state.contactLoading = false;
        state.contactMessage = action.payload?.message || "Message sent Successfully";
      })
      .addCase(contactForm.rejected, (state, action) => {
        state.contactLoading = false;
        state.contactError = action.payload;
      });

  },
});

export const { logOutUser, clearVerifyState, changingSubscriptionState, subsCriptionExpired } = authSlice.actions;
export default authSlice.reducer;

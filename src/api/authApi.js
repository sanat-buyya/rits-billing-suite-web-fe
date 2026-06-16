import axiosInstance from "./axiosInstance";

const authApi = {};

authApi.loginApi = async (email, password) => {
  const response = await axiosInstance.post("/auth/login", { email, password });
  return response.data;
};

authApi.registerApi = async ({ email, password, phone, fullName }) =>{
  const response = await axiosInstance.post("/auth/register", {
    email,
    password,
    phone,
    fullName,
  });
  return response.data;
}

authApi.verifyEmailApi = async ({ email, otp }) => {
  const response = await axiosInstance.post("/auth/verify-email", {
    email,
    otp,
  });
  return response.data;
};


authApi.forgotPasswordOtpApi = async ({ email }) => {
  const response = await axiosInstance.post("/auth/forget-password-otp", {
    email,
  });
  return response.data;
};

authApi.forgotPasswordOtpVerifyApi = async ({ email, otp }) => {
  const response = await axiosInstance.post("/auth/forget-password-otp-verify", {
    email,
    otp,
  });
  return response.data;
};

authApi.resetPasswordApi = async ({ password, confirmPassword }) => {
  const response = await axiosInstance.post("/auth/reset-password", {
    password,
    confirmPassword,
  });
  return response.data;
};

authApi.resendOtpApi = async ({ email }) => {
  const response = await axiosInstance.post("/auth/resend-otp", { email });
  return response.data;
};

authApi.forgotPasswordOtpResendApi = async ({ email }) => {
  const response = await axiosInstance.post("/auth/forget-password-otp-resend", { email });
  return response.data;
};

authApi.contactApi = async ({ name, email, message}) => {
  const response = await axiosInstance.post("/auth/contact", {name, email, message});
  return response.data;
}


export default authApi;
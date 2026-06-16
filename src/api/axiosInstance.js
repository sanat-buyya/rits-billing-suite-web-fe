import axios from "axios";
import AppToast from "../services/toastService";
import { BASE_URL } from "../Constants/baseUrl";
import storageService from "../services/localStorage";

let storeRef;
let isSessionHandled = false;

export const injectStore = (_store) => {
  storeRef = _store;
};

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(
  (config) => {
    try {
      const state = storeRef?.getState();
      const token = state?.auth?.token;

      const resetToken = storageService.getItem("resetToken");

      if (resetToken && config.url.includes("/auth/reset-password")) {
        config.headers.Authorization = `Bearer ${resetToken}`;
      } else if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.log("Request interceptor error:", err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url;
    const status = error.response?.status;

    if (status === 401) {
      if (requestUrl?.includes("/auth/login")) {
        return Promise.reject(error);
      }
      if (!isSessionHandled) {
        isSessionHandled = true;
        AppToast.showError("Session expired. Please login again.");
        storeRef?.dispatch({ type: "auth/logOutUser" });

        // setting the flag after half second
        setTimeout(() => {
          isSessionHandled = false;
        }, 500);
      }
    }

    else if (status === 402) {
      // AppToast.showError("Your subscription has expired. Please renew to continue.");
      // alert("Your subscription has expired. Please renew to continue."); // optional UI alert
      storeRef?.dispatch({ type: "auth/subsCriptionExpired" });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { forgotPasswordOtp } from "../authThunk";
import AppToast from "../../../services/toastService";
import storageService from "../../../services/localStorage";
import Spinner from "../../../components/Spinner";

const SendEmailForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigation = useNavigate();
  const dispatch = useDispatch();
  const { forgotPasswordOtpLoading, forgotPasswordOtpError, forgotPasswordOtpMessage } = useSelector(
    (state) => state.auth
  );

const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!email.trim()) {
      setError("Email is required");
      return;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Invalid email format");
      return;
    }

    setError("");

    try {
      const res = await dispatch(forgotPasswordOtp({ email })).unwrap();
      console.log("res", res);
      AppToast.showSuccess(res || "OTP sent successfully! Check your email.");

      // Save for VerifyOtp screen
      await storageService.setItem("verifyData", { email, purpose: "forgetPassword" });

      // Navigate to OTP verification
        navigation("/verify-otp", { replace: true });


    } catch (error) {
      console.error("err", error);
      AppToast.showError(error || "Failed to send OTP");
    }
  };


  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-gradient-to-br from-slate-100 via-white to-slate-200 overflow-hidden">
      {/* Left Side (decorative) */}
      <div className="hidden xl:flex w-1/2 h-full bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 fixed top-0 left-0 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-[120px] h-[120px] rounded-full bg-gradient-to-br from-blue-500/10 to-slate-700/5 top-[10%] left-[15%] animate-bounce [animation-duration:5s]" />
          <div className="absolute w-[80px] h-[80px] rounded-full bg-gradient-to-br from-blue-500/10 to-slate-700/5 top-[70%] right-[20%] animate-bounce [animation-delay:1s]" />
          <div className="absolute w-[60px] h-[60px] rounded-full bg-gradient-to-br from-blue-500/10 to-slate-700/5 bottom-[20%] left-[25%] animate-bounce [animation-delay:2s]" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,rgba(30,41,59,0.03)_1px,transparent_0)] bg-[length:40px_40px]" />
        <div className="relative text-center animate-slideInLeft">
          <div className="relative w-52 h-52 bg-gradient-to-b from-slate-700 to-blue-600 rounded-3xl flex items-center justify-center text-white shadow-2xl mx-auto overflow-hidden">
            <div className="absolute inset-0 w-52 h-52 mx-auto rounded-3xl bg-gradient-to-bl from-blue-500 via-slate-800 to-blue-500 animate-[spin_3s_linear_infinite]" />
            <div className="relative">
              <div className="text-3xl font-bold">RITS BILLING</div>
              <div className="text-sm tracking-wider">SUITE</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex flex-col items-center justify-center h-full w-full xl:w-1/2 bg-white relative xl:ml-[50%] px-6 sm:px-8 lg:px-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800">Forgot Password? ✉️</h2>
            <p className="text-gray-500 mt-2 text-sm sm:text-base">
              Enter your email to receive a one-time password (OTP)
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="h-4 mt-1">
                {error && <p className="text-red-500 text-xs">{error}</p>}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={forgotPasswordOtpLoading}
              className={`w-full py-2.5 font-semibold text-white rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg flex items-center justify-center gap-2 ${
                forgotPasswordOtpLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-slate-700 to-blue-500 hover:from-slate-800 hover:to-blue-600"
              }`}
            >
              {forgotPasswordOtpLoading ? <Spinner size={20} color="#fff" /> : "Get OTP"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600 space-y-2">
            <button
              className="text-blue-600 hover:text-blue-800 font-medium"
              // onClick={() => navigation("/login")}
               onClick={() => navigation("/login", {replace: true})}
            >
              Back to Login
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-4 text-xs text-gray-400">
          © {new Date().getFullYear()} Revappayya IT Services Pvt. Ltd. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default SendEmailForgetPassword;

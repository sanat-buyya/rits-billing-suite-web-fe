import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyEmail, resendOtp,forgotPasswordOtpVerify, forgotPasswordOtpResend   } from "../authThunk"; 
import AppToast from "../../../services/toastService";
import storageService from "../../../services/localStorage";
import { IoIosMail } from "react-icons/io";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import Spinner from "../../../components/Spinner";

const VerifyOtp = () => {
  const navigation = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState(false);
  const [timer, setTimer] = useState(180); // 3 minutes = 180 seconds
  const inputRefs = useRef([]);
  const dispatch = useDispatch();
  const { 
    verifyLoading, verifyError, verifyMessage,
    resendLoading, resendError, resendMessage,
    forgotPasswordOtpVerifyLoading, forgotPasswordOtpVerifyError, forgotPasswordOtpVerifyMessage,
    forgotPasswordOtpResendLoading, forgotPasswordOtpResendError, forgotPasswordOtpResendMessage
  } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [purpose, setPurpose] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      const data = await storageService.getItem("verifyData");
      // console.log("📩 verifyData:", data);
      if (data) {
        setEmail(data.email);
        setPurpose(data.purpose);
      } else {
        navigation("/register");
      }
    };
    fetchData();
  }, []);


  // Countdown Timer
  useEffect(() => {
    if (timer === 0) return;
    const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(countdown);
  }, [timer]);

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/, ""); // allow only digits
    if (!value && index > 0) {
      // backspace on empty field moves to previous
      inputRefs.current[index - 1]?.focus();
    }

    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // move to next box if value entered
      if (value && index < 5) inputRefs.current[index + 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");

    if (!email) {
      AppToast.showError("Email not found. Please try again.");
      navigation("/register");
      return;
    }

    if (otpValue.length !== 6) {
      setError(true);
      AppToast.showError("Please enter complete 6-digit OTP");
      return;
    }

    try {
      if (purpose === "registration") {
        // ✅ Registration OTP verification
        const res = await dispatch(verifyEmail({ email, otp: otpValue })).unwrap();
        // console.log("res-================>", res);
        AppToast.showSuccess(res.message || "Email verified successfully!");
        await storageService.removeItem("verifyData");
        navigation("/dashboard", { replace: true });
      } 
      else if (purpose === "forgetPassword") {
        // ✅ Forgot password OTP verification
        const res = await dispatch(forgotPasswordOtpVerify({ email, otp: otpValue })).unwrap();
        console.log("forgot pass res-================>", res);
        // AppToast.showSuccess(res.message ||"OTP verified successfully!");
        AppToast.showSuccess("OTP verified successfully! Please reset your password.");
        await storageService.removeItem("verifyData");
        await storageService.setItem("resetToken", (res.resetToken));
        navigation("/reset-password", { replace: true });
      } 
      else {
        AppToast.showError("Invalid verification type");
      }
    } catch (error) {
      setError(true);
      AppToast.showError(error || "OTP verification failed");
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;

    try {
      if (purpose === "registration") {
        const res = await dispatch(resendOtp({ email })).unwrap();
        // console.log("registration res-================>", res);
        AppToast.showSuccess(res ||"OTP resent successfully! Please check your email.");
      } 
      else if (purpose === "forgetPassword") {
        const res = await dispatch(forgotPasswordOtpResend({ email })).unwrap();
        console.log("forgetPassword res-================>", res);
        AppToast.showSuccess(res || "Password reset OTP resent successfully!");
      } 
      else {
        AppToast.showError("Invalid resend type");
        return;
      }

      // Reset UI
      setOtp(["", "", "", "", "", ""]);
      setError(false);
      setTimer(180);
      inputRefs.current[0]?.focus();
    } catch (error) {
      AppToast.showError(error || "Failed to resend OTP");
    }
  };


  // useEffect(() => {
  //   if (resendMessage) AppToast.showSuccess(resendMessage);
  //   if (resendError) AppToast.showError(resendError);
  // }, [resendMessage, resendError]);

  const formatTime = () => {
    const minutes = Math.floor(timer / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (timer % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-gradient-to-br from-slate-100 via-white to-slate-200 overflow-hidden">
      {/* Left Side (unchanged) */}
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

      {/* Right Side (Updated Modern OTP UI) */}
      <div className="flex flex-col items-center justify-center h-full w-full xl:w-1/2 bg-white relative xl:ml-[50%] px-6 sm:px-8 lg:px-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <IoIosMail className="text-5xl mx-auto text-blue-600 mb-4" />
            <h2 className="text-3xl font-bold text-slate-800">Verify OTP</h2>
            <p className="text-gray-500 mt-2 text-sm sm:text-base">
              Enter the 6-digit code sent to your email address
            </p>
          </div>

          {/* OTP BOXES */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between gap-2 sm:gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e, index)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className={`w-12 h-12 sm:w-14 sm:h-14 text-center text-xl font-semibold rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
                    error
                      ? "border-red-500 ring-red-400 bg-red-50"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                />
              ))}
            </div>

            {/* Error Text */}
            <div className="h-4 mt-1">
              {(error || verifyError) && (
                <p className="text-red-500 text-sm text-center mt-1">
                  {verifyError || "Invalid OTP. Please try again."}
                </p>
              )}
            </div>
            
            {/* Timer */}
            <div className="text-center text-gray-600 text-sm mt-2">
              {timer > 0 ? (
                <p>
                  OTP will expire in{" "}
                  <span className="text-blue-600 font-semibold">
                    {formatTime()}
                  </span>
                </p>
              ) : (
                <p className="text-red-500 font-medium">OTP expired</p>
              )}
            </div>

            {/* Verify Button */}
         <button
            type="submit"
            disabled={timer === 0 || verifyLoading || forgotPasswordOtpVerifyLoading}
            className={`w-full py-2.5 font-semibold text-white rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg flex items-center justify-center gap-2 ${
              timer === 0 || verifyLoading || forgotPasswordOtpVerifyLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-slate-700 to-blue-500 hover:from-slate-800 hover:to-blue-600"
            }`}
              >
          {verifyLoading || forgotPasswordOtpVerifyLoading ? (
            <Spinner size={20} color="#fff" />
          ) : (
            "Verify OTP"
          )}
        </button>
          </form>

          {/* Resend + Back to Login */}
          <div className="mt-6 text-center text-sm text-gray-600 space-y-3">
            <button
              onClick={handleResend}
              disabled={
                timer > 0 || 
                resendLoading || 
                forgotPasswordOtpResendLoading
              }
              className={`font-medium ${
                timer > 0 || resendLoading || forgotPasswordOtpResendLoading
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-blue-600 hover:text-blue-800"
              }`}
            >
              {resendLoading || forgotPasswordOtpResendLoading
                ? "Resending..."
                : timer > 0
                  ? `Resend OTP in ${formatTime()}`
                  : "Resend OTP"}
            </button>

            <div>
              <button
                onClick={() => navigation("/login", { replace: true })}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                <FaArrowLeftLong className="inline-block mr-1" /> Back to Login
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-4 text-xs text-gray-400">
          © {new Date().getFullYear()} Revappayya IT Services Pvt. Ltd. All
          rights reserved.
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;

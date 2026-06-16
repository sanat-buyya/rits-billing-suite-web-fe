import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";
import { resetPassword } from "../authThunk";
import Spinner from "../../../components/Spinner";
import AppToast from "../../../services/toastService";
import { useDispatch, useSelector } from "react-redux";

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigation = useNavigate();
  const dispatch = useDispatch();
  const { resetPasswordLoading } = useSelector((state) => state.auth);

 const handleSubmit = async (e) => {
  e.preventDefault();

  const newErrors = {};

  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;


  if (!newPassword.trim()) {
    newErrors.newPassword = "New password is required";
  } else if (!passwordRegex.test(newPassword)) {
    newErrors.newPassword =
      "Password must be atleast 6 characters including uppercase, lowercase, number & special character";
  }

  if (!confirmPassword.trim()) {
    newErrors.confirmPassword = "Please confirm your new password";
  } else if (confirmPassword !== newPassword) {
    newErrors.confirmPassword = "Passwords do not match";
  }

  setErrors(newErrors);

  if (Object.keys(newErrors).length === 0) {
    try {
      const res = await dispatch(
        resetPassword({ password: newPassword, confirmPassword })
      ).unwrap();

      console.log("res", res);

      AppToast.showSuccess(res?.message || "Password reset successfully!");

      navigation("/login", { replace: true });

    } catch (err) {
      console.error("err", err);
      AppToast.showError(err.error || "Failed to reset password");
    }
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
            <h2 className="text-3xl font-bold text-slate-800">Reset Password 🔒</h2>
            <p className="text-gray-500 mt-2 text-sm sm:text-base">
              Enter your new password below
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="newPassword">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-10"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showNewPassword ? (
                    <HiOutlineEyeSlash className="w-5 h-5" />
                  ) : (
                    <HiOutlineEye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <div className="h-4 mt-1">
                {errors.newPassword && <p className="text-red-500 text-xs">{errors.newPassword}</p>}
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-10"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <HiOutlineEyeSlash className="w-5 h-5" />
                  ) : (
                    <HiOutlineEye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <div className="h-4 mt-1">
                {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
              </div>
              <p className="mt-1 text-xs text-gray-400">
                Must include uppercase, lowercase, number & symbol.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={resetPasswordLoading}
              className={`w-full py-2.5 font-semibold text-white rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg flex items-center justify-center gap-2 ${
                resetPasswordLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-slate-700 to-blue-500 hover:from-slate-800 hover:to-blue-600"
              }`}
            >
              {resetPasswordLoading ? <Spinner size={20} color="#fff" /> : "Reset Password"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600 space-y-2">
            <button
              className="text-blue-600 hover:text-blue-800 font-medium"
              onClick={() => navigation("/login", { replace: true })}
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

export default ResetPasswordPage;

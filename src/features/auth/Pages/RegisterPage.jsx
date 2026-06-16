import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "..//authThunk";
import AppToast from "../../../services/toastService";
import storageService from "../../../services/localStorage";
import Spinner from "../../../components/Spinner";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const { registerLoading, registerError, registerMessage } = useSelector(
    (state) => state.auth
  );


  // useEffect(() => {
  //   if (!registerMessage && !registerError) return; // prevent running on initial mount

  //   if (registerError) {
  //     AppToast.showError(registerError);
  //   }

  //   if (registerMessage?.info && email) {
  //     AppToast.showSuccess(registerMessage.info);
  //     storageService.setItem("verifyData", { email, purpose: "registration" });

  //     setTimeout(() => {
  //       navigation("/verify-otp");
  //     }, 1200);
  //   }
  // }, [registerMessage, registerError]);

  // const validateForm = async () => {
  //   const newErrors = {};

  //   if (!fullName.trim()) newErrors.fullName = "Full name is required";

  //   if (!email.trim()) newErrors.email = "Email is required";
  //   else if (!/\S+@\S+\.\S+/.test(email))
  //     newErrors.email = "Invalid email format";

  //   if (!mobileNumber.trim())
  //     newErrors.mobileNumber = "Mobile number is required";
  //   else if (!/^[0-9]{10}$/.test(mobileNumber))
  //     newErrors.mobileNumber = "Mobile number must be 10 digits";

  //   if (!password.trim()) newErrors.password = "Password is required";
  //   else if (password.length < 6)
  //     newErrors.password = "Password must be at least 6 characters";

  //   if (!confirmPassword.trim())
  //     newErrors.confirmPassword = "Please confirm your password";
  //   else if (password !== confirmPassword)
  //     newErrors.confirmPassword = "Passwords do not match";

  //   setErrors(newErrors);

  //   if (Object.keys(newErrors).length === 0) {
  //     console.log("✅ Registration form validated successfully");
  //     await dispatch(
  //       registerUser({
  //         email,
  //         password,
  //         phone: mobileNumber,
  //         fullName,
  //       })
  //   );
  //   }
  // };


  const validateForm = async () => {
    const newErrors = {};
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;

    if (!fullName.trim()) newErrors.fullName = "Full name is required";

    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Invalid email format";

    if (!mobileNumber.trim())
      newErrors.mobileNumber = "Mobile number is required";
    else if (!/^[0-9]{10}$/.test(mobileNumber))
      newErrors.mobileNumber = "Mobile number must be 10 digits";

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (!passwordRegex.test(password)) {
      newErrors.password =
        "Password must be atleast 6 characters including uppercase, lowercase, number & special character";
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("✅ Registration form validated successfully");

      try {
        const res = await dispatch(
          registerUser({
            email,
            password,
            phone: mobileNumber,
            fullName,
          })
        ).unwrap();

        console.log("res", res);
        AppToast.showSuccess(res?.info || "Registered successfully!");
        storageService.setItem("verifyData", { email, purpose: "registration" });
        navigate("/verify-otp", { replace: true });
      } catch (err) {
        console.error("err", err);
        AppToast.showError(err);
      }
    }
  };




  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-gradient-to-br from-slate-100 via-white to-slate-200 overflow-hidden">
      {/* Left Side */}
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

          <div className="flex justify-center gap-4 mt-6">
            <div className="w-12 h-12 bg-white shadow-md rounded-xl flex items-center justify-center text-xl animate-bounce">
              📊
            </div>
            <div className="w-12 h-12 bg-white shadow-md rounded-xl flex items-center justify-center text-xl animate-bounce delay-200">
              📄
            </div>
            <div className="w-12 h-12 bg-white shadow-md rounded-xl flex items-center justify-center text-xl animate-bounce delay-300">
              💰
            </div>
          </div>
        </div>
      </div>

      {/* Right Side (Scrollable) */}
      <div className="flex flex-col items-center justify-start min-h-screen w-full xl:w-1/2 bg-white relative xl:ml-[50%] px-6 sm:px-8 lg:px-12 overflow-y-auto py-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800">
              Create Account ✨
            </h2>
            <p className="text-gray-500 mt-2 text-sm sm:text-base">
              Join GST Billing Platform today
            </p>
          </div>

          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              className="flex-1 py-2 px-4 rounded-md text-gray-600 font-medium text-sm hover:text-gray-800 transition-colors duration-200"
              onClick={() => navigate("/login", { replace: true })}
            >
              Login
            </button>
            <button
              className="flex-1 py-2 px-4 rounded-md bg-gradient-to-r from-slate-700 to-blue-500 text-white font-medium text-sm shadow-sm transition-all duration-200"
              onClick={() => navigate("/register")}
            >
              Sign Up
            </button>
          </div>

          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              validateForm();
            }}
          >
            {/* Full Name */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="fullName"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="email"
              >
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
              <div className="h-3 mt-1">
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="mobileNumber"
              >
                Mobile Number
              </label>
              <input
                type="text"
                id="mobileNumber"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter 10-digit number"
                value={mobileNumber}
                // onChange={(e) => setMobileNumber(e.target.value)}
                onChange={(e) => {
                  let val = e.target.value.replace(/\D/g, "");
                  if (val.length > 10) val = val.slice(0, 10);
                  setMobileNumber(val);
                }}
              />
              <div className="h-3 mt-1">
                {errors.mobileNumber && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.mobileNumber}
                </p>
              )}
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-10"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <HiOutlineEyeSlash className="w-5 h-5" />
                  ) : (
                    <HiOutlineEye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <div className="h-3 mt-1">
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="confirmPassword"
              >
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
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <HiOutlineEyeSlash className="w-5 h-5" />
                  ) : (
                    <HiOutlineEye className="w-5 h-5" />
                  )}
                </button>
              </div>
               <div className="h-3 mt-1">
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={registerLoading}
              className={`w-full py-2.5 font-semibold text-white rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg ${
                registerLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-slate-700 to-blue-500 hover:from-slate-800 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              } flex justify-center items-center`}
            >
              {registerLoading ? <Spinner size={20} color="#fff" /> : "Create Account"}
            </button>

          </form>

          <div className="mt-6 text-center text-sm text-gray-600 space-y-2">
            <p>
              Already have an account?{" "}
              <button
                className="text-blue-600 hover:text-blue-800 font-medium"
                onClick={() => navigate("/login", { replace: true })}
              >
                Sign in
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 text-xs text-gray-400 text-center">
          © {new Date().getFullYear()} Revappayya IT Services Pvt. Ltd. All
          rights reserved.
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

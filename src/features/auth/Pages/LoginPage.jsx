import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../authThunk";
import AppToast from "../../../services/toastService";
import Spinner from "../../../components/Spinner";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // const validateForm = async () => {
  //   let newErrors = {};

  //   if (!email.trim()) {
  //     newErrors.email = "Email is required";
  //   } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  //     newErrors.email = "Invalid email format";
  //   }

  //   if (!password.trim()) {
  //     newErrors.password = "Password is required";
  //   }

  //   setErrors(newErrors);

  //   if (Object.keys(newErrors).length === 0) {
  //     try {
  //       await dispatch(loginUser({ email, password })).unwrap().then((res) => {
  //         console.log("res", res);
  //       }).catch((err) => {
  //         console.log("err", err);
  //       })

  //       // if (loginUser.fulfilled.match(result)) {
  //       //   AppToast.showSuccess("Logged in successfully!");
  //       //   navigate("/dashboard", { replace: true }); 
  //       // } else {
  //       //   AppToast.showError(result.payload.message || "Login failed!");
  //       // }
  //     } catch (error) {
  //       AppToast.showError("Something went wrong!");
  //     }
  //   }
  // };


  const validateForm = async () => {
    let newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const res = await dispatch(loginUser({ email, password })).unwrap();
        console.log("res", res);
        AppToast.showSuccess("Logged in successfully!");
        navigate("/dashboard", { replace: true });

      } catch (err) {
        AppToast.showError(err?.error || "Login failed!");
      }
    }
  };



  return (
    <div className="flex flex-col lg:flex-row h-screen w-full bg-gradient-to-br from-slate-100 via-white to-slate-200 overflow-hidden">
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
            <div className="w-12 h-12 bg-white shadow-md rounded-xl flex items-center justify-center text-xl animate-bounce">📊</div>
            <div className="w-12 h-12 bg-white shadow-md rounded-xl flex items-center justify-center text-xl animate-bounce delay-200">📄</div>
            <div className="w-12 h-12 bg-white shadow-md rounded-xl flex items-center justify-center text-xl animate-bounce delay-300">💰</div>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex flex-col items-center justify-center h-full w-full xl:w-1/2 bg-white relative xl:ml-[50%] px-6 sm:px-8 lg:px-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800">Welcome Back 👋</h2>
            <p className="text-gray-500 mt-2 text-sm sm:text-base">
              Sign in to your billing dashboard
            </p>
          </div>

          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              className="flex-1 py-2 px-4 rounded-md bg-gradient-to-r from-slate-700 to-blue-500 text-white font-medium text-sm shadow-sm transition-all duration-200"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="flex-1 py-2 px-4 rounded-md text-gray-600 font-medium text-sm hover:text-gray-800 transition-colors duration-200"
              onClick={() => navigate("/register", { replace: true })}
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
              {/* Fixed height to prevent layout shift */}
              <div className="h-4 mt-1">
                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email}</p>
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
              {/* Fixed height to prevent layout shift */}
              <div className="h-3 mt-1">
                {errors.password && (
                  <p className="text-red-500 text-xs">{errors.password}</p>
                )}
              </div>
              <p className="mt-1 text-xs text-gray-400">
                Must include uppercase, lowercase, number & symbol.
              </p>
            </div>

            {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2.5 font-semibold text-white rounded-lg bg-gradient-to-r from-slate-700 to-blue-500 hover:from-slate-800 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                } flex justify-center items-center`}
              >
                {loading ? (
                  <Spinner size={20} color="#fff" />
                ) : (
                  "Sign In"
                )}
              </button>

          </form>

          <div className="mt-6 text-center text-sm text-gray-600 space-y-2">
            <p>
              Don’t have an account?{" "}
              <button
                className="text-blue-600 hover:text-blue-800 font-medium"
                onClick={() => navigate("/register", { replace: true })}
              >
                Create one
              </button>
            </p>
            <button
              className="text-blue-600 hover:text-blue-800 font-medium"
              onClick={() => navigate("/send-email-forget-password", { replace: true})}
            >
              Forgot password?
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-4 text-xs text-gray-400">
          © {new Date().getFullYear()} Revappayya IT Services Pvt Ltd. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

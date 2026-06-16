import React from "react";
import { FaTimes } from "react-icons/fa";
import success from "../assets/celebration.gif";

const RegSuccessPopup = ({ onClose, onViewPlans }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-2xl shadow-lg w-[380px] sm:w-[420px] text-center p-6 relative animate-fadeIn">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <FaTimes size={18} />
        </button>

        {/* Illustration */}
        <div className="flex justify-center mb-4">
          <img
            src={success}
            alt="Registration Success"
            className="w-48 h-48 object-contain"
          />
        </div>

        {/* Heading */}
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Registration successful !
        </h2>

        {/* Message */}
        <p className="text-gray-500 text-sm mb-6">
          🎉 Your account has been successfully created! <br />
          Start exploring our features and enjoy a{" "}
          <span className="font-medium text-gray-700">5-day free trial</span>
        </p>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={onClose}
            className="w-full bg-blue-900 hover:bg-blue-600 text-white font-medium py-2 rounded-md transition"
          >
            Continue With free trial
          </button>
          <button
            onClick={onViewPlans}
            className="w-full border border-[#053680] text-[#053680] font-medium py-2 rounded-md hover:bg-blue-50 transition"
          >
            View Plans
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegSuccessPopup;

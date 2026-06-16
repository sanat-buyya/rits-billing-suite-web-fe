import React, { useState } from "react";
import trial from "../assets/trial.png";
import { useNavigate } from "react-router-dom";

const TrialExpiredPopup = ({ onClose }) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  const handleUpgrade = () => {
    setIsOpen(false);
    navigate("/subscription");
    if (onClose) onClose();
  };

  const handleClose = () => {
    setIsOpen(false);
    if (onClose) onClose(); // optional callback
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0A0F1C] bg-opacity-90 z-50">
      <div className="bg-white rounded-xl shadow-xl w-[400px] text-center p-8">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="rounded-md w-20 h-10 flex items-center justify-center">
            <img
              src={trial}
              alt="Subscription expired icon"
              className="w-17 h-15 object-contain"
            />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-900">
          Your subscription has expired.
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-600 mt-3">
          Your current subscription period has ended.
        </p>
        <p className="text-sm text-gray-600 mt-1">
          Please renew your subscription to continue using all premium features.
        </p>

        {/* Buttons */}
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={handleUpgrade}
            className="bg-[#053680] text-white rounded-md py-2 font-medium text-sm hover:bg-[#248ee5] transition"
          >
            Renew Now
          </button>
          <button
            onClick={handleClose}
            className="border border-[#053680] text-[#053680] rounded-md py-2 font-medium text-sm hover:bg-blue-50 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrialExpiredPopup;

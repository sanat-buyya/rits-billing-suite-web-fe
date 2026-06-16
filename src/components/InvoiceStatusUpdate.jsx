import React, { useState } from "react";
import {
  FaCreditCard,
  FaMoneyBillWave,
  FaMobileAlt,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

const InvoiceStatusUpdate = ({ onClose, onConfirm, invoiceData}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [amount, setAmount] = useState("");

// console.log("status update",invoiceData.amount.paidAmount);

const pendingAmount = invoiceData?.amount?.grandTotal - invoiceData?.amount?.paidAmount;

  const handleMethodSelect = (method) => setSelectedPaymentMethod(method);

  const handleMarkAsPaid = () => {
    if (!selectedPaymentMethod || !amount) return;

    // Step 1: Trigger success state
    setShowSuccess(true);

    // Step 2: Trigger callback (API update or parent state)
    onConfirm({
      // isPaid: true,
      selectedPaymentMethod,
      amount: parseFloat(amount),
    });

    // Step 3: Wait a bit before closing popup (so user sees tick)
    setTimeout(() => {
      onClose();
    }, 1000); // 1 second for visibility
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-2xl shadow-lg w-[360px] text-center p-6 relative transition-all duration-300">
        {/* Icon Section */}
        <div className="flex flex-col items-center mb-4 transition-all duration-300">
          <div
            className={`rounded-full w-16 h-16 flex items-center justify-center mb-3 shadow-md transition-all duration-300 ${
              showSuccess ? "bg-green-500" : "bg-yellow-400"
            }`}
          >
            {showSuccess ? (
              <FaCheckCircle className="text-white text-3xl transition-transform duration-500 scale-100 animate-pulse" />
            ) : (
              <FaExclamationCircle className="text-white text-3xl transition-transform duration-300 scale-100" />
            )}
          </div>

          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            {showSuccess ? "Status Updated" : "Confirm Update"}
          </h2>
          <p className="text-gray-500 text-sm mb-3">
            {showSuccess
              ? "This invoice has been marked as paid."
              : "Please select a payment method and confirm."}
          </p>
          <p>Pending Amount: ₹{pendingAmount.toFixed(2)}</p>

        </div>


        {/* Payment Methods */}
        {!showSuccess && (
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: "CARD", icon: <FaCreditCard /> },
              { label: "CASH", icon: <FaMoneyBillWave /> },
              { label: "UPI", icon: <FaMobileAlt /> },
            ].map((method) => (
              <button
                key={method.label}
                onClick={() => handleMethodSelect(method.label)}
                className={`flex flex-col items-center justify-center p-3 border rounded-lg transition-all duration-200 ${
                  selectedPaymentMethod === method.label
                    ? "border-green-500 bg-green-50 text-green-600"
                    : "border-gray-300 text-gray-600 hover:border-green-400 hover:text-green-500 hover:bg-green-50"
                }`}
              >
                <div className="text-2xl mb-1">{method.icon}</div>
                <span className="text-sm font-medium">{method.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Amount Input */}
        {selectedPaymentMethod && !showSuccess && (
          <div className="mb-6">
            <label className="block text-left mb-1 text-gray-700 font-medium">
              Enter Amount
            </label>
            <input
              type="number"
              value={amount}
              max={pendingAmount}
              // onChange={(e) => setAmount(e.target.value)}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val > pendingAmount) {
                  setAmount(pendingAmount);
                } else {
                  setAmount(val);
                }
              }}
              onInput={(e) => {
                if (e.target.value.length > 1 && e.target.value.startsWith('0')) {
                  e.target.value = e.target.value.replace(/^0+/, '');
                }
              }}
              placeholder={`Enter amount (max ₹${pendingAmount})`}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none
              [&::-webkit-outer-spin-button]:appearance-none 
                    [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        )}

        {/* Buttons */}
        {!showSuccess ? (
          <>
            <button
              onClick={handleMarkAsPaid}
              disabled={!selectedPaymentMethod || !amount}
              className={`w-full py-2.5 text-white font-medium rounded-md transition-colors ${
                selectedPaymentMethod && amount
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-green-300 cursor-not-allowed"
              }`}
            >
              Mark as Paid
            </button>

            <button
              onClick={onClose}
              className="w-full py-2 mt-3 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </>
        ) : (
          // Small subtle closing message area
          <div className="mt-4 text-gray-500 text-sm italic">
            Closing in a moment...
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceStatusUpdate;

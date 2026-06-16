import React from "react";
import AppToast from "../../../services/toastService";

const ToastTest = () => {
  return (
    <div className="flex flex-col items-start space-y-2 p-4">
      <button
        className="bg-green-500 text-white px-4 py-2 rounded"
        onClick={() =>
          AppToast.showSuccess("Success! Data saved correctly.", "top-center")
        }
      >
        Show Success Toast (Top Center)
      </button>

      <button
        className="bg-red-500 text-white px-4 py-2 rounded"
        onClick={() =>
          AppToast.showError("Error! Something went wrong.", "bottom-right")
        }
      >
        Show Error Toast (Bottom Right)
      </button>

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() =>
          AppToast.showInfo("Info! This is some information.", "bottom-center")
        }
      >
        Show Info Toast (Bottom Center)
      </button>
    </div>
  );
};

export default ToastTest;

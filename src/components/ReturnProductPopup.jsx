import React, { useState, useEffect } from "react";
import { FaXmark } from "react-icons/fa6";
import Spinner from "./Spinner";

const ReturnProductPopup = ({
  onClose,
  invoiceData,
  onSubmit,
  invoiceReturnPopup,
}) => {
  const [returnItems, setReturnItems] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (invoiceData?.products) {
      const discountPercent = (invoiceData.amount?.grandDiscount || 0) / 100;

      const arr = invoiceData.products.map((p) => {
        const originalUnit = p.total / p.quantity;
        const discountedUnit = originalUnit * (1 - discountPercent);

        return {
          productId: p.productId,
          productName: p.productName,
          originalUnitPrice: originalUnit,
          discountedUnitPrice: discountedUnit,
          productPrice: discountedUnit * p.quantity,
          maxQty: p.quantity,
          returnQty: 0,
        };
      });

      setReturnItems(arr);
    }
  }, [invoiceData]);

  const increaseQty = (index) => {
    setReturnItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, returnQty: Math.min(item.returnQty + 1, item.maxQty) }
          : item
      )
    );
  };

  const decreaseQty = (index) => {
    setReturnItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, returnQty: Math.max(item.returnQty - 1, 0) }
          : item
      )
    );
  };

  const discountAmount =
    ((invoiceData?.amount?.subTotal || 0) + (invoiceData?.amount?.gst || 0)) *
    ((invoiceData?.amount?.grandDiscount || 0) / 100);

  const subTotal =
    (invoiceData?.amount?.subTotal || 0) -
    discountAmount +
    (invoiceData?.amount?.gst || 0) -
    (invoiceData?.amount?.paidAmount || 0);

  const handleSubmit = () => {
    const selected = returnItems
      .filter((item) => item.returnQty > 0)
      .map((item) => ({
        productId: item.productId,
        quantity: item.returnQty,
      }));

    if (selected.length === 0) {
      alert("Please select at least one product to return");
      return;
    }

    setShowSuccess(true);

    onSubmit(selected);
  };

  // Total return amount calculation using discounted unit price
  const totalReturnAmount = returnItems.reduce((sum, item) => {
    if (item.returnQty > 0) {
      const originalUnit = item.productPrice / item.maxQty;

      return sum + originalUnit * item.returnQty;
    }
    return sum;
  }, 0);

  // Updated pending amount
  const updatedPendingAmount = subTotal - totalReturnAmount;

  console.log("invoiceData:", invoiceData);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-5 relative animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-600 hover:text-black transition"
        >
          <FaXmark size={18} />
        </button>

        <h2 className="text-xl font-semibold mb-3">Return Products</h2>

        {/* Invoice Info */}
        <div className="bg-gray-50 p-3 rounded-lg border mb-4">
          <p className="text-sm font-medium">
            Invoice: {invoiceData?.invoiceNo}
          </p>
          <p className="text-sm">
            Customer: {invoiceData?.customerName || "No Name"}
          </p>
        </div>

        {showSuccess || returnItems.length === 0 ? (
          <div className="space-y-3 h-60 overflow-y-auto pr-2 flex justify-center items-center">
            {showSuccess ? (
              <div className="flex flex-col items-center gap-3">
                <Spinner size={25} color="#1F2937" />
              <h2 className="text-center text-gray-800 font-semibold">
                Updating return product...
              </h2>
              </div>
            ) : (
              <h2 className="text-center text-red-600 font-semibold">
                No product is available to return
              </h2>
            )}
          </div>
        ) : null}

        {/* Product List */}
        {!showSuccess && returnItems.length > 0 && (
          <div className="space-y-3 h-60 overflow-y-auto pr-2">
            {returnItems.map((item, index) => (
              <div
                key={item.productId}
                className="border rounded-lg p-3 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-xs text-gray-500">
                    Purchased Qty: {item.maxQty}
                  </p>
                  <p className="text-xs text-gray-500">
                    Product Price:
                    {invoiceData?.amount?.grandDiscount > 0 ? (
                      <>
                        <span className="line-through text-red-500 ml-1">
                          {item.originalUnitPrice.toFixed(2)}
                        </span>

                        <span className="font-medium text-green-700 ml-2">
                          {item.discountedUnitPrice.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="font-medium text-green-700 ml-2">
                        {item.originalUnitPrice.toFixed(2)}
                      </span>
                    )}
                  </p>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => decreaseQty(index)}
                    disabled={item.returnQty === 0}
                    className={`px-2 py-1 rounded 
                    ${
                      item.returnQty === 0
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    -
                  </button>

                  <input
                    type="number"
                    min="0"
                    max={item.maxQty}
                    value={item.returnQty}
                    onInput={(e) => {
                      if (
                        e.target.value.length > 1 &&
                        e.target.value.startsWith("0")
                      ) {
                        e.target.value = e.target.value.replace(/^0+/, "");
                      }
                    }}
                    onChange={(e) => {
                      let val = Number(e.target.value);

                      if (val < 0) val = 0;
                      if (val > item.maxQty) val = item.maxQty;

                      setReturnItems((prev) =>
                        prev.map((i, idx) =>
                          idx === index ? { ...i, returnQty: val } : i
                        )
                      );
                    }}
                    className="w-14 border rounded px-2 py-1 text-center 
                  [&::-webkit-outer-spin-button]:appearance-none 
                  [&::-webkit-inner-spin-button]:appearance-none"
                  />

                  <button
                    onClick={() => increaseQty(index)}
                    disabled={item.returnQty === item.maxQty}
                    className={`px-2 py-1 rounded 
                    ${
                      item.returnQty === item.maxQty
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >
                    +
                  </button>
                </div>
              </div>
            ))
          }
        </div>
        )}

        {/* Buttons */}
        <div className="flex justify-between gap-2 mt-3">
          {invoiceReturnPopup ? (
            <div>
              {/* Current Pending Amount - return amount */}
              <p className="text-xs font-semibold text-red-600">
                {subTotal.toFixed(2)} - {totalReturnAmount.toFixed(2)}
              </p>

              {/* New Pending After Return */}
              {updatedPendingAmount >= 0 ? (
                <p className="text-lg font-bold text-green-700">
                  {updatedPendingAmount.toFixed(2)}
                </p>
              ) : (
                <p className="text-sm ">
                  Vendor has to give{" "}
                  <span className="text-red-600 font-bold">
                    ₹{Math.abs(updatedPendingAmount).toFixed(2)}
                  </span>{" "}
                  to the customer
                </p>
              )}
            </div>
          ) : (
            <div className="text-start content-center">
              <p className="text-sm">
                Vendor has to give{" "}
                <span className="text-red-600 font-bold">
                  ₹{Math.abs(totalReturnAmount).toFixed(2)}
                </span>{" "}
                to the customer
              </p>
            </div>
          )}

          <div className="flex justify-between gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-[#0a1628] text-white rounded-lg hover:bg-gray-700"
            >
              Submit Return
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnProductPopup;

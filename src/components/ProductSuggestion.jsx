import React from "react";
import { FaChevronRight } from "react-icons/fa";

const ProductSuggestion = ({
  showSuggestions,
  productSuggestions = [],
  onProductSelect,
  renderSuggestionItem,
  maxHeight = 200,
}) => {
  if (!showSuggestions || productSuggestions?.length === 0) return null;

  const defaultRenderItem = (item, index) => (
    <div
      key={item._id || index}
      onMouseDown={(e) => {
        e.preventDefault();
        onProductSelect(item);
      }}
      className="flex items-center justify-between px-4 py-3 cursor-pointer border-b border-gray-200 hover:bg-gray-50 transition-all"
    >
      <div className="flex-1">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <span className="text-sm font-semibold text-gray-800 block">{item.productName}</span>
            {/* <span className="text-xs text-gray-500 block mt-1">{item.description}</span> */}
            <span className="text-xs text-gray-600">Product ID: {item.productId}</span>
            <div className="flex items-center gap-4 mt-1">
              {/* <span className="text-xs text-gray-600">Product ID: {item.productId}</span> */}
              <span className="text-xs text-gray-500 block">Description: {item.description}</span>
              {/* <span className="text-xs text-gray-600">HSN: {item.hsnOrSac || "N/A"}</span> */}
            </div>
          </div>
          <div className="text-right ml-2 flex items-center">
            <span className="text-sm font-bold text-green-600 block">₹{item.price}</span>
            {/* <span className="text-xs text-gray-500">GST: {item.gst}%</span> */}
          </div>
        </div>
      </div>
      <FaChevronRight className="text-gray-400 text-xs ml-2" />
    </div>
  );

  const renderItem = renderSuggestionItem || defaultRenderItem;

  return (
    <div
      className={`absolute w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1 overflow-y-auto`}
      style={{ maxHeight: `${maxHeight}px` }}
    >
      {productSuggestions?.map((item, index) => renderItem(item, index))}
    </div>
  );
};

export default ProductSuggestion;
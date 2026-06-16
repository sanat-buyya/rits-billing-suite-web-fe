import React from "react";
import { FaChevronRight } from "react-icons/fa";

const CustomerSuggestion = ({
  showSuggestions,
  customerSuggestions = [],
  onCustomerSelect,
  renderSuggestionItem,
  maxHeight = 150,
}) => {
  if (!showSuggestions || customerSuggestions?.length === 0) return null;

  const defaultRenderItem = (item, index) => (
    <div
      key={item._id || index}
      // onClick={() => onCustomerSelect(item)}
      onMouseDown={(e) => {
      e.preventDefault();
      onCustomerSelect(item);
    }}
      className="flex items-center justify-between px-4 py-2 cursor-pointer border-b border-gray-200 hover:bg-gray-50 transition-all"
    >
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-blue-700">{item.fullName}</span>
        <span className="text-xs text-gray-500">{item.phone}</span>
      </div>
      <FaChevronRight className="text-gray-400 text-xs" />
    </div>
  );

  
  const renderItem = renderSuggestionItem || defaultRenderItem;

  return (
    <div
      className={`absolute w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 mt-1 overflow-y-auto`}
      style={{ maxHeight: `${maxHeight}px` }}
    >
      {customerSuggestions?.map((item, index) => renderItem(item, index))}
    </div>
  );
};

export default CustomerSuggestion;

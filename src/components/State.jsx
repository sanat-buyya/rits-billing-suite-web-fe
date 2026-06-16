import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaSearch } from "react-icons/fa";
 
const State = ({
  value,
  onChange,
  name = "state",
  className = "",
  disabled = false,
  title = "",
  error = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);
 
  const indianStatesAndUTs = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi (National Capital Territory)",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry",
  ];
 
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
 
  // Handle selection
  const handleSelect = (state) => {
    onChange({ target: { name, value: state } });
    setIsOpen(false);
    setSearch(""); // reset search when selected
  };
 
  // Filtered list based on search
  const filteredStates = indianStatesAndUTs.filter((state) =>
    state.toLowerCase().includes(search.toLowerCase())
  );
 
  return (
    <div ref={dropdownRef} className="relative w-full" title={title}>
      {/* Button (acts as select box) */}
      <button
        type="button"
        name={name}
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={`w-full flex justify-between items-center px-3 py-2 border rounded-lg text-sm shadow-sm transition
          ${
           disabled
              ? "bg-gray-100 text-gray-400  border-gray-200"
              : error
              ? "border-red-500 focus:ring-2 focus:ring-red-400"
              : "bg-white border-gray-300 hover:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none"
            }
          ${className}
        `}
      >
        <span className={`${!value ? "text-gray-400" : "text-gray-800"}`}>
          {value || "--Select--"}
        </span>
        <FaChevronDown
          className={`text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }${error ? "text-red-500" : "text-gray-500"}`}
        />
      </button>
 
      {/* Dropdown */}
      {!disabled && isOpen && (
        <div className="absolute left-0 right-0 mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-hidden">
          {/* 🔍 Search Bar */}
          <div className="p-2 border-b border-gray-200 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search state or UT..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-300 focus:border-blue-400 outline-none"
            />
          </div>
 
          {/* Scrollable List */}
          <div className="max-h-48 overflow-y-auto">
            {filteredStates.length > 0 ? (
              filteredStates.map((state) => (
                <div
                  key={state}
                  onClick={() => handleSelect(state)}
                  className={`px-3 py-2 cursor-pointer text-sm hover:bg-blue-50 ${
                    state === value
                      ? "bg-blue-100 font-medium"
                      : "text-gray-700"
                  }`}
                >
                  {state}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 text-sm py-3">
                No results found
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
 
export default State;
 
 
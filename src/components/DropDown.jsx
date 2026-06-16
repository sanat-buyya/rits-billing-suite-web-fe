import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
 
const Dropdown = ({
  options = [],
  value = "",
  onChange,
  name = "dropdown",
  placeholder = "--Select--",
  className = "",
  disabled = false,
  title = "", //
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openDirection, setOpenDirection] = useState("down");
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);
 
  const handleToggle = () => {
    if (disabled) return;
    if (!isOpen) checkDropdownPosition();
    setIsOpen((prev) => !prev);
  };
 
  const checkDropdownPosition = () => {
    if (!dropdownRef.current) return;
    const rect = dropdownRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    setOpenDirection(spaceBelow < 180 && spaceAbove > spaceBelow ? "up" : "down");
  };
 
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
 
  const handleSelect = (option) => {
    if (disabled) return;
    onChange?.(option);
    setIsOpen(false);
  };
 
  return (
    <div ref={dropdownRef} className="relative w-full">
      {/* Select button */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        title={disabled && title ? title : ""}
        className={`w-full flex justify-between items-center px-3 py-2 border rounded-lg text-sm shadow-sm outline-none transition
          ${disabled
            ? "bg-gray-100 text-gray-400 border-gray-200 "
            : "bg-white border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400"}
          ${className}`}
      >
        <span className={!value ? "text-gray-400" : "text-gray-800"}>
          {value || placeholder}
        </span>
        <FaChevronDown
          className={`text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          } ${disabled ? "opacity-50" : ""}`}
        />
      </button>
 
      {!disabled && isOpen && (
        <div
          ref={menuRef}
          className={`absolute left-0 right-0 z-50 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden max-h-60 overflow-y-auto transition-all
            ${openDirection === "up" ? "bottom-full mb-1" : "top-full mt-1"}`}
        >
          {options.map((option) => (
            <div
              key={option}
              onClick={() => handleSelect(option)}
              className={`px-3 py-2 cursor-pointer text-sm hover:bg-blue-50
                ${option === value ? "bg-blue-100 font-medium" : "text-gray-700"}`}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
 
export default Dropdown;
 
 
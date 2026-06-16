import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logOutUser } from "../features/auth/authSlice";

import {
  FaRegFileAlt,
  FaRegClock,
  FaCube,
  FaUsers,
  FaCreditCard,
  FaCog,
  FaChevronLeft,
  FaChevronRight,
  FaFileInvoice,
  FaThLarge,
  FaSignOutAlt,
  FaTimes,
  FaBolt
} from "react-icons/fa";
import { MdOutlineManageHistory } from "react-icons/md";
 
const SideBar = ({ mobileOpen, setMobileOpen }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
 
  const handleLogout = async () => {
    await dispatch(logOutUser());
    navigate("/");
  };

  const getCurrentYear = () => new Date().getFullYear();

 
  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: FaThLarge },
    { name: "Quick Invoice", path: "/instant-invoice", icon: FaBolt },
    { name: "Create Invoice", path: "/create-invoice", icon: FaFileInvoice },
    { name: "Quotation", path: "/quotation", icon: FaRegFileAlt },
    { name: "Invoice History", path: "/invoice-history", icon: FaRegClock },
    { name: "Quotation History", path: "/quotation-history", icon: MdOutlineManageHistory },
    { name: "Products", path: "/products", icon: FaCube },
    { name: "Customers", path: "/customers", icon: FaUsers },
    { name: "Subscription", path: "/subscription", icon: FaCreditCard },
    { name: "Settings", path: "/settings", icon: FaCog },
  ];
 
  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-[#0a1628] text-white z-40 flex flex-col border-r border-gray-800 transition-all duration-300 ease-in-out
        ${collapsed ? "w-20" : "w-64"}
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:relative`}
    >
      {/* Top Section */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-gray-700 h-[65px]">
        <div
          className={`flex flex-col items-start overflow-hidden transition-all duration-300 ${
            collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
          }`}
        >
          <h1 className="text-xl font-bold tracking-wide whitespace-nowrap">
            RITS
          </h1>
          <p className="text-xs text-gray-400 whitespace-nowrap">
            Smart Billing, Smarter Business
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition flex-shrink-0 md:block hidden`}
          >
            {collapsed ? (
              <FaChevronRight className="h-3 w-3 text-gray-300" />
            ) : (
              <FaChevronLeft className="h-3 w-3 text-gray-300" />
            )}
          </button>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition md:hidden block"
          >
            <FaTimes className="h-3 w-3 text-gray-300" />
          </button>
        </div>
      </div>
 
      {/* Navigation Items */}
      <nav className="flex-1 mt-4 space-y-1 overflow-y-auto scrollbar-none">
        {navItems.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 mx-3 rounded-xl text-gray-300 hover:bg-[#162036] hover:text-white transition-all duration-200 ${
                isActive ? "bg-[#1f2b46] text-white font-medium" : ""
              }`
            }
            onClick={() => setMobileOpen(false)}
          >
            <Icon className="h-4 w-4 flex-shrink-0 text-gray-300" />
            <span
              className={`text-sm tracking-wide whitespace-nowrap overflow-hidden transition-all duration-300 ${
                collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
              }`}
            >
              {name}
            </span>
          </NavLink>
        ))}
      </nav>
 
      {/* Logout Button */}
      {/* <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 mx-3 mb-2 rounded-xl text-gray-300 hover:bg-red-600 hover:text-white transition-all duration-200"
      >
        <FaSignOutAlt className="h-4 w-4 flex-shrink-0" />
        <span
          className={`text-sm tracking-wide whitespace-nowrap overflow-hidden transition-all duration-300 ${
            collapsed ? "opacity-0 w-0" : "opacity-100 w-auto"
          }`}
        >
          Logout
        </span>
      </button> */}
 
      {/* Footer */}
      <div className="border-t border-gray-700 p-4">
        <p
          className={`text-xs text-gray-500 text-center whitespace-nowrap overflow-hidden transition-all duration-300 ${
            collapsed ? "opacity-0" : "opacity-100"
          }`}
        >
          © {getCurrentYear()} RITS Billing Suite
        </p>
      </div>
    </aside>
  );
};
 
export default SideBar;
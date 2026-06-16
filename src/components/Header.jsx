import React, {useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserInfo } from "../features/profile/profileThunk";
import { FiChevronDown, FiUser, FiLogOut } from "react-icons/fi";
import { HiOutlineMenu } from "react-icons/hi"; 
import storageService from "../services/localStorage";
import { logOutUser } from "../features/auth/authSlice";

const Header = ({ onMobileMenuClick }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { profileUser } = useSelector((state) => state.profile) || {};
  useEffect(() => {
    if (!profileUser) dispatch(getUserInfo());
  }, [dispatch, profileUser]);

  const user = profileUser || {};

  const profileImg =
    user.businessLogo && user.businessLogo.trim() !== ""
      ? user.businessLogo
      : "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  const userName = user.fullName || "User Name";
  const shopName = user.shopName || "Shop Name";

  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef(null);

  const titles = {
    "/dashboard": "Dashboard",
    "/instant-invoice": "Quick Invoice",
    "/create-invoice": "Create Invoice",
    "/quotation": "Quotation",
    "/invoice-history": "Invoice History",
    "/quotation-history": "Quotation History",
    "/products": "Products",
    "/customers": "Customers",
    "/subscription": "Subscription",
    "/settings": "Settings",
  };

  const currentTitle = titles[location.pathname] || "RITS Billing Suite";

  // Logout handler
  const handleLogout = async () => {
    dispatch(logOutUser());
    navigate("/login", { replace: true });
  };

  // Close dropdown when clicked outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 w-full flex items-center justify-between px-4 sm:px-8 h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-[0_1px_6px_rgba(0,0,0,0.05)]">
      {/* ===== Left Section (Hamburger + Title) ===== */}
      <div className="flex items-center gap-4">
        {/* Mobile Hamburger */}
        <button className="md:hidden p-1" onClick={onMobileMenuClick}>
          <HiOutlineMenu className="w-6 h-6 text-gray-800" />
        </button>

        <div className="flex flex-col">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
            {currentTitle}
          </h1>
        </div>
      </div>

      {/* ===== Right Section (Profile + Dropdown) ===== */}
      <div
        className="relative flex items-center gap-3 sm:gap-5"
        ref={dropdownRef}
      >
        {/* Divider */}
        {/* <div className="hidden sm:block w-px h-6 bg-gray-200"></div> */}

        {/* Profile Section */}
        <div
          className="flex items-center gap-2 cursor-pointer group select-none"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <div className="w-9 h-9 rounded-full overflow-hidden border border-gray-200 shadow-sm group-hover:shadow-md transition-all">
            <img
              src={profileImg}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="text-sm font-medium text-gray-800">{userName}</span>
            <span className="text-xs text-gray-500">Shop Vendor</span>
          </div>
          <FiChevronDown
            className={`w-4 h-4 text-gray-500 hidden sm:block transition-transform duration-200 ${
              dropdownOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </div>

        {/* ===== Dropdown Menu ===== */}
        {dropdownOpen && (
          <div className="absolute right-0 top-14 w-40 bg-white shadow-lg border border-gray-100 rounded-xl py-2 text-gray-700 z-50 animate-fadeIn">
            <button
              onClick={() => {
                setDropdownOpen(false);
                navigate("/profile");
              }}
              className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-50 transition"
            >
              <FiUser className="w-4 h-4 mr-2 text-gray-600" />
              Profile
            </button>

            <div className="my-1 border-t border-gray-100"></div>

            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
            >
              <FiLogOut className="w-4 h-4 mr-2 text-red-500" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

import React, { useEffect } from "react";
import {
  FaUser,
  FaFileInvoice,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getUserInfo } from "../profileThunk";
import ProfileSkeleton from "./ProfileSkeleton"

// 🔹 Reusable field component
const ProfileField = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200">
    <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
      <Icon className="w-4 h-4 text-gray-600" />
    </div>
    <div className="flex-1 min-w-0">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
        {label}
      </label>
      <div className="text-gray-800 text-sm font-medium break-words">
        {value || "N/A"}
      </div>
    </div>
  </div>
);

const Profile = () => {
  const dispatch = useDispatch();
  const { profileUser, profileLoading, profileError } = useSelector(
    (state) => state.profile
  );

  useEffect(() => {
    dispatch(getUserInfo());
  }, [dispatch]);

  // ✅ Handle loading state
  if (profileLoading) {
    return (
      <div className="flex flex-col h-full bg-gray-50 p-4 overflow-hidden">
        <ProfileSkeleton/>
      </div>
    );
  }

  // ✅ Handle error state
  if (profileError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-red-600 text-center px-6">
        {typeof profileError === "string"
          ? profileError
          : profileError?.message || "Failed to load profile."}
      </div>
    );
  }

  // ✅ Ensure we always have a safe object to access
  const user = profileUser || {};

  // ✅ Handle logo / profile picture fallback
  const logoSrc =
  user.businessLogo && user.businessLogo.trim() !== ""
    ? user.businessLogo
    : "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  return (
    <div className="flex flex-col h-full bg-gray-50 p-4 overflow-hidden">
      {/* 🔹 Profile Header Section */}
      <div className="flex-shrink-0 bg-white rounded-lg shadow-sm p-6 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Shop Logo */}
            <div className="flex-shrink-0">
              <img
                className="h-20 w-20 rounded-full object-cover border-2 border-gray-200 shadow-sm"
                src={logoSrc}
                alt={`${user.shopName || "Shop"} logo`}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                }}
              />
            </div>

            {/* Shop Name & Username */}
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold text-gray-800">
                {user.shopName || "Shop Name"}
              </h1>
            </div>
          </div>

        </div>
      </div>

      {/* 🔹 Details Section */}
      <div className="flex-1 bg-white rounded-lg shadow-sm overflow-y-auto min-h-0">
        <div className="p-6">
          {/* Business Information */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">
              Business Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ProfileField
                icon={FaUser}
                label="Account User Name"
                value={user.fullName}
              />
              <ProfileField
                icon={FaFileInvoice}
                label="GST Number"
                value={user.gst}
              />
              <ProfileField
                icon={FaEnvelope}
                label="Email Address"
                value={user.email}
              />
              <ProfileField
                icon={FaPhone}
                label="Phone Number"
                value={user.phone}
              />
            </div>
          </div>

          {/* Address Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">
              Address Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ProfileField
                icon={FaMapMarkerAlt}
                label="Street Address"
                value={user.address}
              />
              <ProfileField
                icon={FaMapMarkerAlt}
                label="State"
                value={user.state}
              />
            </div>
          </div>
        </div>
      </div>
      <footer>
        <div className="w-3/4  mb-4 mx-auto"></div>
        <p className="text-sm text-gray-600 text-center pb-3">
          © {new Date().getFullYear()} Revappayya IT Services Pvt Ltd. All rights reserved.
        </p>
      </footer>
      
    </div>
  );
};

export default Profile;

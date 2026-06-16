import React from "react";
import {
  FaUser,
  FaFileInvoice,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";

// 🔹 Skeleton field component
const SkeletonField = ({ icon: Icon, label }) => (
  <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200">
    <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gray-200 animate-pulse"></div>
    <div className="flex-1 min-w-0">
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
        {label}
      </label>
      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
    </div>
  </div>
);

const ProfileSkeleton = () => {
  return (
    <div className="flex flex-col h-full bg-gray-50 p-4 overflow-hidden">
      {/* 🔹 Profile Header Skeleton */}
      <div className="flex-shrink-0 bg-white rounded-lg shadow-sm p-6 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Shop Logo Skeleton */}
            <div className="flex-shrink-0">
              <div className="h-20 w-20 rounded-full bg-gray-200 animate-pulse border-2 border-gray-200 shadow-sm"></div>
            </div>

            {/* Shop Name & Username Skeleton */}
            <div className="flex flex-col">
              <div className="h-7 bg-gray-200 rounded animate-pulse w-48 mb-2"></div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 Details Section Skeleton */}
      <div className="flex-1 bg-white rounded-lg shadow-sm overflow-y-auto min-h-0">
        <div className="p-6">
          {/* Business Information Skeleton */}
          <div className="mb-8">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-48 mb-4 pb-2"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SkeletonField icon={FaUser} label="Account User Name" />
              <SkeletonField icon={FaFileInvoice} label="GST Number" />
              <SkeletonField icon={FaEnvelope} label="Email Address" />
              <SkeletonField icon={FaPhone} label="Phone Number" />
            </div>
          </div>

          {/* Address Information Skeleton */}
          <div>
            <div className="h-6 bg-gray-200 rounded animate-pulse w-48 mb-4 pb-2"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SkeletonField icon={FaMapMarkerAlt} label="Street Address" />
              <SkeletonField icon={FaMapMarkerAlt} label="State" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
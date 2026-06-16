import React from "react";

// Skeleton Components
export const AccountOverviewSkeleton = () => (
  <div className="border border-gray-100 shadow-md rounded-2xl p-6 bg-gray-50 animate-pulse">
    <div className="flex flex-col lg:flex-row justify-between gap-6">
      {/* Left */}
      <div className="flex-1">
        <div className="h-6 bg-gray-200 rounded-full w-32 mb-2"></div>
        <div className="h-7 bg-gray-200 rounded w-40 mb-2"></div>
        <div className="h-5 bg-gray-200 rounded w-48 mb-4"></div>
        
        <div className="w-[40%] bg-gray-200 rounded-full h-3 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-32"></div>
      </div>

      {/* Right */}
      <div className="flex items-center justify-center">
        <div className="h-11 bg-gray-200 rounded-lg w-32 "></div>
      </div>
    </div>
  </div>
);

export const PricingCardSkeleton = () => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 relative animate-pulse">
    
    <div className="absolute -top-3 right-3">
      <div className="w-14 h-6 rounded-full bg-gray-200" />
    </div>
    
    <div className="h-7 bg-gray-200 rounded w-32 mb-3"></div>
    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>

    <div className="flex items-baseline mb-6">
      <div className="h-9 bg-gray-200 rounded w-20"></div>
      <div className="h-5 bg-gray-200 rounded w-16 ml-2"></div>
    </div>

    <div className="space-y-2 mb-6">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="flex items-center">
          <div className="w-5 h-5 bg-gray-200 rounded mr-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      ))}
    </div>

    <div className="h-11 bg-gray-200 rounded-lg w-full"></div>
  </div>
);

const SubscriptionSkeleton = () => {
  return (
    <div className="bg-[#f9fafc] shadow-sm p-6 md:p-8 border border-gray-200">
      {/* Header Skeleton */}
      <div className="text-center mb-8">
        <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-80 mx-auto animate-pulse"></div>
      </div>

      {/* Current Plan Skeleton */}
      <AccountOverviewSkeleton />

      {/* Plans Section Skeleton */}
      <div className="mt-10">
        <div className="h-7 bg-gray-200 rounded w-40 mx-auto mb-6 animate-pulse"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <PricingCardSkeleton key={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSkeleton;
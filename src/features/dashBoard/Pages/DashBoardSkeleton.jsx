import React from "react";

const DashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#f9fafc] pb-10 animate-pulse">
      {/* ===== Top Cards Skeleton ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 p-3 sm:p-4 md:p-6">
        {/* Total Invoices Card Skeleton */}
        <div className="relative flex justify-between items-center border border-gray-100 shadow-md rounded-2xl p-4 md:p-6 bg-gray-100">
          <div className="flex-1 min-w-0 pr-2">
            <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
            <div className="h-8 bg-gray-300 rounded w-16"></div>
          </div>
          <div className="flex-shrink-0">
            <div className="bg-gray-300 p-3 md:p-4 rounded-2xl w-12 h-12"></div>
          </div>
        </div>

        {/* Total Revenue Card Skeleton */}
        <div className="relative flex justify-between items-center border border-gray-100 shadow-md rounded-2xl p-4 md:p-6 bg-gray-100">
          <div className="flex-1 min-w-0 pr-2">
            <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
            <div className="h-8 bg-gray-300 rounded w-20"></div>
          </div>
          <div className="flex-shrink-0">
            <div className="bg-gray-300 p-3 md:p-4 rounded-2xl w-12 h-12"></div>
          </div>
        </div>

        {/* Total GST Card Skeleton */}
        <div className="relative flex justify-between items-center border border-gray-100 shadow-md rounded-2xl p-4 md:p-6 bg-gray-100">
          <div className="flex-1 min-w-0 pr-2">
            <div className="h-4 bg-gray-300 rounded w-20 mb-2"></div>
            <div className="h-8 bg-gray-300 rounded w-18"></div>
          </div>
          <div className="flex-shrink-0">
            <div className="bg-gray-300 p-3 md:p-4 rounded-2xl w-12 h-12"></div>
          </div>
        </div>
      </div>

      {/* ===== Low Stock Section Skeleton ===== */}
      <div className="px-3 sm:px-4 md:px-6 mt-6">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 w-full p-4 md:p-6">
          {/* Header Skeleton */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-3">
            <div className="flex items-start gap-3 md:gap-5">
              <div className="bg-gray-300 p-2 rounded-xl w-10 h-10"></div>
              <div>
                <div className="h-5 bg-gray-300 rounded w-40 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-32"></div>
              </div>
            </div>
            <div className="h-4 bg-gray-300 rounded w-16"></div>
          </div>

          {/* Low Stock Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="bg-gray-100 border border-gray-200 rounded-xl p-4 md:p-5"
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="h-5 bg-gray-300 rounded w-20"></div>
                  <div className="h-6 bg-gray-300 rounded w-16"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== Recent Invoices Section Skeleton ===== */}
      <div className="px-3 sm:px-4 md:px-6 mt-6 md:mt-8">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 w-full p-4 md:p-6">
          {/* Header Skeleton */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-3">
            <div className="flex items-start gap-3 md:gap-5">
              <div className="bg-gray-300 p-2 rounded-xl w-10 h-10"></div>
              <div>
                <div className="h-5 bg-gray-300 rounded w-32 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-40"></div>
              </div>
            </div>
          </div>

          {/* Desktop Table Skeleton */}
          <div className="hidden md:block overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full text-sm text-left border border-gray-200 rounded-xl overflow-hidden">
                <thead className="bg-gray-200">
                  <tr>
                    {[...Array(6)].map((_, index) => (
                      <th key={index} className="px-4 lg:px-6 py-3">
                        <div className="h-4 bg-gray-300 rounded w-20 mx-auto"></div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[...Array(5)].map((_, rowIndex) => (
                    <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      {[...Array(6)].map((_, colIndex) => (
                        <td key={colIndex} className="px-4 lg:px-6 py-3 md:py-4">
                          <div className={`h-4 bg-gray-300 rounded mx-auto ${ colIndex === 5 ? "w-1/3 h-5" : "w-3/4"}`}></div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View Skeleton */}
          <div className="md:hidden space-y-3">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className={`rounded-lg shadow p-4 ${
                  index % 2 === 1 ? "bg-gray-50" : "bg-white"
                } border border-gray-100`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="h-5 bg-gray-300 rounded w-20 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-16"></div>
                  </div>
                  <div className="h-6 bg-gray-300 rounded w-16 ml-2"></div>
                </div>
                <div className="h-5 bg-gray-300 rounded w-32 mb-3"></div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <div>
                    <div className="h-4 bg-gray-300 rounded w-12 mb-1"></div>
                    <div className="h-6 bg-gray-300 rounded w-16"></div>
                  </div>
                  <div className="bg-gray-300 p-2 rounded-lg w-10 h-10"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
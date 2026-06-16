import React from "react";

const CustomerTableSkeleton = ({ rows = 7, mobileRows = 5 }) => {
  return (
    <>
      {/* Desktop Table Skeleton */}
      <div className="hidden md:block relative overflow-x-auto rounded-lg border border-gray-200">
        <div className="max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-500">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 font-semibold text-sm">Name</th>
                <th className="px-4 py-3 font-semibold text-sm">Phone</th>
                <th className="px-4 py-3 font-semibold text-sm">Email</th>
                <th className="px-4 py-3 font-semibold text-sm">GST</th>
                <th className="px-4 py-3 font-semibold text-sm">State</th>
                <th className="px-4 py-3 text-center font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[...Array(rows)].map((_, index) => (
                <tr
                  key={index}
                  className={`transition hover:bg-gray-50 ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="h-5 w-24 bg-gray-300 rounded animate-pulse"></div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-5 w-28 bg-gray-300 rounded animate-pulse"></div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-5 w-40 bg-gray-300 rounded animate-pulse"></div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-5 w-20 bg-gray-300 rounded animate-pulse"></div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-5 w-16 bg-gray-300 rounded animate-pulse"></div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2 flex-wrap">
                      <div className="h-6 w-7 bg-gray-300 rounded-md animate-pulse"></div>
                      <div className="h-6 w-7 bg-gray-300 rounded-md animate-pulse"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards Skeleton */}
      <div className="md:hidden space-y-4">
        {[...Array(mobileRows)].map((_, index) => (
          <div key={index} className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition">
            <div className="p-4 pb-2">
              <div className="flex justify-between items-center mb-2">
                <div className="h-7 w-32 bg-gray-300 rounded animate-pulse"></div>
              </div>
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-4 w-28 bg-gray-300 rounded animate-pulse"></div>
              </div>
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-4 w-44 bg-gray-300 rounded animate-pulse"></div>
              </div>
              <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-4 w-24 bg-gray-300 rounded animate-pulse"></div>
              </div>
              <div className="flex items-center gap-2 text-gray-600 text-sm">
                <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-4 w-20 bg-gray-300 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="w-full rounded-b-xl p-3 flex justify-end items-center gap-6 animate-pulse">
              <div className="h-5 w-5 bg-gray-300 rounded animate-pulse"></div>
              <div className="h-5 w-5 bg-gray-300 rounded animate-pulse"></div>
              
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default CustomerTableSkeleton;
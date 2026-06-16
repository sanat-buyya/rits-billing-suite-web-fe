import React from "react";

const InvoiceHistorySkeleton = ({ invoiceSkeleton }) => {
  return (
    <div className="bg-[#f9fafc] h-full flex flex-col  ">
      {/* Desktop Table Skeleton */}
      <div className="hidden md:flex md:flex-col bg-white rounded-lg shadow flex-1 min-h-0">
        <div className="bg-gray-100 text-gray-700 uppercase text-xs sticky top-0 z-10">
          <div className="flex px-4 py-1 border-b border-gray-200">
            <div className="px-4 py-3 w-1/6">
              <div className="h-3 bg-gray-300 rounded animate-pulse w-20"></div>
            </div>
            <div className="px-4 py-3 w-1/6">
              <div className="h-3 bg-gray-300 rounded animate-pulse w-16"></div>
            </div>
            <div className="px-4 py-3 w-1/6">
              <div className="h-3 bg-gray-300 rounded animate-pulse w-24"></div>
            </div>
            <div className="px-2 py-3 w-1/6 text-left">
              <div className="h-3 bg-gray-300 rounded animate-pulse w-16"></div>
            </div>
            <div className="px-2 py-3 w-1/6 text-left">
              <div className="h-3 bg-gray-300 rounded animate-pulse w-16"></div>
            </div>
            <div className="px-2 py-3 w-1/6 text-left">
              <div className="h-3 bg-gray-300 rounded animate-pulse w-16"></div>
            </div>
            <div className="px-2 py-3 w-1/6 text-left">
              <div className="h-3 bg-gray-300 rounded animate-pulse w-16"></div>
            </div>
            {invoiceSkeleton && (
              <>
                <div className="px-6 py-3 w-1/6 text-right">
                  <div className="h-3 bg-gray-300 rounded animate-pulse w-12 ml-auto"></div>
                </div>
                <div className="px-1 py-3 w-1/6 text-right">
                  <div className="h-3 bg-gray-300 rounded animate-pulse w-20 ml-auto"></div>
                </div>
              </>
            )}

            <div className="px-4 py-3 w-1/6 text-center">
              <div className="h-3 bg-gray-300 rounded animate-pulse w-12 mx-auto"></div>
            </div>
          </div>
        </div>

        {/* Table Body Skeleton */}
        <div className="flex-1 overflow-y-auto">
          {[...Array(9)].map((_, rowIndex) => (
            <div
              key={rowIndex}
              className={`flex px-4 border-b border-gray-200 ${
                rowIndex % 2 === 1 ? "bg-gray-50" : "bg-white"
              }`}
            >
              <div className="px-4 py-3 w-1/6">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
              </div>
              <div className="px-4 py-3 w-1/6">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
              </div>
              <div className="px-4 py-3 w-1/6">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
              </div>
              <div className="px-2 py-3 w-1/6 text-left">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
              </div>
              <div className="px-2 py-3 w-1/6 text-left">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
              </div>
              <div className="px-2 py-3 w-1/6 text-left">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
              </div>
              {invoiceSkeleton && (
                <>
                  <div className="px-6 py-3 w-1/6 text-right">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-12 ml-auto"></div>
                  </div>
                  <div className="px-1 py-3 w-1/6 text-right">
                    <div className="h-6 bg-gray-200 rounded-full animate-pulse w-20 ml-auto"></div>
                  </div>
                </>
              )}

              <div className="px-4 py-3 w-1/6 flex items-center justify-center space-x-5">
                <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Mobile Card View Skeleton */}
      <div className="md:hidden flex flex-col flex-1 min-h-0">
        <div className="flex-1 overflow-y-auto space-y-3">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className={`rounded-lg shadow p-4 ${
                index % 2 === 1 ? "bg-gray-50" : "bg-white"
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded animate-pulse w-24 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                </div>
                {invoiceSkeleton && (
                  <>
                    <div className="h-6 bg-gray-200 rounded-full animate-pulse w-20 mr-2"></div>
                  </>
                )}
                <div className="w-5 h-5 bg-gray-200 rounded-sm animate-pulse"></div>
                <div className="w-5 h-5 bg-gray-200 rounded-sm animate-pulse ml-2"></div>
              </div>

              <div className="h-4 bg-gray-200 rounded animate-pulse w-32 mb-3"></div>

              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <div className="flex-1">
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-12 mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-16 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
                </div>
                {invoiceSkeleton && (
                  <>
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-12"></div>
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-12 ml-3 mr-3"></div>
                  </>
                )}
                <div className="w-5 h-5 bg-gray-200 rounded-sm animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InvoiceHistorySkeleton;

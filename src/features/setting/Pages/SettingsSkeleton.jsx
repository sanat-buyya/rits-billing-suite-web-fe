import React from "react";

export default function SettingsSkeleton() {
  const inputClass = "w-full h-10 bg-gray-200 rounded-lg animate-pulse";
  const labelClass = "h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse";
  const sectionClass = "bg-white shadow rounded-lg p-4 sm:p-6 space-y-4 sm:space-y-6";
  const buttonClass = "h-10 bg-gray-200 rounded-lg animate-pulse";

  return (
    <div className="h-[calc(100vh-64px)] overflow-y-auto bg-[#f9fafc]">
      {/* Header Skeleton */}
      <div className="sticky top-0 z-10 bg-gray-100 border-b border-gray-300 shadow-sm">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3 sm:py-4">
          <div className="w-full sm:w-auto overflow-x-auto">
            <div className="flex gap-4 sm:gap-8 min-w-max">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-8 bg-gray-200 rounded w-24 animate-pulse"
                ></div>
              ))}
            </div>
          </div>
          <div className="w-full sm:w-auto flex justify-center lg:justify-end">
            <div className="h-10 bg-gray-200 rounded-lg w-full animate-pulse lg:w-40"></div>
          </div>
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="max-w-8xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12 pb-8">
        {/* Business Section Skeleton */}
        <section className={sectionClass}>
          <div className="flex items-center gap-3 sm:gap-4 mb-2">
            <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-64 mb-4 animate-pulse"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {[1, 2].map((item) => (
              <div key={item}>
                <div className={labelClass}></div>
                <div className={inputClass}></div>
              </div>
            ))}
          </div>

          <div>
            <div className={labelClass}></div>
            <div className={inputClass}></div>
          </div>

          <div>
            <div className={labelClass}></div>
            <div className="h-20 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>

          {/* Logo Upload Skeleton */}
          <div className="rounded-lg py-6 px-4 bg-gray-100 flex flex-col items-center justify-center border border-gray-300">
            <div className="w-12 h-12 bg-gray-200 rounded-full mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-48 mb-1 animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-36 animate-pulse"></div>
          </div>
        </section>

        {/* Payment Section Skeleton */}
        <section className={sectionClass}>
          <div className="flex items-center gap-3 sm:gap-4 mb-2">
            <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-56 animate-pulse"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-72 mb-4 animate-pulse"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {[1, 2, 3, 4].map((item) => (
              <div key={item}>
                <div className={labelClass}></div>
                <div className={inputClass}></div>
              </div>
            ))}
          </div>

          <div>
            <div className={labelClass}></div>
            <div className={inputClass}></div>
          </div>

          <div>
            <div className={labelClass}></div>
            <div className="h-20 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </section>

        {/* Invoice Section Skeleton */}
        <section className={sectionClass}>
          <div className="flex items-center gap-3 sm:gap-4 mb-2">
            <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-40 animate-pulse"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-60 mb-4 animate-pulse"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {[1, 2, 3, 4].map((item) => (
              <div key={item}>
                <div className={labelClass}></div>
                <div className={inputClass}></div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
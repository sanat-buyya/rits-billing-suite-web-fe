import React from "react";

const shimmer =
  "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.6s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent";

const LandingPageSkeleton = () => {
  return (
    <div className="w-full min-h-screen bg-[#0a1628] text-white flex flex-col items-center overflow-x-hidden hide-scrollbar">
      {/* ===== HERO SECTION ===== */}
      <section className="w-full flex flex-col items-center pt-24 pb-2 px-6 text-center relative z-20">
        {/* Hero title */}
        <div
          className={`h-10 sm:h-12 w-5/6 sm:w-3/4 md:w-1/2 bg-gray-700 rounded-lg mb-6 ${shimmer}`}
        ></div>

        {/* Hero description */}
        <div
          className={`h-5 sm:h-6 w-11/12 sm:w-10/12 md:w-2/3 bg-gray-600 rounded-lg mb-10 ${shimmer}`}
        ></div>

        {/* Get Started button */}
        <div
          className={`h-10 sm:h-12 w-36 sm:w-44 bg-[#2e4b66] rounded-full mb-6 ${shimmer}`}
        ></div>
      </section>

      {/* ===== MOCKUP IMAGES SECTION ===== */}
      <section className="w-full flex justify-center relative z-10 mt-12 sm:mt-20">
        <div className="relative w-full max-w-[90%] sm:max-w-3xl md:max-w-4xl flex justify-center">
          {/* Background gradient blobs */}
          <div
            className="absolute inset-0 -z-10 pointer-events-none "
            style={{ isolation: "isolate" }}
          >
            <div
              className="absolute left-[-30%] top-[-10px] w-[300px] h-[300px] opacity-60 rounded-[30%_70%_70%_30%_/_60%_40%_60%_40%]"
              style={{
                background:
                  "radial-gradient(circle at 10% 10%, #2d4a6e 0%, transparent 70%)",
              }}
            ></div>
            <div
              className="absolute right-[-30%] top-[-800px] w-[1000px] h-[800px] opacity-45 rounded-[60%_40%_30%_70%_/_50%_60%_40%_50%]"
              style={{
                background:
                  "radial-gradient(circle at 40% 40%, #3B9FDB 0%, transparent 65%)",
              }}
            ></div>
          </div>

          {/* 📱 Mobile placeholder (comes ABOVE laptop now) */}
          <div
            className={`absolute bottom-[-90px] sm:bottom-[-110px] right-[-80%] w-[32%] sm:w-[32%] aspect-[9/19] bg-gray-600 rounded-2xl shadow-lg ${shimmer}`}
            style={{
              filter: "drop-shadow(0px 20px 40px rgba(0,0,0,0.3))",
              zIndex: 2,
            }}
          ></div>

          {/* 💻 Laptop placeholder (below mobile) */}
          <div
            className={`bg-gray-700 w-[100%] sm:w-[110%] h-[240px] sm:h-[380px] md:h-[480px] rounded-2xl translate-y-16 sm:translate-y-20 -translate-x-2 sm:-translate-x-4 shadow-2xl ${shimmer}`}
            style={{
              filter: "drop-shadow(0px 20px 40px rgba(0,0,0,0.5))",
              zIndex: 1,
            }}
          ></div>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="w-full bg-white text-gray-900 pt-48 pb-12 px-6 flex flex-col items-center -mt-[100px]">
        {/* Section heading */}
        <div
          className={`h-8 sm:h-10 w-2/3 sm:w-1/3 bg-gray-300 rounded-lg mb-20 mt-20 ${shimmer}`}
        ></div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 sm:gap-x-16 md:gap-x-24 lg:gap-x-32 gap-y-10 sm:gap-y-16 max-w-6xl w-full">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-start gap-4 sm:gap-6 bg-gray-100 p-4 sm:p-6 rounded-2xl w-full shadow-sm"
            >
              <div
                className={`w-12 sm:w-16 h-12 sm:h-16 bg-gray-300 rounded-full flex-shrink-0 ${shimmer}`}
              ></div>
              <div className="flex flex-col space-y-2 sm:space-y-3 w-full">
                <div
                  className={`w-3/4 h-4 sm:h-5 bg-gray-300 rounded ${shimmer}`}
                ></div>
                <div
                  className={`w-4/5 h-3 sm:h-4 bg-gray-200 rounded ${shimmer}`}
                ></div>
                <div
                  className={`w-2/4 h-3 sm:h-4 bg-gray-200 rounded ${shimmer}`}
                ></div>
              </div>
            </div>
          ))}
        </div>
        </section>

        
        {/* ===== DOWNLOAD APP SECTION ===== */}
        <section className={`w-full bg-white py-20 px-6 ${shimmer}`}>
        <div className="w-full rounded-[36px] border border-blue-200 bg-blue-50 shadow-sm px-10 md:px-16 py-14">
          
          {/* Top Content */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-16">

            {/* Left Text Skeleton */}
            <div className="flex flex-col gap-6 w-full md:w-1/2">
              <div className={`h-10 w-3/4 rounded-xl bg-gray-300 ${shimmer}`} />
              <div className={`h-4 w-full rounded-md bg-gray-300 ${shimmer}`} />
              <div className={`h-4 w-5/6 rounded-md bg-gray-300 ${shimmer}`} />
              <div className={`h-4 w-2/3 rounded-md bg-gray-300 ${shimmer}`} />

              <div className="flex gap-4 mt-6">
                <div className={`h-12 w-36 rounded-xl bg-gray-300 ${shimmer}`} />
                <div className={`h-12 w-36 rounded-xl bg-gray-300 ${shimmer}`} />
              </div>
            </div>

            {/* Right Image Skeleton (Desktop Only) */}
            <div className="hidden lg:flex w-full md:w-1/2 items-center justify-center gap-4">
              <div className={`w-32 h-64 rounded-2xl bg-gray-300 shadow-lg ${shimmer}`} />
              <div className={`w-40 h-72 rounded-2xl bg-gray-300 shadow-2xl ${shimmer}`} />
              <div className={`w-32 h-64 rounded-2xl bg-gray-300 shadow-lg ${shimmer}`} />
            </div>

          </div>
        </div>
          {/* ===== FOOTER SKELETON ===== */}
        <div className="text-base text-gray-500 mt-20 flex flex-col items-center text-center w-full pt-6">
          {/* Footer links */}
          <div className="flex items-center gap-6 mb-6">
            <div className={`w-20 h-4 bg-gray-300 rounded ${shimmer}`}></div>
            <span className="text-gray-300">•</span>
            <div className={`w-16 h-4 bg-gray-300 rounded ${shimmer}`}></div>
          </div>

          <div className="w-3/4 border-t border-gray-300 mb-4"></div>

          <div className={`w-3/4 h-4 bg-gray-300 rounded ${shimmer}`}></div>
        </div>
      </section>

      {/* ===== SHIMMER ANIMATION KEYFRAME ===== */}
      <style>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }

        /* Responsive handling */
        @media (max-width: 640px) {
          .mobile-placeholder {
            bottom: -70px !important;
            width: 42% !important;
          }
        }

        @media (min-width: 640px) and (max-width: 767px) {
          .mobile-placeholder {
            bottom: -90px !important;
            width: 36% !important;
          }
        }

        @media (min-width: 768px) and (max-width: 1023px) {
          .mobile-placeholder {
            bottom: -100px !important;
            width: 32% !important;
          }
        }

        @media (min-width: 1024px) {
          .mobile-placeholder {
            bottom: -110px !important;
            width: 30% !important;
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPageSkeleton;

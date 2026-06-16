import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import laptop from "../../../assets/laptop.png";
import mobile from "../../../assets/mobile.png";
import appScreen1 from "../../../assets/appScreen1.jpg";
import appScreen2 from "../../../assets/appScreen2.jpg";
import appScreen3 from "../../../assets/appScreen3.jpg";
import playstoreBadge from "../../../assets/playstoreBadge.png"
import appQr from "../../../assets/app-qr.jpg";
import { useSelector, useDispatch } from "react-redux";
import { restoreUser } from "../../auth/authThunk";
import LandingPageSkeleton from "./LandingPageSkeleton";


let hasLoaderShown = false

const LandingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(!hasLoaderShown); //


  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    dispatch(restoreUser());
  }, [dispatch]);

  // Scroll to top once on mount
  useEffect(() => {
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
    });
  }, []);


  useEffect(() => {
    if (!hasLoaderShown) {
      const timer = setTimeout(() => {
        setLoading(false);
        hasLoaderShown = true;
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  if (loading) return <LandingPageSkeleton />;

  return (
    <div className="w-full min-h-screen bg-[#0a1628] text-white flex flex-col items-center overflow-x-hidden hide-scrollbar">
      {/* ===== HERO TEXT ===== */}
      <section className="w-full flex flex-col items-center pt-24 pb-2 px-6 text-center relative z-20 ">
        <motion.h1
          className="text-5xl md:text-6xl font-bold mb-6 leading-tight relative z-30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Welcome to RITS Billing Suite.
        </motion.h1>

        <motion.p
          className="text-gray-300 max-w-2xl mb-10 text-xl relative z-30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Manage your business billing effortlessly. Generate invoices, track
          inventory, scan barcodes, and export reports with ease. Designed for
          shop vendors to simplify daily operations.
        </motion.p>

        <motion.button
          onClick={handleGetStarted}
          className="bg-[#3B9FDB] hover:bg-[#2E8BC7] text-white font-semibold px-10 py-4 rounded-full shadow-lg transition transform hover:scale-105 text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          Get Started
        </motion.button>
      </section>

      {/* ===== MOCKUP IMAGES ===== */}
      <section className="w-full flex justify-center relative z-10 mt-18">
        <motion.div
          className="relative w-full max-w-4xl"
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {/* Background blobs */}
          <div
            className="absolute inset-0 -z-10 pointer-events-none"
            style={{ isolation: "isolate" }}
          >
            <div
              className="absolute left-[-30%] top-[-10px] w-[300px] h-[300px] opacity-60"
              style={{
                borderRadius: "30% 70% 70% 30% / 60% 40% 60% 40%",
                background:
                  "radial-gradient(circle at 10% 10%, #2d4a6e 0%, transparent 70%)",
              }}
            />
            <div
              className="absolute right-[-30%] top-[-800px] w-[1000px] h-[800px] opacity-45"
              style={{
                borderRadius: "60% 40% 30% 70% / 50% 60% 40% 50%",
                background:
                  "radial-gradient(circle at 40% 40%, #3B9FDB 0%, transparent 65%)",
              }}
            />
          </div>

          <img
            src={laptop}
            alt="Billing dashboard mockup"
            className="w-[110%] translate-y-20 -translate-x-4"
            style={{
              filter: "drop-shadow(0px 20px 40px rgba(0, 0, 0, 0.5))",
            }}
          />
          <img
            src={mobile}
            alt="Mobile dashboard mockup"
            className="absolute bottom-[-110px] right-[-5%] w-[32%] rounded-2xl"
            style={{
              filter: "drop-shadow(0px 20px 40px rgba(0, 0, 0, 0.3))",
            }}
          />
        </motion.div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="w-full bg-white text-gray-900 pt-48 pb-12 px-6 flex flex-col items-center -mt-[100px]">
        <motion.h2
          className="text-4xl md:text-5xl font-bold mb-20 text-center mt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
        >
          Key Features
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-32 gap-y-16 max-w-10xl">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 + i * 0.15 }}
            >
              <FeatureCard {...f} />
            </motion.div>
          ))}
        </div>

                {/* ===== DOWNLOAD APP SECTION ===== */}
        <section className="w-full bg-white py-20 px-6 flex justify-center">
          <div className="w-full rounded-[36px] border border-blue-200 bg-blue-50 shadow-sm px-10 md:px-16 py-14">

            <div className="flex flex-col md:flex-row items-center justify-between gap-16  ">

              {/* ===== LEFT CONTENT + QR ===== */}
              <div className="flex flex-col justify-between w-full">

                {/* TEXT CONTENT */}
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-5">
                    Download the app now
                  </h2>

                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    Manage billing, inventory, and reports seamlessly from your
                    mobile phone with the RITS Billing Suite app.
                  </p>

                  {/* SMALL QR */}
                <div className="mt-6 flex items-center gap-4">
                  <img
                    src={appQr}
                    alt="App QR Code"
                    className="w-28 h-28 rounded-xl border border-gray-200 shadow-sm"
                  />
                  <p className="text-sm text-gray-500 leading-snug">
                    Scan to download <br /> the mobile app
                  </p>
                </div>

                  {/* PLAY STORE */}
                  <div className="flex items-center gap-6 mt-6">
                    <a
                      href="https://play.google.com/store/search?q=rits+billing+suite&c=apps"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        src={playstoreBadge}
                        alt="Get it on Google Play"
                        className="h-14 hover:scale-105 transition-transform"
                      />
                    </a>
                  </div>
                </div>

                
              </div>

              {/* ===== RIGHT APP SCREENSHOTS ===== */}
              <div className="hidden lg:flex w-full items-center justify-center">
                <div className="flex items-center gap-4">
                  {/* Screenshot 1  */}
                  <img
                    src={appScreen1}
                    alt="App Screenshot 1"
                    className="w-32 rounded-2xl shadow-lg opacity-80 hover:opacity-100 transition"
                  />

                  {/* Screenshot 2 (Main) */}
                  <img
                    src={appScreen2}
                    alt="App Screenshot 2"
                    className="w-40 rounded-2xl shadow-2xl scale-105 hover:scale-110 transition-transform duration-300"
                  />

                  {/* Screenshot 3 */}
                  <img
                    src={appScreen3}
                    alt="App Screenshot 3"
                    className="w-32 rounded-2xl shadow-lg opacity-80 hover:opacity-100 transition"
                  />
                </div>
              </div>

            </div>
          </div>
        </section>

       <footer className="text-base text-gray-500 mt-4 flex flex-col items-center text-center w-full pt-16">
          <div className="flex items-center gap-6 mb-6">
            <button
              type="button"
              onClick={() => navigate("/privacy-policy")}
              className="hover:text-[#1E88E5] transition-colors duration-300 relative group"
            >
              Privacy Policy
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1E88E5] transition-all duration-300 group-hover:w-full"></span>
            </button>

            <span className="text-gray-300">•</span>

            <button
              type="button"
              onClick={() => navigate("/ContactUs")}
              className="hover:text-[#1E88E5] transition-colors duration-300 relative group"
            >
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1E88E5] transition-all duration-300 group-hover:w-full"></span>
            </button>
          </div>

          <div className="w-3/4 border-t border-gray-300 mb-4"></div>

          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} RevAppayya IT Services Pvt Ltd. All rights
            reserved.
          </p>
        </footer>
      </section>
    </div>
  );
};

const features = [
  { icon: "⚡", title: "Quick Billing", desc: "Create invoices in seconds.", bgColor: "bg-[#1E88E5]" },
  { icon: "🧾", title: "GST Ready", desc: "Fully compliant with GST standards.", bgColor: "bg-[#1E88E5]" },
  { icon: "📤", title: "Export Invoices", desc: "Export invoices to Excel easily.", bgColor: "bg-[#1E88E5]" },
  { icon: "📝", title: "Generate Quotations", desc: "Create professional quotations instantly.", bgColor: "bg-[#1E88E5]" },
];

const FeatureCard = ({ icon, title, desc, bgColor }) => (
  <div className="flex items-start gap-6 group transition-transform duration-300 hover:scale-105">
    <div
      className={`${bgColor} w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg transition-all duration-300 group-hover:shadow-2xl group-hover:scale-110`}
    >
      <span className="text-3xl transition-transform duration-300 group-hover:scale-110">
        {icon}
      </span>
    </div>
    <div className="flex flex-col">
      <h3 className="font-bold text-xl mb-2 transition-colors duration-300 group-hover:text-[#1E88E5]">
        {title}
      </h3>
      <p className="text-gray-600 text-base leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default LandingPage;

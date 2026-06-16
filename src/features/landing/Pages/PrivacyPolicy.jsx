import React, {useEffect} from "react";
import { motion } from "framer-motion";
 
const PrivacyPolicy = () => {
 
    useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
 
  return (
    <div className="w-full min-h-screen bg-[#0a1628] text-white flex flex-col items-center overflow-x-hidden hide-scrollbar">
      {/* ===== HERO SECTION ===== */}
      <section className="w-full relative flex flex-col items-center text-center pt-32 pb-32 px-6">
        {/* Decorative blobs */}
        <div className="absolute inset-0 -z-10">
          <div
            className="absolute left-[-20%] top-[-10px] w-[400px] h-[400px] opacity-40 rounded-full"
            style={{
              background: "radial-gradient(circle at 20% 20%, #2d4a6e, transparent 70%)",
            }}
          />
          <div
            className="absolute right-[-25%] top-[-150px] w-[900px] h-[600px] opacity-30 rounded-full"
            style={{
              background: "radial-gradient(circle at 50% 50%, #3B9FDB, transparent 70%)",
            }}
          />
        </div>
 
        <motion.h1
          className="text-5xl md:text-6xl font-bold mb-4 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Privacy Policy
        </motion.h1>
 
        <motion.p
          className="text-gray-300 text-lg mb-10 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Effective Date: October 18, 2025
        </motion.p>
 
        {/* Curved bottom */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden" style={{ lineHeight: 0 }}>
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="w-full" style={{ height: "120px" }}>
            <path
              d="M0,64 C240,20 480,20 720,64 C960,108 1200,108 1440,64 L1440,120 L0,120 Z"
              fill="white"
            />
          </svg>
        </div>
      </section>
 
      {/* ===== CONTENT SECTION ===== */}
      <section className="w-full bg-white text-gray-900 py-16 px-6 md:px-16 flex flex-col items-center">
        <div className="max-w-5xl flex flex-col gap-12">
          <motion.p
            className="text-gray-700 text-lg leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            RITS Billing Suite ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard the personal and business information you provide while using our mobile and web applications.
          </motion.p>
 
          {[
            {
              title: "1. Information We Collect",
              desc: "We collect your basic information such as name, email, and business details during registration. OTP verification is used to confirm email. Additionally, your inventory, invoices, quotations, and customer information are stored securely for app functionality.",
            },
            {
              title: "2. Permissions We Use",
              desc: "Camera: Barcode scanning for products and invoices.\nStorage: Save and export invoices and reports in Excel format.\nInternet: OTP verification and data synchronization.",
            },
            {
              title: "3. Data Usage",
              desc: "Data is used solely to provide app features: billing, invoice generation, inventory management, and quotation preparation. We do not sell or share user data with third parties except as required by law.",
            },
            {
              title: "4. Data Security",
              desc: "We implement technical and organizational measures to protect your data from unauthorized access or misuse.",
            },
            {
              title: "5. Third-Party Services",
              desc: "Trusted third-party services (e.g., email OTP, analytics) may be used. They follow their own privacy policies in compliance with international standards.",
            },
            {
              title: "6. Your Control",
              desc: "Users can modify or delete account data anytime within the app. For complete deletion, contact our support team.",
            },
            {
              title: "7. Contact Us",
              desc: "Questions about this Privacy Policy? Contact us at:\nEmail: billingsupport@revappayyaitservices.com",
            },
          ].map((section, i) => (
            <motion.div
              key={i}
              className="border-l-4 border-[#1E88E5] pl-6 md:pl-8 py-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.15 }}
            >
              <h3 className="text-2xl font-bold mb-2">{section.title}</h3>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">{section.desc}</p>
            </motion.div>
          ))}
        </div>
 
        {/* Footer */}
        <footer className="mt-16 w-full text-center text-gray-500">
          <p className="mb-2">© {new Date().getFullYear()} RevAppayya IT Services Pvt Ltd. All rights reserved.</p>
        </footer>
      </section>
    </div>
  );
};
 
export default PrivacyPolicy;
 
 
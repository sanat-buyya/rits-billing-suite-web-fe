import React, {useState, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { contactForm } from "../../auth/authThunk";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa";
import { motion } from "framer-motion";
import Spinner from "../../../components/Spinner";
import AppToast from "../../../services/toastService";

const ContactUs = () => {
  const dispatch = useDispatch();
  const { contactLoading, contactError, contactMessage } = useSelector(
    (state) => state.auth
  );
 
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
 
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (contactMessage) {
      AppToast.showSuccess(contactMessage);
      setName("");
      setEmail("");
      setMessage("");
    }
    if (contactError) {
      AppToast.showError(contactError);
    }
  }, [contactMessage, contactError]);
 
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) {
      AppToast.showError("Please fill all fields before submitting.");
      return;
    }
    dispatch(contactForm({ name, email, message }));
  };
 

  return (
    <div className="w-full min-h-screen bg-white text-gray-900 overflow-x-hidden">
      {/* ===== HEADER SECTION ===== */}
      <header className="relative bg-[#081a33] text-white text-center pt-32 pb-32 px-6 overflow-hidden">
        {/* Animated Header Text */}
        <motion.h1
          className="text-5xl md:text-6xl font-bold mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Contact Us
        </motion.h1>

        <motion.p
          className="text-gray-300 text-lg mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          We’re here to help! Reach out to us anytime.
        </motion.p>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-[0]">
          <svg
            viewBox="0 0 1440 150"
            preserveAspectRatio="none"
            className="w-full"
            style={{ height: "150px" }}
          >
            <path
              d="M0,96 C240,64 480,64 720,96 C960,128 1200,128 1440,96 L1440,160 L0,160 Z"
              fill="white"
            />
          </svg>
        </div>
      </header>

      {/* ===== CONTACT BOXES ===== */}
      <section className="w-full bg-white text-gray-800 flex flex-wrap justify-center gap-6 mt-0 mb-20 px-6 py-16">
        <div className="bg-white rounded-2xl shadow-lg w-69 text-center p-8 hover:-translate-y-2 hover:shadow-xl transition-all">
          <FaEnvelope className="mx-auto text-[#0a1435] mb-3" size={36} />
          <h3 className="text-xl font-semibold mb-1">Email</h3>
          <p className="text-gray-600">billingsupport@revappayyaitservices.com</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg w-64 text-center p-8 hover:-translate-y-2 hover:shadow-xl transition-all">
          <FaPhoneAlt className="mx-auto text-[#0a1435] mb-3" size={36} />
          <h3 className="text-xl font-semibold mb-1">Phone</h3>
          <p className="text-gray-600">+91 72591 02861</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg w-64 text-center p-8 hover:-translate-y-2 hover:shadow-xl transition-all">
          <FaMapMarkerAlt className="mx-auto text-[#0a1435] mb-3" size={36} />
          <h3 className="text-xl font-semibold mb-1">Head Office</h3>
          <p className="text-gray-600">22, 168/8/2, Roopena Agrahara, Bhoothanahali, Bengluru, Karnataka-560068</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg w-64 text-center p-8 hover:-translate-y-2 hover:shadow-xl transition-all">
          <FaMapMarkerAlt className="mx-auto text-[#0a1435] mb-3" size={36} />
          <h3 className="text-xl font-semibold mb-1">Regional Office</h3>
          <p className="text-gray-600">Unit no-2201A, 22nd floor, WTC Bangalore, Brigade Gateway, Bangalore- 560055</p>
        </div>
      </section>
      {/* ===== ACCOUNT DELETION NOTICE ===== */}
<section className="w-full bg-white px-6 mt-6 mb-10 text-center pb-20">

  <h2 className="text-2xl font-semibold text-[#0a1435] mb-2">
    Account Deletion Request
  </h2>

  <p className="text-gray-700 mb-3 leading-relaxed">
    If you want to permanently delete your <span className="font-semibold">RITS Billing Suite </span> 
    account and all associated data, please send an email to:
  </p>

  {/* Email Highlight */}
  <p className="inline-flex items-center gap-2 text-[#0a1435] font-semibold text-lg mb-4">
    <span className="text-xl">📩</span>
    billingsupport@revappayyaitservices.com
  </p>

  <p className="text-gray-700 mt-2">
    <span className="font-semibold">Subject:</span> Account Deletion Request
  </p>

  <p className="text-gray-700">
    We will verify your request and permanently delete your account and data 
    within <span className="font-semibold">7 days</span>.
  </p>

</section>

      {/* ===== CONTACT FORM ===== */}
      <section className="bg-white text-gray-900 text-center pb-24 px-6">
        <h2 className="text-3xl font-semibold text-[#0a1435] mb-8">
          Send Us a Message
        </h2>

        {/* Adding onSubmit and onChange */}

        <form
        onSubmit={handleSubmit} 
        className="max-w-lg mx-auto flex flex-col gap-4">
          <input
            type="text"
            placeholder="Your Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-[#0a1435] focus:ring-2 focus:ring-[#0a1435]/20 outline-none transition"
          />
          <input
            type="email"
            placeholder="Your Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-[#0a1435] focus:ring-2 focus:ring-[#0a1435]/20 outline-none transition"
          />
          <textarea
            rows="4"
            placeholder="Your Message"
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="border-2 border-gray-300 rounded-lg px-4 py-3 focus:border-[#0a1435] focus:ring-2 focus:ring-[#0a1435]/20 outline-none transition"
          ></textarea>

          <button 
            type="submit"
            className="bg-[#0a1435] text-white py-3 rounded-lg font-medium hover:bg-[#162c6a] transition transform hover:scale-105 inline-flex items-center justify-center gap-2"
          >
            {contactLoading?(
              <>
              <Spinner size={16} color="white"/> Send Message
              </>
            ):( 
            <>
            <FaPaperPlane size={18} /> Send Message
            </>
             )}
          </button>
        </form>
      </section>

      {/* ===== FOOTER ===== */}
      <footer>
        <div className="w-3/4 border-t border-gray-300 mb-4 mx-auto"></div>
        <p className="text-sm text-gray-600 text-center pb-3">
          © {new Date().getFullYear()} RevAppayya IT Services Pvt Ltd. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default ContactUs;

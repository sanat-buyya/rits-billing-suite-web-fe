import React, { useRef, useState, useEffect } from "react";
import {
  FaSave,
  FaCloudUploadAlt,
  FaBuilding,
  FaCreditCard,
  FaFileInvoice,
} from "react-icons/fa";
import States from "../../../components/State";
import { useSelector, useDispatch } from "react-redux";
import { updateSettings, fetchSettingData } from "../settingsThunk";
import AppToast from "../../../services/toastService";
import Dropdown from "../../../components/DropDown";
import Spinner from "../../../components/Spinner"
import SettingsSkeleton from "./SettingsSkeleton"

export default function SettingsPage() {
  const [logoUri, setLogoUri] = useState(null);
  const [shopName, setShopName] = useState("");
  const [gst, setGst] = useState("");
  const [state, setState] = useState("");
  const [address, setAddress] = useState("");
  const [accountName, setAccountName] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [upiId, setUpiId] = useState("");
  const [paymentNote, setPaymentNote] = useState("");
  const [invoicePrefix, setInvoicePrefix] = useState("");
  const [nextInvoiceNumber, setNextInvoiceNumber] = useState("");
  const [defaultGstPercentage, setDefaultGstPercentage] = useState("");
  const [printSetting, setPrintSetting] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeSection, setActiveSection] = useState("business");
  const [logoPreview, setLogoPreview] = useState(null);


  const dispatch = useDispatch();
  const { settingData, settingLoading ,getSettingDataLoading } = useSelector((state) => state.settings);

  // 🔹 Refs
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const businessRef = useRef(null);
  const paymentRef = useRef(null);
  const invoiceRef = useRef(null);

  const shopNameRef = useRef(null);
  const gstRef = useRef(null);
  const addressRef = useRef(null);
  const accountNameRef = useRef(null);
  const bankNameRef = useRef(null);
  const ifscRef = useRef(null);
  const accountNumberRef = useRef(null);

  //  Scroll to section (adjusted offset for header height)
  const scrollToSection = (ref, sectionKey) => {
    if (ref.current && containerRef.current) {
      const headerHeight = headerRef.current?.offsetHeight || 0;
      const offsetTop = ref.current.offsetTop - headerHeight - 60; // small padding
      containerRef.current.scrollTo({
        top: offsetTop < 0 ? 0 : offsetTop,
        behavior: "smooth",
      });
    }
    if (sectionKey) setActiveSection(sectionKey);
  };

  //  Fetch settings on mount
  useEffect(() => {
    dispatch(fetchSettingData());
  }, [dispatch]);

  //  Populate form fields
  useEffect(() => {
    if (settingData) {
      setShopName(settingData.shopName || "");
      setGst(settingData.gst || "");
      setState(settingData.state || "");
      setAddress(settingData.address || "");
      setAccountName(settingData.accountName || "");
      setBankName(settingData.bankName || "");
      setAccountNumber(settingData.accountNumber || "");
      setIfsc(settingData.ifsc || "");
      setUpiId(settingData.upiId || "");
      setPaymentNote(settingData.paymentNote || "");
      setInvoicePrefix(settingData.invoicePrefix || "");
      setNextInvoiceNumber(String(settingData.nextInvoiceNumber || ""));
      setDefaultGstPercentage(
        String(settingData.defaultGstPercentage?.$numberDecimal || "")
      );
      setPrintSetting(settingData.printSetting || "");
    }
  }, [settingData]);

  //  Validate form
  const validateForm = () => {
    const errors = {};

    if (!shopName.trim()) errors.shopName = "Buisness Name is required";

    // if (!gst.trim()) {
    //   errors.gst = "GST Number is required";
    // } else if (
    //   !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gst)
    // ) {
    //   errors.gst = "Invalid GST Number";
    // }

    if (gst.trim() !== "" && !/^[0-9A-Z]{15}$/.test(gst.trim())) {
    errors.gst = "GST Number must be 15 characters";
    }

    if (!address.trim()) errors.address = "Address is required";
    // if (!accountName.trim()) errors.accountName = "Account Name is required";
    // if (!bankName.trim()) errors.bankName = "Bank Name is required";

    // if (!accountNumber.trim()) {
    //   errors.accountNumber = "Account Number is required";
    // } else if (!/^[0-9]{9,18}$/.test(accountNumber)) {
    //   errors.accountNumber = "Invalid Account Number (9–18 digits)";
    // }

    if (accountNumber.trim() !== "" && !/^[0-9]{9,18}$/.test(accountNumber.trim())) {
    errors.accountNumber = "Invalid Account Number";
    }

    // if (!ifsc.trim()) {
    //   errors.ifsc = "IFSC is required";
    // } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc)) {
    //   errors.ifsc = "Invalid IFSC Code";
    // }
    if (ifsc.trim() !== "" && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc.trim())) {
    errors.ifsc = "Invalid IFSC Code";
    }

    if (!state || !state.trim()) {
    errors.state = "State is required";
    }

    if (upiId.trim() !== "" && !/^[\w.-]+@[\w]+$/.test(upiId.trim())) {
    errors.upiId = "Invalid UPI ID";
    }

    setErrors(errors);
    return errors;
  };

  //  Focus first invalid input + move indicator + scroll properly
  const focusFirstError = (errorMap) => {
    const focusMap = {
      shopName: { ref: shopNameRef, section: "business", sectionRef: businessRef },
      gst: { ref: gstRef, section: "business", sectionRef: businessRef },
      address: { ref: addressRef, section: "business", sectionRef: businessRef },
      accountName: { ref: accountNameRef, section: "payment", sectionRef: paymentRef },
      bankName: { ref: bankNameRef, section: "payment", sectionRef: paymentRef },
      accountNumber: { ref: accountNumberRef, section: "payment", sectionRef: paymentRef },
      ifsc: { ref: ifscRef, section: "payment", sectionRef: paymentRef },
      state: { ref: businessRef, section: "business", sectionRef: businessRef },
    };

    for (const [field, { ref, section, sectionRef }] of Object.entries(focusMap)) {
      if (errorMap[field]) {
        setActiveSection(section);
        scrollToSection(sectionRef, section);
        setTimeout(() => {
          ref.current?.focus();
        }, 500); // delay ensures scroll finishes before focus
        break;
      }
    }
  };

    const handleLogoUpload = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      setIsUploading(true);

           
      // Revoke old blob URL to prevent memory leak
        if (logoPreview) {
          URL.revokeObjectURL(logoPreview);
        }

      setLogoUri(file); // store File object

      setLogoPreview(URL.createObjectURL(file)); //  Create once and store

      setIsUploading(false);
    };

        // Clean up blob URL on unmount
    useEffect(() => {
      return () => {
        if (logoPreview) {
          URL.revokeObjectURL(logoPreview);
        }
      };
    }, [logoPreview]);

  //  Save settings function
  const handleSave = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      focusFirstError(validationErrors);
      return;
    }

    const payload = {
      shopName,
      gst,
      state,
      address,
      accountName,
      bankName,
      accountNumber,
      ifsc,
      upiId,
      paymentNote,
      invoicePrefix,
      nextInvoiceNumber: parseInt(nextInvoiceNumber) || 0,
      defaultGstPercentage: parseFloat(defaultGstPercentage) || 0,
      printSetting,
      businessLogo: logoUri,
    };

    try {
      const res = await dispatch(updateSettings(payload)).unwrap();
      AppToast.showSuccess(res.message);
    } catch (error) {
      AppToast.showError(error?.message || "Something went wrong");
    }
  };

  //  Intersection Observer for live indicator on scroll
    useEffect(() => {
      if (getSettingDataLoading) return; //  Don't run while skeleton is showing

      const options = { root: containerRef.current, threshold: 0.4 };
      const observer = new IntersectionObserver((entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) {
          const id = visible.target.getAttribute("data-section");
          setActiveSection(id);
        }
      }, options);

      const sections = [businessRef, paymentRef, invoiceRef];
      sections.forEach((ref) => ref.current && observer.observe(ref.current));

      return () => observer.disconnect();
    }, [getSettingDataLoading]); //  re-run when real content mounts

  //  UI styles
  const inputClass =
    "w-full px-3 py-2 rounded-lg text-sm bg-gray-100 border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";
  const sectionClass =
    "bg-white shadow rounded-lg p-4 sm:p-6 space-y-4 sm:space-y-6";

  const getTabClass = (key) =>
    `py-2 text-sm font-medium border-b-2 transition-all duration-300 ${
      activeSection === key
        ? "border-blue-600 text-blue-700 scale-105"
        : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
    } whitespace-nowrap`;

  return (
    <div
      ref={containerRef}
      className="h-[calc(100vh-64px)] overflow-y-auto bg-[#f9fafc] scroll-smooth"
    >
       {getSettingDataLoading ? (
      <SettingsSkeleton />
    ) : (
      <>{/* Header */}
      <div
        ref={headerRef}
        className="sticky top-0 z-10 bg-gray-100 border-b border-gray-300 shadow-sm"
      >
       
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3 sm:py-4">
          <div className="w-full sm:w-auto overflow-x-auto">
            <div className="flex gap-4 sm:gap-8 flex-wrap relative pr-6">
              <button
                onClick={() => scrollToSection(businessRef, "business")}
                className={getTabClass("business")}
              >
                Business Info
              </button>
              <button
                onClick={() => scrollToSection(paymentRef, "payment")}
                className={getTabClass("payment")}
              >
                Payment Details
              </button>
              <button
                onClick={() => scrollToSection(invoiceRef, "invoice")}
                className={getTabClass("invoice")}
              >
                Invoice Settings
              </button>
            </div>
          </div>

          <div className="w-full sm:w-auto flex justify-end">
            <button
              onClick={handleSave}
              disabled={settingLoading}
              className="px-6 py-2 bg-[#0a1628] text-white rounded-lg hover:bg-slate-700 transition font-medium text-sm shadow-sm whitespace-nowrap w-full sm:w-auto flex items-center justify-center gap-2"
            >
          {settingLoading ? <Spinner size={16} color="#ffff"/> : <FaSave /> }
              <span>Save Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-8xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12 pb-8">
        {/* -----------------------------------BUSINESS SECTION ---------------------------------*/}
        <section
          ref={businessRef}
          data-section="business"
          className={sectionClass}
        >
          <div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
              <FaBuilding className="w-5 h-5 text-blue-700" />
            </div>
            Business Information
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Update your business details and branding
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 sm:gap-5 mt-5">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Business Name *
              </label>
              <input
                ref={shopNameRef}
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="Enter business name"
                className={inputClass}
              />
              {/* Error message under input */}
               <p className="h-5 text-xs text-red-600 mt-1">{errors.shopName || ""}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                GST Number
              </label>
              <input
                ref={gstRef}
                type="text"
                value={gst}
                onChange={(e) => setGst(e.target.value)}
                placeholder="Enter GST number"
                className={inputClass}
              />
                  {/* Error message under input */}
               <p className="h-5 text-xs text-red-600 mt-1">{errors.gst || ""}</p>
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              State *
            </label>
            <States
              value={state}
              onChange={(e) => setState(e.target.value)}
              className={inputClass}
            />
            <p className="h-5 text-xs text-red-600 mt-1">{errors.state || ""}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Address *
            </label>
            <textarea
              ref={addressRef}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter business address"
              rows="3"
              className={`${inputClass} resize-none`}
            />
                {/* Error message under input */}
               <p className="h-5 text-xs text-red-600 mb-1">{errors.address || ""}</p>
          </div>

          {/* Business Logo */}
          
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Business Logo
          </label>
        <div
          className="rounded-lg py-6 px-4 bg-gray-100 flex flex-col items-center justify-center cursor-pointer border border-gray-300 hover:border-blue-400 transition"
          onClick={() => document.getElementById("logoUpload").click()}
        >
          <input
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleLogoUpload}
            id="logoUpload"
            hidden
          />
          <FaCloudUploadAlt className="text-blue-800 w-10 h-10 sm:w-12 sm:h-12 mb-2" />
          <p className="text-xs sm:text-sm text-gray-700 text-center">
            Drag & drop or{" "}
            <span className="font-medium text-blue-600">browse</span> to upload
          </p>
          <p className="text-xs text-gray-500 mt-1">
            PNG, JPG, or JPEG (max 5MB)
          </p>

          {/* Filename */}
          {logoUri && (
            <p className="mt-2 text-green-700 font-medium text-xs sm:text-sm text-center break-all px-2">
              Uploaded: {logoUri.name}
            </p>
          )}

          {/* Image Preview */}
          {logoUri && (
            <img
               src={logoPreview}
              alt="Logo Preview"
              className="w-24 h-24 object-cover rounded-full border border-gray-300 mt-2"
            />
          )}
        </div>
        </div>

        </section>

        {/*------------------------ PAYMENT SECTION--------------------------- */}
        <section
          ref={paymentRef}
          data-section="payment"
          className={sectionClass}
        >
          <div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
              <FaCreditCard className="w-5 h-5 text-blue-700" />
            </div>
            Bank and Payment Details
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Configure your bank account and payment information.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 sm:gap-5 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Account Holder Name
              </label>
              <input
                ref={accountNameRef}
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                placeholder="e.g., Rahul Sharma"
                className={inputClass}
              />
                  {/* Error message under input */}
               <p className="h-5 text-xs text-red-600 mt-1">{errors.accountName || ""}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Bank Name
              </label>
              <input
                ref={bankNameRef}
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="e.g., State Bank of India"
                className={inputClass}
              />
                  {/* Error message under input */}
               <p className="h-5 text-xs text-red-600 mt-1">{errors.bankName || ""}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2  sm:gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Account Number
              </label>
              <input
                ref={accountNumberRef}
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="Enter account number"
                className={inputClass}
              />
                  {/* Error message under input */}
               <p className="h-5 text-xs text-red-600 mt-1">{errors.accountNumber || ""}</p>
            </div>

            {/* IFSC code */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                IFSC Code
              </label>
              <input
                ref={ifscRef}
                type="text"
                value={ifsc}
                onChange={(e) => setIfsc(e.target.value)}
                placeholder="e.g., SBIN0001234"
                className={inputClass}
              />
                  {/* Error message under input */}
               <p className="h-5 text-xs text-red-600 mt-1">{errors.ifsc || ""}</p>
            </div>
          </div> 

            {/* upi id */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              UPI ID
            </label>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="yourname@upi"
              className={inputClass}
            />
            <p className="h-5 text-xs text-red-600 mt-1">{errors.upiId || ""}</p>
          </div>

         {/* payment note */}
          <div className="mt-5">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Payment Note
            </label>
            <textarea
              value={paymentNote}
              onChange={(e) => setPaymentNote(e.target.value)}
              placeholder="Add any payment instructions or notes"
              rows="3"
              className={`${inputClass} resize-none`}
            />
          </div>
          </div>
        </section>

        {/*-------------------------- INVOICE SECTION----------------------------------- */}
        <section
          ref={invoiceRef}
          data-section="invoice"
          className={sectionClass}
        >
          <div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
              <FaFileInvoice className="w-5 h-5 text-blue-700" />
            </div>
            Invoice Settings
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Customize your invoice preferences and defaults.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Invoice Prefix
              </label>
              <input
                type="text"
                value={invoicePrefix}
                onChange={(e) => setInvoicePrefix(e.target.value)}
                placeholder="e.g., INV"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Next Invoice Number
              </label>
              <input
                type="number"
                value={nextInvoiceNumber}
                onChange={(e) => setNextInvoiceNumber(e.target.value)}
                placeholder="Enter next invoice number"
                className={inputClass}
              />
            </div>
          </div>

          {/* Default GST and Print Paper Size */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mt-5">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Default GST (%)
              </label>
              <input
                type="number"
                value={defaultGstPercentage}
                onChange={(e) => setDefaultGstPercentage(e.target.value)}
                placeholder="Enter default GST percentage"
                className={inputClass}
              />
            </div>

            {/* Print Paper Size Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Print Paper Size
              </label>
              <Dropdown
          name="paperSize"
          value={printSetting}
          onChange={(selectedValue) => setPrintSetting(selectedValue)}
          options={["A4", "A3", "80mm Thermal", "58mm Thermal"]}
          placeholder="Select Paper Size"
        />
       </div>
        </div>
        </div>
        </section>

      </div>
      </>
      )}
    </div>
    
  );
}

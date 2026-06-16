import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaUndo,
  FaSearch,
  FaTrash,
  FaCalendarAlt,
  FaClipboardList,
  FaFileInvoice,
  FaCamera,
  FaChevronRight,
  FaTag ,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import State from "../../../components/State";
import CustomerSuggestion from "../../../components/CustomerSuggestion";
import ScannerPopup from "../../../components/ScannerPopup";
import PrintQuotationDialog from "../../../components/PrintQuotationDialog";
import {
  fetchCustomersByMobileNumber,
  fetchProductByIds,
  createQuotation,
} from "../quotationThunk";
import appToast from "../../../services/toastService";
import Spinner from "../../../components/Spinner";
import InteriorQuotation from "./InteriorQuotation";

// Initial state
const createInitialCustomerState = () => ({
  name: "",
  phone: "",
  email: "",
  gst: "",
  state: "",
  pincode: "",
  address: "",
  searchPhone: "",
});

const createInitialQuotationState = () => ({
  validityStart:  new Date().toISOString().slice(0, 10),
  validityEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  .toISOString()
  .slice(0, 10),
  generatedDate: new Date().toISOString().slice(0, 10),
});

const Quotation = () => {
  const dispatch = useDispatch();
  const { createQuotationLoading,fetchedProductLoading } = useSelector((state) => state.quotation);
  const [viewMode, setViewMode] = useState("quotation"); 
    
  // Customer state
  const [customer, setCustomer] = useState(createInitialCustomerState);
  const [quotationDates, setQuotationDates] = useState(
    createInitialQuotationState
  );
  const [isCustomerFetched, setIsCustomerFetched] = useState(false);

  // Search state
  const [customerSuggestions, setCustomerSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  // Product state
  const [products, setProducts] = useState([]);
  const [productQuantities, setProductQuantities] = useState({});
  const [productPrices, setProductPrices] = useState({});
  const [productGstPercentages, setProductGstPercentages] = useState({});
  const [productUpdates, setProductUpdates] = useState({});
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [manualProductSearch, setManualProductSearch] = useState("");

  const [searchProductSuggestion, setSearchProductSuggestion] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");

  const debounceTimer = useRef(null);

  //  Separate loading states for manual add and barcode scan
  const [manualAddLoading, setManualAddLoading] = useState(false);
  const [barcodeAddLoading, setBarcodeAddLoading] = useState(false);

  // other states
  const [showScanner, setShowScanner] = useState(false);
  const [taxType, setTaxType] = useState("inclusive");
  const [errors, setErrors] = useState({});
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [quotationDataToPrint, setQuotationDataToPrint] = useState(null);
  const [quotationCreated, setQuotationCreated] = useState(false);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout) clearTimeout(debounceTimeout);
    };
  }, [debounceTimeout]);

  // Helper function to calculate display price based on tax type
  const getDisplayPrice = useCallback(
    (productId, basePrice) => {
      const gstPercentage =
        productGstPercentages[productId] ??
        products.find((p) => p.productId === productId)?.gst ??
        0;

      if (taxType === "inclusive") {
        // show normal price
        return basePrice;
      } else {
        // show total including gst for exclusive
        return basePrice * (1 + gstPercentage / 100);
      }
    },
    [taxType, productGstPercentages, products]
  );

  // Customer handlers
  const handleCustomerFieldChange = useCallback(
    (field, value) => {
      setCustomer((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    },
    [errors]
  );

  const handleQuotationDateChange = useCallback(
    (field, value) => {
      setQuotationDates((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    },
    [errors]
  );

  // Debounced customer search
  const debouncedFetchCustomer = useCallback(
    (phoneNumber) => {
      if (debounceTimeout) clearTimeout(debounceTimeout);

      const newTimeout = setTimeout(async () => {
        if (phoneNumber?.trim().length >= 3) {
          setIsLoadingCustomers(true);
          try {
            const result = await dispatch(
              fetchCustomersByMobileNumber(phoneNumber)
            ).unwrap();
            setCustomerSuggestions(result.data || []);
            setShowSuggestions(result.data?.length > 0);

            // Add this toast for no results
            if (!result.data || result.data.length === 0) {
              appToast.showError("No customers found with this phone number");
            }
          } catch (error) {
            console.error("Error fetching customer data:", error);
            setCustomerSuggestions([]);
            setShowSuggestions(false);
          } finally {
            setIsLoadingCustomers(false);
          }
        } else {
          setCustomerSuggestions([]);
          setShowSuggestions(false);
          setIsLoadingCustomers(false);
        }
      }, 800);

      setDebounceTimeout(newTimeout);
    },
    [dispatch, debounceTimeout]
  );

  const handleSearchPhoneChange = useCallback(
    (phoneNumber) => {
      handleCustomerFieldChange("searchPhone", phoneNumber);
      if (phoneNumber.length === 0) {
        setShowSuggestions(false);
        setCustomerSuggestions([]);
      }
      debouncedFetchCustomer(phoneNumber);
    },
    [handleCustomerFieldChange, debouncedFetchCustomer]
  );

  const handleCustomerSelect = useCallback((selectedCustomer) => {
    setCustomer({
      ...createInitialCustomerState(),
      name: selectedCustomer.fullName || "",
      phone: selectedCustomer.phone,
      email: selectedCustomer.email,
      gst: selectedCustomer.gstNumber,
      state: selectedCustomer.state,
      pincode: selectedCustomer.pinCode,
      address: selectedCustomer.fullAddress || "",
    });
    setShowSuggestions(false);
    setErrors({});
    setIsCustomerFetched(true);
  }, []);

  // Product handlers
  const addProductToState = (productData) => {
    const productId = productData._id;

 

    // Check if product already exists
    if (selectedProducts.includes(productId)) {
      appToast.showInfo("Product already added to quotation");
      return false;
    }

    // Update selected product IDs
    setSelectedProducts((prev) => [...prev ,productId ]);

    // Update quantities
    setProductQuantities((prev) => ({
      ...prev,
      [productId]: 1,
    }));

    // Update prices
    setProductPrices((prev) => ({
      ...prev,
      [productId]: productData.price,
    }));

    // Update GST
    setProductGstPercentages((prev) => ({
      ...prev,
      [productId]: productData.gst,
    }));

    // Update price/gst change flags
    setProductUpdates((prev) => ({
      ...prev,
      [productId]: {
        priceChanged: false,
        gstChanged: false,
      },
    }));

    // Add product to list
    setProducts((prev) => [
      ...prev,
      {
        productId,
        quantity: 1,
        price: productData.price,
        gst: productData.gst,
        updates: { priceChanged: false, gstChanged: false },
        productName: productData.productName,
        hsnOrSac: productData.hsnOrSac,
        description: productData.description,
      },
      
    ]);

    return true;
  };

  //  accepts setLoadingState parameter to control which loading state to update
  const handleProductSearch = async (formatted) => {
    try {
      console.log("handle seatch called");
      const result = await dispatch(fetchProductByIds(formatted)).unwrap();
      console.log(result.data);

      if (result.length > 0) {
        console.log("greater");
        setSearchProductSuggestion(result);
      } else {
        setSearchProductSuggestion([]);
      }
    } catch (error) {
      appToast.showError(error.error);
      // console.log(error.error);
    }
  };

  //debounce for handle productsearch
  const debouncefunctionSearch = (func, delay) => {
    return (...args) => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);

      debounceTimer.current = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const debounceSearch = useMemo(
    () => debouncefunctionSearch(handleProductSearch, 800),
    []
  );

  const handleManualProductAdd = async (id) => {
    // console.log("id from hn", id);
    // setManualSearchLoading(true);
    try {
      let result;
      if (id) {
        result = searchProductSuggestion.find((item) => item._id == id);
      } else {
        let found = await dispatch(
          fetchProductByIds(manualProductSearch)
        ).unwrap();
        result = found[0];
      }
      // console.log(result);
      if (result) {
        const productAdded = addProductToState(result);
        if (productAdded) {
          setManualProductSearch("");
          setSearchProductSuggestion([]);

          appToast.showInfo(`${result.productName} added to invoice`);
        }
      }
    } catch (error) {
      appToast.showError("No product found with that ID");
    } finally {
      // setManualSearchLoading(false);
    }
  };

  const updateProductQuantity = useCallback(
    (productId, delta) => {
      setProductQuantities((prev) => {
        const newQty = Math.max((prev[productId] || 0) + delta, 0);

        if (newQty > 0 && !selectedProducts.includes(productId)) {
          setSelectedProducts((prevSelected) => [...prevSelected, productId]);
        } else if (newQty === 0 && selectedProducts.includes(productId)) {
          setSelectedProducts((prevSelected) =>
            prevSelected.filter((id) => id !== productId)
          );
        }

        return { ...prev, [productId]: newQty };
      });
    },
    [selectedProducts]
  );

  const handlePriceChange = useCallback(
    (productId, value) => {
      const price = value === "" ? 0 : parseFloat(value) || 0;
      setProductPrices((prev) => ({
        ...prev,
        [productId]: value === "" ? "" : price,
      }));

      setProducts((prev) =>
        prev.map((product) =>
          product.productId === productId ? { ...product, price } : product
        )
      );

      setProductUpdates((prev) => ({
        ...prev,
        [productId]: {
          ...prev[productId],
          priceChanged:
            price !== products.find((p) => p.productId === productId)?.price,
        },
      }));
    },
    [products]
  );

  const handleGstChange = useCallback(
    (productId, value) => {
      let gstValue = value === "" ? 0 : parseFloat(value) || 0;
      if (gstValue > 100) gstValue = 100;
      setProductGstPercentages((prev) => ({
        ...prev,
        [productId]: value === "" ? "" : gstValue,
      }));

      setProducts((prev) =>
        prev.map((product) =>
          product.productId === productId
            ? { ...product, gst: gstValue }
            : product
        )
      );

      setProductUpdates((prev) => ({
        ...prev,
        [productId]: {
          ...prev[productId],
          gstChanged:
            gstValue !== products.find((p) => p.productId === productId)?.gst,
        },
      }));
    },
    [products]
  );

  const handleDeleteProduct = useCallback((productId) => {
    setSelectedProducts((prev) => prev.filter((id) => id !== productId));
    setProducts((prev) =>
      prev.filter((product) => product.productId !== productId)
    );
    setProductQuantities((prev) => {
      const { [productId]: _, ...rest } = prev;
      return rest;
    });
    setProductPrices((prev) => {
      const { [productId]: _, ...rest } = prev;
      return rest;
    });
    setProductGstPercentages((prev) => {
      const { [productId]: _, ...rest } = prev;
      return rest;
    });
    setProductUpdates((prev) => {
      const { [productId]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  // Calculate totals (memoized)
  const totals = useMemo(() => {
    let subTotal = 0;
    let totalGst = 0;

    selectedProducts.forEach((productId) => {
      const basePrice =
        productPrices[productId] ??
        products.find((p) => p.productId === productId)?.price ??
        0;
      const gstPercentage =
        productGstPercentages[productId] ??
        products.find((p) => p.productId === productId)?.gst ??
        0;
      const quantity = productQuantities[productId] || 0;

      const effectivePrice =
        taxType === "inclusive"
          ? basePrice / (1 + gstPercentage / 100)
          : basePrice;

      const lineTotal = effectivePrice * quantity;
      const gstAmount = (lineTotal * gstPercentage) / 100;

      subTotal += Number(lineTotal.toFixed(2));
      totalGst += Number(gstAmount.toFixed(2));
    });

    return {
      subTotal,
      totalGst,
      grandTotal: Number((subTotal + totalGst).toFixed(2)),
    };
  }, [
    selectedProducts,
    productPrices,
    productGstPercentages,
    productQuantities,
    products,
    taxType,
  ]);

  // Validation
  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!customer.name.trim()) newErrors.name = "Name is required";
    if (!customer.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^\d{10}$/.test(customer.phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }
    if (!customer.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(customer.email)) {
      newErrors.email = "Email is invalid";
    }
    if (customer.gst.trim() && !/^[0-9A-Z]{15}$/.test(customer.gst.trim())) {
      newErrors.gst = "GST Number must be 15 characters";
    }
    // if (!customer.state.trim()) newErrors.state = "State is required";
    // if (!customer.pincode.trim()) {
    //   newErrors.pincode = "Pincode is required";
    // } else if (!/^\d{6}$/.test(customer.pincode)) {
    //   newErrors.pincode = "Pincode must be 6 digits";
    // }
    if (customer.pincode.trim() && !/^\d{6}$/.test(customer.pincode.trim())) {
      newErrors.pincode = "Pincode must be 6 digits";
    }
    if (selectedProducts.length === 0) {
      newErrors.products = "Please select at least one product";
    } else {
      const hasValidQuantity = selectedProducts.some(
        (productId) => productQuantities[productId] > 0
      );
      if (!hasValidQuantity) {
        newErrors.products =
          "Please add quantity for at least one selected product";
      }
    }

    if (!quotationDates.generatedDate)
      newErrors.generatedDate = "Generated date is required";
    if (!quotationDates.validityStart)
      newErrors.validityStart = "Validity start date is required";
    if (!quotationDates.validityEnd) {
      newErrors.validityEnd = "Validity end date is required";
    } else if (
      quotationDates.validityStart &&
      new Date(quotationDates.validityEnd) <=
        new Date(quotationDates.validityStart)
    ) {
      newErrors.validityEnd =
        "Validity end date must be greater than start date";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstErrorKey = Object.keys(newErrors)[0];
      const el = document.querySelector(`[name="${firstErrorKey}"]`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.focus();
      }
    }

    return Object.keys(newErrors).length === 0;
  }, [customer, quotationDates, selectedProducts, productQuantities]);

  // Form actions
  const handleReset = useCallback(() => {
    setCustomer(createInitialCustomerState);
    setErrors({});
    setCustomerSuggestions([]);
    setShowSuggestions(false);
    setIsCustomerFetched(false);
    appToast.showInfo("Form data cleared successfully", "info");
  }, []);

  const handleClear = useCallback(() => {
    if (window.confirm("Are you sure you want to clear all data?")) {
    setCustomer(createInitialCustomerState);
    setQuotationDates(createInitialQuotationState);
    setManualProductSearch("");
    setProductQuantities({});
    setProductPrices({});
    setProductGstPercentages({});
    setSelectedProducts([]);
    setProducts([]);
    setProductUpdates({});
    setErrors({});
    setCustomerSuggestions([]);
    setShowSuggestions(false);
    setIsCustomerFetched(false);
    setIsPrintDialogOpen(null);
    setQuotationDataToPrint(null);
    setQuotationCreated(false);
    appToast.showSuccess("All data cleared!");
}}, []);

  const handleCreateQuotation = useCallback(async () => {
    if (!validateForm()) {
      const firstErrorKey = Object.keys(errors)[0];
      if (firstErrorKey) {
        const el = document.querySelector(`[name="${firstErrorKey}"]`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.focus();
        }
      }
      appToast.showWarning(
        "Please fix the validation errors before submitting"
      );
      return; // stop execution if invalid
    }

    try {
      const finalProducts = products.map((product) => ({
        productId: product.productId,
        quantity: productQuantities[product.productId] || 0,
        price: productPrices[product.productId] ?? product.price,
        gst: productGstPercentages[product.productId] ?? product.gst,
        updates: productUpdates[product.productId] || {
          priceChanged: false,
          gstChanged: false,
        },
      }));

      const selectedCustomer = customerSuggestions.find(
        (c) => c.phone === customer.phone
      );

      const formatDateForAPI = (date) =>
        date ? new Date(date).toISOString() : null;

      const payload = {
        customerId: selectedCustomer?._id || null,
        customerName: customer.name,
        customerPhone: customer.phone,
        customerEmail: customer.email,
        customerGst: customer.gst,
        customerState: customer.state,
        customerPin: customer.pincode,
        customerAddress: customer.address,
        gstType: taxType,
        quotationDate: formatDateForAPI(quotationDates.generatedDate),
        validityStartDate: formatDateForAPI(quotationDates.validityStart),
        validityEndDate: formatDateForAPI(quotationDates.validityEnd),
        products: finalProducts,
      };

      const res = await dispatch(createQuotation(payload)).unwrap();
      // Success message
      appToast.showSuccess(res.message || "Quotation created successfully");
      setQuotationCreated(true);
      setQuotationDataToPrint(res.data);
    } catch (err) {
      if (
        err.error !==
        "Subscription expired. Please renew to continue using the service."
      ) {
        appToast.showError(err.error || "Failed to create quotation");
      } else {
        // Show subscription error as warning
        appToast.showError(err.error);
      }
    }
  }, [
    validateForm,
    products,
    productQuantities,
    productPrices,
    productGstPercentages,
    productUpdates,
    customerSuggestions,
    customer,
    taxType,
    quotationDates,
    dispatch,
    errors,
  ]);
  // FIXED: Uses barcodeAddLoading state
  const handleDetected = async (code) => {
  if (!code || barcodeAddLoading) return;

  try {
    const result = await dispatch(fetchProductByIds(code)).unwrap();
    // console.log("Scanned result:", result);
    if (result && result.length > 0) {
      const productAdded = addProductToState(result[0]);
      if (productAdded) {
        appToast.showInfo(`${result[0].productName} added to Quotation`);
      }

      setShowScanner(false);
    } else {
      appToast.showError("Product not found");
    }
  } catch (error) {
      appToast.showError(error.error || "Failed to fetch product from scanned code");
    console.log("Error adding scanned product:", error);
  }
};

  const handlePrintQuotation = useCallback(() => {
    if (quotationDataToPrint) {
      setIsPrintDialogOpen(true);
    } else {
      appToast.showError("Please generate a quotation first");
    }
  }, [quotationDataToPrint]);

  if (viewMode === "interior") {
  return <InteriorQuotation />;
}
  return (
    <div className="p-3 sm:p-6 bg-gray-50 min-h-screen space-y-6">
      <div className="mb-3">
        <div className="flex items-center bg-white p-3 rounded-lg shadow-sm">
          <div className=" flex gap-2">
            <button
              onClick={() => setViewMode("quotation")}
              className={`relative flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200
                ${
                  viewMode === "quotation"
                    ? "text-gray-800 bg-gradient-to-br from-white to-[#f0f4ff] shadow-md border-b-2 border-blue-500"
                    : "text-gray-700 bg-white hover:bg-gray-100 border-b-2 border-transparent"
                }`}
            >
              Quotation
            </button>

            <button
              onClick={() => setViewMode("interior")}
              className={`relative flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200
                ${
                  viewMode === "interior"
                    ? "text-gray-800 bg-gradient-to-br from-white to-[#f0f4ff] shadow-md border-b-2 border-blue-500"
                    : "text-gray-700 bg-white hover:bg-gray-100 border-b-2 border-transparent"
                }`}
            >
              Interior Quotation
            </button>

          </div>
        </div>
      </div>
      
      {/* CUSTOMER INFORMATION */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
              <FaUser className="text-lg" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                Customer Information
              </h2>
              <p className="text-sm text-gray-500">Enter customer details</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              {isLoadingCustomers ? (
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Spinner size={16} color="#9CA3AF" />
                </div>
              ) : (
                <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              )}

              <input
                type="number"
                placeholder="Search by mobile number"
                value={customer.searchPhone}
                // onChange={(e) => handleSearchPhoneChange(e.target.value)}
                onChange={(e) => {
                  let val = e.target.value.replace(/\D/g, "");
                  if (val.length > 10) val = val.slice(0, 10);
                  handleSearchPhoneChange(val);
                }}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onFocus={() =>
                  customerSuggestions.length > 0 && setShowSuggestions(true)
                }
                maxLength={10}
                className="w-full border border-blue-200 rounded-md pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none
                [&::-webkit-outer-spin-button]:appearance-none 
                    [&::-webkit-inner-spin-button]:appearance-none"
              />

              <CustomerSuggestion
                showSuggestions={showSuggestions && !isLoadingCustomers}
                customerSuggestions={customerSuggestions}
                onCustomerSelect={handleCustomerSelect}
                maxHeight={150}
              />
            </div>

            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-2 text-red-600 border border-red-200 hover:bg-red-50 px-4 py-2 rounded-md transition text-sm w-full sm:w-auto"
            >
              <FaUndo />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* customer information form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Name *
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-gray-400" />
              <input
                name="name"
                type="text"
                placeholder="Enter customer name"
                value={customer.name}
                // onChange={(e) =>
                //   handleCustomerFieldChange("name", e.target.value)
                // }
                onChange={(e) => {
                    const value = e.target.value;
                    const formatted = value.charAt(0).toUpperCase() + value.slice(1);
                    handleCustomerFieldChange("name", formatted);
                  }}
                disabled={isCustomerFetched}
                title={
                  isCustomerFetched &&
                  "Locked because a saved customer is selected. Click Reset to edit."
                }
                className={`w-full border ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } 
                  rounded-md pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none 
                  ${isCustomerFetched ? "bg-gray-100 " : ""}`}
              />
            </div>
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <div className="relative">
              <FaPhone className="absolute left-3 top-3 text-gray-400" />
              <input
                name="phone"
                type="number"
                placeholder="Enter 10-digit phone number"
                value={customer.phone}
                // onChange={(e) =>
                //   handleCustomerFieldChange("phone", e.target.value)
                // }
                onChange={(e) => {
                  let val = e.target.value.replace(/\D/g, "");
                  if (val.length > 10) val = val.slice(0, 10);
                   handleCustomerFieldChange("phone", val);
                }}
                maxLength={10}
                disabled={isCustomerFetched}
                title={
                  isCustomerFetched &&
                  "Locked because a saved customer is selected. Click Reset to edit."
                }
                className={`w-full border ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                } 
                rounded-md pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none
                ${isCustomerFetched ? "bg-gray-100 " : ""}
                [&::-webkit-outer-spin-button]:appearance-none 
                    [&::-webkit-inner-spin-button]:appearance-none`}
              />
            </div>
            {errors.phone && (
              <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
              <input
                name="email"
                type="email"
                placeholder="customer@example.com"
                value={customer.email}
                onChange={(e) =>
                  handleCustomerFieldChange("email", e.target.value)
                }
                disabled={isCustomerFetched}
                title={
                  isCustomerFetched &&
                  "Locked because a saved customer is selected. Click Reset to edit."
                }
                className={`w-full border ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-md pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none
                 ${isCustomerFetched ? "bg-gray-100 " : ""}`}
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GST Number
            </label>
            <div className="relative">
             <FaTag className="absolute left-3 top-3 text-gray-400" />
            <input
              name="gst"
              type="text"
              placeholder="22AAAAA0000A1Z5"
              value={customer.gst}
              onChange={(e) =>
                handleCustomerFieldChange("gst", e.target.value.toUpperCase())
              }
              maxLength={15}
              disabled={isCustomerFetched}
              title={
                isCustomerFetched &&
                "Locked because a saved customer is selected. Click Reset to edit."
              }
              className={`w-full border ${
                errors.gst ? "border-red-500" : "border-gray-300"
              }  rounded-md pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none
              ${isCustomerFetched ? "bg-gray-100 " : ""}`}
            />
            </div>
            {errors.gst && (
              <p className="text-xs text-red-500 mt-1">{errors.gst}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State
            </label>
            <State
              name="state"
              value={customer.state}
              onChange={(e) =>
                handleCustomerFieldChange("state", e.target.value)
              }
              disabled={isCustomerFetched}
              title={
                isCustomerFetched &&
                "Locked because a saved customer is selected. Click Reset to edit."
              }
              className={`w-full border ${
                errors.state ? "border-red-500" : "border-gray-300"
              } rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none
              ${isCustomerFetched ? "bg-gray-100 " : ""}`}
            />
            {errors.state && (
              <p className="text-xs text-red-500 mt-1">{errors.state}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pincode
            </label>
            <div className="relative">
              <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
              <input
                name="pincode"
                type="number"
                placeholder="Enter 6-digit pincode"
                value={customer.pincode}
                // onChange={(e) =>
                //   handleCustomerFieldChange("pincode", e.target.value)
                // }
                onChange={(e) => {
                  let val = e.target.value.replace(/\D/g, "");
                  if (val.length > 6) val = val.slice(0, 6);
                  handleCustomerFieldChange("pincode", val);
                }}
                maxLength={6}
                disabled={isCustomerFetched}
                title={
                  isCustomerFetched &&
                  "Locked because a saved customer is selected. Click Reset to edit."
                }
                className={`w-full border ${
                  errors.pincode ? "border-red-500" : "border-gray-300"
                } rounded-md pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none
                ${isCustomerFetched ? "bg-gray-100 " : ""}
                [&::-webkit-outer-spin-button]:appearance-none 
                    [&::-webkit-inner-spin-button]:appearance-none`}
              />
            </div>
            {errors.pincode && (
              <p className="text-xs text-red-500 mt-1">{errors.pincode}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              name="address"
              placeholder="Enter complete address"
              rows={2}
              value={customer.address}
              onChange={(e) =>
                handleCustomerFieldChange("address", e.target.value)
              }
              disabled={isCustomerFetched}
              title={
                isCustomerFetched &&
                "Locked because a saved customer is selected. Click Reset to edit."
              }
              className={`w-full border ${
                errors.address ? "border-red-500" : "border-gray-300"
              } rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none
              ${isCustomerFetched ? "bg-gray-100 " : ""}`}
            />
            {/* {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>} */}
          </div>
        </div>
      </div>

      {/* ADD PRODUCTS */}
      <div
        className="shadow-sm rounded-xl border border-blue-100 p-4 sm:p-6"
        style={{
          background: "linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)",
        }}
      >
        <div className="flex items-center space-x-3 mb-3">
          <div
            className="w-10 h-10 flex items-center justify-center text-blue-600 rounded-full shadow-sm"
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #e3f2fd 100%)",
            }}
          >
            <FaSearch className="text-lg" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">
              Add Products
            </h2>
            <p className="text-sm text-gray-500">Search products to add</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full relative">
          <div className="relative flex-1">
            {fetchedProductLoading ? (
                <div className="absolute left-3 top-3">
                <Spinner size={16} color="gray" />
              </div>
              ) : (
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
              )}
            <input
              type="text"
              value={manualProductSearch}
              onChange={(e) => {
                let formatted = e.target.value;

                formatted = formatted.replace(/[^A-Za-z0-9\s]/g, "");

                if (formatted.length > 0) {
                  formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);
                }
                setManualProductSearch(formatted);
                if (formatted.length <= 0) {
                  if (debounceTimer.current) clearTimeout(debounceTimer.current);
                  setSearchProductSuggestion([]);
                } else {
                  debounceSearch(formatted);
                }
              }}
              placeholder="Search by Product ID or Name"
              className="w-full border border-gray-300 rounded-md pl-9 pr-3 py-2 text-sm 
                   focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />

            {/*  Suggestions Dropdown */}
            {searchProductSuggestion.length > 0 && (
              <div
                className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl border border-gray-200 shadow-xl 
                     divide-y divide-gray-100 overflow-hidden z-50 max-h-72 overflow-y-auto transition-all duration-300"
              >
                {searchProductSuggestion.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => handleManualProductAdd(item._id)}
                    className="flex justify-between items-center px-5 py-3 cursor-pointer 
                         hover:bg-blue-50 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex flex-col">
                      <h3 className="text-sm font-semibold text-gray-800">
                        {item.productName}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Product ID: {item.productId}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Description: {item.description}
                      </p>
                    </div>
                    <div className="flex text-right">
                      <span className="text-sm font-semibold text-green-600">
                        ₹{item.price}
                      </span>
                    <FaChevronRight className="text-gray-400 text-xs ml-2 mt-1" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* FIXED: Scan Barcode Button - uses barcodeAddLoading */}
          <button
            onClick={() => setShowScanner(true)}
            disabled={barcodeAddLoading}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-sm text-gray-700 transition w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-4 h-4 flex items-center justify-center">
              {barcodeAddLoading ? (
                <Spinner size={16} color="#4B5563" />
              ) : (
                <FaCamera className="text-gray-500" />
              )}
            </div>
            <span>Scan Barcode</span>
          </button>

          {/* FIXED: Add Product Button - uses manualAddLoading */}
          {/* <button
            onClick={()=>handleManualProductAdd()}
            disabled={manualAddLoading}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#0a1628] hover:bg-gray-700 text-white rounded-md text-sm transition w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-4 h-4 flex items-center justify-center">
              {manualAddLoading ? (
                <Spinner size={16} color="#FFFFFF" />
              ) : (
                <span className="text-lg font-semibold">+</span>
              )}
            </div>
            <span>Add Product</span>
          </button> */}
        </div>

        {errors.products && (
          <p className="text-xs text-red-500 mt-2">{errors.products}</p>
        )}
      </div>

      {/* PRODUCT LIST */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-4 sm:p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
            <FaClipboardList className="text-lg" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">
              Product List *
            </h2>
            <p className="text-sm text-gray-500">
              {products.length} items added
            </p>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="sm:hidden space-y-3">
          {products.map((item) => (
            <div
              key={item.productId}
              className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1 min-w-0 pr-2">
                  <p className="font-medium text-gray-900 text-sm">
                    {item.productName}
                  </p>
                  <p className="text-gray-500 text-xs">{item.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div>
                  <span className="text-gray-500">HSN:</span>
                  <span className="ml-1 font-medium text-gray-900">
                    {item.hsnOrSac}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Price:</span>
                  <input
                    type="text"
                    value={productPrices[item.productId] ?? item.price}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "" || /^\d*\.?\d*$/.test(value)) {
                        handlePriceChange(
                          item.productId,
                          value === "" ? "" : value
                        );
                      }
                    }}
                    onBlur={(e) => {
                      if (e.target.value === "") {
                        handlePriceChange(item.productId, "0");
                      }
                    }}
                    className="ml-1 w-20 border border-gray-300 rounded px-2 py-0.5
                      bg-white text-xs focus:ring-2 focus:ring-blue-400 focus:outline-none
                      appearance-none"
                  />
                </div>
                <div>
                  <span className="text-gray-500">GST:</span>
                  <input
                    type="text"
                    value={productGstPercentages[item.productId] ?? item.gst}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === "" || /^\d*\.?\d*$/.test(value)) {
                        handleGstChange(
                          item.productId,
                          value === "" ? "" : value
                        );
                      }
                    }}
                    onBlur={(e) => {
                      if (e.target.value === "") {
                        handleGstChange(item.productId, "0");
                      }
                    }}
                    className="ml-1 w-16 border border-gray-300 rounded px-1"
                  />
                  {/* <select
                    value={
                      productGstPercentages[item.productId] ?? item.gst
                    }
                    onChange={(e) =>
                      handleGstChange(item.productId, Number(e.target.value))
                    }
                    className="ml-1 w-20 border border-gray-300 rounded px-2 py-0.5
                      bg-white text-xs focus:ring-2 focus:ring-blue-400 focus:outline-none
                      appearance-none"
                  >
                    <option value="0">0%</option>
                    <option value="5">5%</option>
                    <option value="18">18%</option>
                    <option value="40">40%</option>
                  </select> */}
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500">Line Total:</span>
                  <span className="ml-1 font-bold text-gray-900">
                    ₹
                    {(
                      getDisplayPrice(
                        item.productId,
                        productPrices[item.productId] || item.price
                      ) * (productQuantities[item.productId] || 0)
                    ).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateProductQuantity(item.productId, -1)}
                    className="px-2.5 py-1 border border-gray-300 rounded hover:bg-gray-100 text-sm"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="0"
                    value={productQuantities[item.productId] || 0}
                    onInput={(e) => {
                      if (
                        e.target.value.length > 1 &&
                        e.target.value.startsWith("0")
                      ) {
                        e.target.value = e.target.value.replace(/^0+/, "");
                      }
                    }}
                    onChange={(e) => {
                      const newValue = parseInt(e.target.value) || 0;
                      setProductQuantities((prev) => ({
                        ...prev,
                        [item.productId]: newValue,
                      }));
                      if (
                        newValue > 0 &&
                        !selectedProducts.includes(item.productId)
                      ) {
                        setSelectedProducts((prev) => [
                          ...prev,
                          item.productId,
                        ]);
                      } else if (newValue === 0) {
                        setSelectedProducts((prev) =>
                          prev.filter((id) => id !== item.productId)
                        );
                      }
                    }}
                    className="w-12 text-center border border-gray-300 rounded py-1 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                  <button
                    onClick={() => updateProductQuantity(item.productId, 1)}
                    className="px-2.5 py-1 border border-gray-300 rounded hover:bg-gray-100 text-sm"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => handleDeleteProduct(item.productId)}
                  className="text-red-600 bg-white shadow-sm hover:shadow-md hover:bg-red-50 px-3 py-1.5 rounded-lg flex items-center gap-1 text-sm transition"
                >
                  <FaTrash className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto border border-gray-100 rounded-lg max-h-[400px]">
          <table className="w-full text-sm text-left text-gray-700 border-collapse min-w-full">
            <thead className="bg-gray-100 text-gray-600 sticky top-0 z-10">
              <tr>
                <th className="px-3 py-3">Product</th>
                <th className="px-3 py-3">HSN</th>
                <th className="px-3 py-3">Price</th>
                <th className="px-3 py-3">GST %</th>
                <th className="px-3 py-3 text-center">Qty</th>
                <th className="px-3 py-3 text-right">Total</th>
                <th className="px-3 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((item) => (
                <tr key={item.productId} className="hover:bg-gray-50">
                  <td className="px-3 py-3">
                    <p className="font-medium text-gray-900">
                      {item.productName}
                    </p>
                    <p className="text-gray-500 text-xs">{item.description}</p>
                  </td>
                  <td className="px-3 py-3">{item.hsnOrSac}</td>
                  <td className="px-3 py-3">
                    <input
                      type="text"
                      value={productPrices[item.productId] ?? item.price}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || /^\d*\.?\d*$/.test(value)) {
                          handlePriceChange(
                            item.productId,
                            value === "" ? "" : value
                          );
                        }
                      }}
                      onBlur={(e) => {
                        if (e.target.value === "") {
                          handlePriceChange(item.productId, "0");
                        }
                      }}
                      className="w-24 border border-gray-300 rounded px-2 py-1"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <input
                      type="text"
                      value={productGstPercentages[item.productId] ?? item.gst}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "" || /^\d*\.?\d*$/.test(value)) {
                          handleGstChange(
                            item.productId,
                            value === "" ? "" : value
                          );
                        }
                      }}
                      onBlur={(e) => {
                        if (e.target.value === "") {
                          handleGstChange(item.productId, "0");
                        }
                      }}
                      className="w-16 border border-gray-300 rounded px-2 py-1"
                    />
                    {/* <select
                      value={
                        productGstPercentages[item.productId] ?? item.gst
                      }
                      onChange={(e) =>
                        handleGstChange(item.productId, Number(e.target.value))
                      }
                      className="w-16 border border-gray-300 rounded px-2 py-1
                        appearance-none"
                    >
                      <option value="0">0%</option>
                      <option value="5">5%</option>
                      <option value="18">18%</option>
                      <option value="40">40%</option>
                    </select> */}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() =>
                          updateProductQuantity(item.productId, -1)
                        }
                        className="px-2 py-1 border rounded hover:bg-gray-100"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={productQuantities[item.productId] || 0}
                        onInput={(e) => {
                          // Remove leading zeros immediately as user types
                          if (
                            e.target.value.length > 1 &&
                            e.target.value.startsWith("0")
                          ) {
                            e.target.value = e.target.value.replace(/^0+/, "");
                          }
                        }}
                        onChange={(e) => {
                          const newValue = parseInt(e.target.value) || 0;
                          setProductQuantities((prev) => ({
                            ...prev,
                            [item.productId]: newValue,
                          }));
                          if (
                            newValue > 0 &&
                            !selectedProducts.includes(item.productId)
                          ) {
                            setSelectedProducts((prev) => [
                              ...prev,
                              item.productId,
                            ]);
                          } else if (newValue === 0) {
                            setSelectedProducts((prev) =>
                              prev.filter((id) => id !== item.productId)
                            );
                          }
                        }}
                        className="w-14 text-center border border-gray-300 rounded py-1 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none
                        [&::-webkit-outer-spin-button]:appearance-none 
                    [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <button
                        onClick={() => updateProductQuantity(item.productId, 1)}
                        className="px-2 py-1 border rounded hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-right font-medium text-gray-900">
                    ₹
                    {(
                      getDisplayPrice(
                        item.productId,
                        productPrices[item.productId] || item.price
                      ) * (productQuantities[item.productId] || 0)
                    ).toFixed(2)}
                  </td>
                  <td className="px-3 py-3 text-center">
                    <button
                      onClick={() => handleDeleteProduct(item.productId)}
                      className="text-red-600 bg-white shadow-sm hover:shadow-md hover:bg-red-50 px-3 py-1.5 rounded-lg flex items-center gap-1 text-sm transition mx-auto"
                    >
                      <FaTrash className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* QUOTATION DETAILS + SUMMARY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quotation Details */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
              <FaCalendarAlt className="text-lg" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                Quotation Details
              </h2>
              <p className="text-sm text-gray-500">Set dates and tax type</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Generate Date *
              </label>
              <input
                name="generatedDate"
                type="date"
                value={quotationDates.generatedDate}
                onChange={(e) =>
                  handleQuotationDateChange("generatedDate", e.target.value)
                }
                className={`w-full border ${
                  errors.generatedDate ? "border-red-500" : "border-gray-300"
                } rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none`}
              />
              {errors.generatedDate && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.generatedDate}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Validity Start Date *
              </label>
              <input
                name="validityStart"
                type="date"
                value={quotationDates.validityStart}
                onChange={(e) =>
                  handleQuotationDateChange("validityStart", e.target.value)
                }
                className={`w-full border ${
                  errors.validityStart ? "border-red-500" : "border-gray-300"
                } rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none`}
              />
              {errors.validityStart && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.validityStart}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Validity End Date *
              </label>
              <input
                name="validityEnd"
                type="date"
                value={quotationDates.validityEnd}
                onChange={(e) =>
                  handleQuotationDateChange("validityEnd", e.target.value)
                }
                className={`w-full border ${
                  errors.validityEnd ? "border-red-500" : "border-gray-300"
                } rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none`}
              />
              {errors.validityEnd && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.validityEnd}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tax Type
              </label>
              <div className="flex flex-row sm:flex-row md:gap-4 sm:items-center sm:space-x-6 gap-4  text-sm space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="taxType"
                    value="inclusive"
                    checked={taxType === "inclusive"}
                    onChange={(e) => setTaxType(e.target.value)}
                    className="accent-blue-600"
                  />
                  <span>Tax Inclusive</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="taxType"
                    value="exclusive"
                    checked={taxType === "exclusive"}
                    onChange={(e) => setTaxType(e.target.value)}
                    className="accent-blue-600"
                  />
                  <span>Tax Exclusive</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
              <FaFileInvoice className="text-lg" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                Summary
              </h2>
              <p className="text-sm text-gray-500">Quotation totals</p>
            </div>
          </div>

          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium">₹{totals.subTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>GST Amount</span>
              <span className="text-green-600 font-medium">
                ₹{totals.totalGst.toFixed(2)}
              </span>
            </div>
            <div className="bg-blue-50 p-3 rounded-md flex justify-between font-semibold text-gray-800">
              <span>Grand Total</span>
              <span>₹{totals.grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <button
              onClick={handleCreateQuotation}
              disabled={createQuotationLoading || quotationCreated}
              className="w-full bg-[#0a1628] text-white py-2.5 rounded-md hover:bg-gray-700 transition text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {createQuotationLoading ? (
                <>
                  <Spinner size={16} color="#FFFFFF" />
                  <span>Generating...</span>
                </>
              ) : (
                "Generate Quotation"
              )}
            </button>

            <button
              onClick={handlePrintQuotation}
              disabled={!quotationDataToPrint}
              className="w-full border border-gray-600 text-gray-700 py-2.5 rounded-md hover:bg-gray-50 transition text-sm font-medium disabled:opacity-50"
            >
              Print Quotation
            </button>
            <button
              onClick={handleClear}
              className="w-full border border-gray-300 text-gray-500 py-2.5 rounded-md hover:bg-gray-50 transition text-sm font-medium"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      {showScanner && (
        <ScannerPopup
          onClose={() => setShowScanner(false)}
          onDetected={handleDetected}
        />
      )}

      <PrintQuotationDialog
        isOpen={isPrintDialogOpen}
        onClose={() => setIsPrintDialogOpen(false)}
        quotationData={quotationDataToPrint}
        isInteriorQuotation={false}
      />
    </div>
  );
};

export default Quotation;

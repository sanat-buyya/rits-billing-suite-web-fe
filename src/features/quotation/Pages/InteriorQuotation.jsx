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
  FaCalendarAlt,
  FaClipboardList,
  FaFileInvoice,
  FaTag,
  FaTrash,
  FaPlus,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import State from "../../../components/State";
import CustomerSuggestion from "../../../components/CustomerSuggestion";
import PrintQuotationDialog from "../../../components/PrintQuotationDialog";
import { fetchCustomersByMobileNumber } from "../quotationThunk";
import { createInteriorQuotation } from "../interiorQuotationThunk";
import appToast from "../../../services/toastService";
import Spinner from "../../../components/Spinner";
import Quotation from "./Quotation";

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
  validityStart: new Date().toISOString().slice(0, 10),
  validityEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10),
  generatedDate: new Date().toISOString().slice(0, 10),
});

const InteriorQuotation = () => {
  const dispatch = useDispatch();
  // const { createQuotationLoading } = useSelector((state) => state.quotation);
  const { interiorQuotationLoading, interiorQuotationSuccess, interiorQuotationError } = useSelector(
    (state) => state.interiorQuotation
  );
  const [viewMode, setViewMode] = useState("interior");
  
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

    // Other states
  const [taxType, setTaxType] = useState("inclusive");
  const [errors, setErrors] = useState({});
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [quotationDataToPrint, setQuotationDataToPrint] = useState(null);
  const [quotationCreated, setQuotationCreated] = useState(false);

  // Table state
  const [tableData, setTableData] = useState({
    columns: [
      { key: "product", label: "Product" },
      { key: "image", label: "Image" },
      { key: "price", label: "Price" },
      { key: "gst", label: "GST %" },
      { key: "qty", label: "Qty" },
      { key: "total", label: "Total" }
    ],
    rows: [
      {
        id: crypto.randomUUID(),
        cells: {
          product: "",
          image: null,
          price: "",
          gst: "0",
          qty: "",
          total: ""
        }
      }
    ]
  });
  // Gst dropdown options and column widths
  const GST_OPTIONS = [0, 5, 18, 40];
  const COLUMN_WIDTHS = {
  product: "min-w-[150px]",
  image: "w-[70px]",
  price: "w-[100px]",
  gst: "w-[100px]",
  qty: "w-[80px]",
  total: "w-[120px]",
};

// Default columns using for mobile view adding new columns
const DEFAULT_COLUMNS = ["product", "image", "price", "gst", "qty", "total"];

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout) clearTimeout(debounceTimeout);
    };
  }, [debounceTimeout]);

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

  // Table handlers
  const addColumn = () => {
    const key = `col_${Date.now()}`;
    setTableData(prev => ({
      columns: [...prev.columns, { key, label: "New Column" }],
      rows: prev.rows.map(r => ({
        ...r,
        cells: { ...r.cells, [key]: "" }
      }))
    }));
  };

  // Only allow removal of extra columns (not the default ones)
  const removeColumn = (key) => {
    const defaultKeys = ["product", "image", "price", "gst", "qty", "total"];
    if (defaultKeys.includes(key)) {
      appToast.showInfo("Default columns cannot be removed");
      return;
    }
    
    setTableData(prev => ({
      columns: prev.columns.filter(c => c.key !== key),
      rows: prev.rows.map(r => {
        const updated = { ...r.cells };
        delete updated[key];
        return { ...r, cells: updated };
      })
    }));
  };

  const addRow = () => {
    const emptyCells = {};
    tableData.columns.forEach(c => {
  if (c.key === "gst") {
    emptyCells[c.key] = 0;
  } else {
    emptyCells[c.key] = "";
  }
});
    setTableData(prev => ({
      ...prev,
      rows: [...prev.rows, { id: crypto.randomUUID(), cells: emptyCells }]
    }));
  };

  const removeRow = (rowId) => {
    if (tableData.rows.length <= 1) {
      appToast.showInfo("At least one row must remain");
      return;
    }
    
    setTableData(prev => ({
      ...prev,
      rows: prev.rows.filter(r => r.id !== rowId)
    }));
  };

  const updateCell = (rowId, colKey, value) => {
    setTableData(prev => ({
      ...prev,
      rows: prev.rows.map(r =>
        r.id === rowId
          ? { ...r, cells: { ...r.cells, [colKey]: value } }
          : r
      )
    }));
  };

  const handleImageUpload = (rowId, file) => {
    if (!file) return;
    
    const preview = URL.createObjectURL(file);
    updateCell(rowId, "image", { file, preview });
  };

  // Calculate totals from table data
  const totals = useMemo(() => {
  let subTotal = 0;
  let totalGst = 0;

  tableData.rows.forEach(row => {
    const price = parseFloat(row.cells.price) || 0;
    const gst = parseFloat(row.cells.gst) || 0;
    const qty = parseFloat(row.cells.qty) || 0;

    if (qty <= 0 || price <= 0) return;

    const lineAmount = price * qty;

    if (taxType === "exclusive") {
      // GST is added
      const gstAmount = (lineAmount * gst) / 100;
      subTotal += lineAmount;
      totalGst += gstAmount;
    } else {
      // Inclusive → GST already included → DO NOT APPLY
      subTotal += lineAmount;
    }
  });

  const grandTotal =
    taxType === "exclusive"
      ? subTotal + totalGst
      : subTotal;

  return {
    subTotal: Number(subTotal.toFixed(2)),
    totalGst: Number(totalGst.toFixed(2)),
    grandTotal: Number(grandTotal.toFixed(2)),
  };
}, [tableData, taxType]);

useEffect(() => {
  setTableData((prev) => ({
    ...prev,
    rows: prev.rows.map((row) => {
      const price = parseFloat(row.cells.price) || 0;
      const qty = parseFloat(row.cells.qty) || 0;
      const gst = parseFloat(row.cells.gst) || 0;

      if (price <= 0 || qty <= 0) {
        return {
          ...row,
          cells: { ...row.cells, total: 0 },
        };
      }

      const baseAmount = price * qty;

      const total =
        taxType === "exclusive"
          ? baseAmount + (baseAmount * gst) / 100
          : baseAmount;

      return {
        ...row,
        cells: {
          ...row.cells,
          total: total.toFixed(2) || 0,
        },
      };
    }),
  }));
}, [tableData.rows.map(r => `${r.cells.price}-${r.cells.qty}-${r.cells.gst}`).join(), taxType]);


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
    if (customer.pincode.trim() && !/^\d{6}$/.test(customer.pincode.trim())) {
      newErrors.pincode = "Pincode must be 6 digits";
    }

    // Validate table data
    const hasProducts = tableData.rows.some(row => {
      const product = row.cells.product || "";
      const quantity = parseFloat(row.cells.qty) || 0;
      return product.trim() !== "" && quantity > 0;
    });

    if (!hasProducts) {
      newErrors.products = "Please add at least one product with all details";
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
  }, [customer, quotationDates, tableData]);

  // Form actions
  const handleReset = useCallback(() => {
    setCustomer(createInitialCustomerState);
    setErrors({});
    setCustomerSuggestions([]);
    setShowSuggestions(false);
    setIsCustomerFetched(false);
    appToast.showInfo("Form data cleared successfully");
  }, []);

  const handleClear = useCallback(() => {
    if (window.confirm("Are you sure you want to clear all data?")) {
      setCustomer(createInitialCustomerState);
      setQuotationDates(createInitialQuotationState);
      setTableData({
        columns: [
          { key: "product", label: "Product" },
          { key: "image", label: "Image" },
          { key: "price", label: "Price" },
          { key: "gst", label: "GST %" },
          { key: "qty", label: "Qty" },
          { key: "total", label: "Total" }
        ],
        rows: [
          {
            id: crypto.randomUUID(),
            cells: {
              product: "",
              image: null,
              price: "",
              gst: "",
              qty: "",
              total: ""
            }
          }
        ]
      });
      setErrors({});
      setCustomerSuggestions([]);
      setShowSuggestions(false);
      setIsCustomerFetched(false);
      setIsPrintDialogOpen(false);
      setQuotationDataToPrint(null);
      setQuotationCreated(false);
      appToast.showSuccess("All data cleared!");
    }
  }, []);

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
      appToast.showError("Please fill the all details");
      return;
    }

    try {
      // Prepare products from table data
      const products = tableData.rows
        .filter(row => {
          const product = row.cells.product || "";
          const quantity = parseFloat(row.cells.qty) || 0;
          return product.trim() !== "" && quantity > 0;
        })
        .map(row => ({
          productName: row.cells.product,
          price: parseFloat(row.cells.price) || 0,
          gst: parseFloat(row.cells.gst) || 0,
          quantity: parseFloat(row.cells.qty) || 0,
          total: parseFloat(row.cells.total) || 0,
          image: row.cells.image?.file || null,
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
        // products: products,
        tableData: tableData, // Include the entire table structure
      };

      const res = await dispatch(createInteriorQuotation(payload)).unwrap();
      // console.log("Quotation created:", res);
      appToast.showSuccess(res.message || "Interior Quotation created successfully");
      setQuotationCreated(true);
      setQuotationDataToPrint(res.data);
    } catch (err) {
      if (
        err.error !==
        "Subscription expired. Please renew to continue using the service."
      ) {
        appToast.showError(err.error || "Failed to create quotation");
      } else {
        appToast.showError(err.error);
      }
    }
  }, [
    validateForm,
    tableData,
    customerSuggestions,
    customer,
    taxType,
    quotationDates,
    dispatch,
    errors,
  ]);

  const handlePrintQuotation = useCallback(() => {
    if (quotationDataToPrint) {
      setIsPrintDialogOpen(true);
      // appToast.showSuccess("Quotation ready for printing");
    } else {
      appToast.showError("Please generate a quotation first");
    }
  }, [quotationDataToPrint]);

  if (viewMode === "quotation") {
    return <Quotation />;
  }

  return (
    <div className="p-3 sm:p-6 bg-gray-50 min-h-screen space-y-6">
      <div className="mb-3">
        <div className="flex items-center bg-white p-3 rounded-lg shadow-sm">
          <div className="flex gap-2">
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
          </div>
        </div>
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
              {tableData.rows.length} {tableData.rows.length === 1 ? 'row' : 'rows'} added
            </p>
          </div>
        </div>

        {errors.products && (
          <div className="mb-2 rounded-md">
            <p className="text-sm text-red-600">{errors.products}</p>
          </div>
        )}

        {/* Desktop Table View */}
        {/* <div className="overflow-x-auto border border-gray-200 rounded-lg max-h-[400px]"> */}
        <div className="hidden sm:block overflow-x-auto border border-gray-200 rounded-lg max-h-[400px]">

          <table className="min-w-full border-collapse text-sm">
            <thead className="sticky top-0 bg-gray-100 z-10">
              <tr>
                {tableData.columns.map(col => (
                  <th
                    key={col.key}
                    className={`px-3 py-2 border ${
                      COLUMN_WIDTHS[col.key] || ""
                    }`}
                  >

                    <div className="flex items-center gap-2">
                      <input
                        value={col.label}
                        onChange={e =>
                          setTableData(prev => ({
                            ...prev,
                            columns: prev.columns.map(c =>
                              c.key === col.key
                                ? { ...c, label: e.target.value }
                                : c
                            )
                          }))
                        }
                        className="w-full 
                          border 
                          rounded 
                          px-1 py-1 
                          text-xs sm:text-sm
                          focus:outline-none focus:ring-1 focus:ring-blue-500
                          [&::-webkit-outer-spin-button]:appearance-none 
                          [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <button
                        onClick={() => removeColumn(col.key)}
                        className="text-red-500 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  </th>
                ))}
                <th className="px-2">
                  <button
                    onClick={addColumn}
                    className="text-green-600 font-bold"
                  >
                    <FaPlus className="text-xs" />
                  </button>
                </th>
              </tr>
            </thead>

            <tbody>
              {tableData.rows.map(row => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {tableData.columns.map(col => (
                    <td
                      key={col.key}
                      className={`border px-3 py-2 ${
                        COLUMN_WIDTHS[col.key] || ""
                      }`}
                    >

                      {col.key === "image" ? (
                        <div className="flex flex-col items-center gap-1">
                          {row.cells.image?.preview ? (
                            <img
                              src={row.cells.image.preview}
                              className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded"
                              alt="Product"
                            />
                          ) : (
                            <div className="w-14 h-14 sm:w-16 sm:h-16 border flex items-center justify-center text-[10px] text-gray-400">
                              No Image
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={e =>
                              handleImageUpload(row.id, e.target.files[0])
                            }
                            className=" text-[10px] sm:text-xs file:text-[10px] sm:file:text-xs file:py-1 file:px-2 file:border file:border-gray-300 file:rounded file:bg-white hover:file:bg-gray-50 cursor-pointer"
                          />
                        </div>
                      ) : (
                        // col.key === "gst" ? (
                        //   <select
                        //     value={row.cells.gst ?? ""}
                        //     onChange={(e) =>
                        //       updateCell(row.id, "gst", e.target.value === "" ? 0 : Number(e.target.value))
                        //     }
                        //     className="w-full border rounded px-2 py-1 bg-white focus:ring-1 focus:ring-blue-400 focus:outline-none"
                        //   >
                        //     <option value="">Select</option>
                        //     {GST_OPTIONS.map((gst) => (
                        //       <option key={gst} value={gst}>
                        //         {gst}%
                        //       </option>
                        //     ))}
                        //   </select>
                        // ) : (
                          col.key === "total" ? (
                            <input
                              value={row.cells.total ?? ""}
                              readOnly
                              className="w-full px-2 py-1 border rounded text-left font-medium focus:ring-1 focus:ring-blue-400 focus:outline-none"
                            />
                          ) : (
                          <input
                            value={row.cells[col.key] ?? ""}
                            onWheel={(e) => e.target.blur()}
                            onChange={(e) => {
                              let value = e.target.value;

                              // Remove leading zeros (except single zero)
                              if (col.key === "qty" || col.key === "gst" || col.key === "price") {
                                value = value.replace(/^0+(?=\d)/, "");
                              }

                              updateCell(row.id, col.key, value);
                            }}
                            className="w-full border rounded px-2 py-1 focus:ring-1 focus:ring-blue-400 focus:outline-none
                            [&::-webkit-outer-spin-button]:appearance-none 
                            [&::-webkit-inner-spin-button]:appearance-none"
                            type={
                              col.key === "qty" || col.key === "gst" || col.key === "price"
                                ? "number"
                                : "text"
                            }
                            min={col.key === "qty" || col.key === "gst" ? "0" : undefined}
                            step={col.key === "price" || col.key === "gst" ? "0.01" : undefined}
                            placeholder={col.key === "gst" ? "GST %" : ""}
                          />
                        )
                        // )

                      )}
                    </td>
                  ))}
                  <td className="text-center">
                    <button
                      onClick={() => removeRow(row.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Remove row"
                    >
                      <FaTrash className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="p-2 flex justify-between items-center border-t">
            <button
              onClick={addRow}
              className="text-blue-600 font-medium hover:text-blue-800 flex items-center gap-1"
            >
              <FaPlus className="text-xs" /> Add Row
            </button>
            <div className="text-sm text-gray-500">
              {tableData.rows.length} rows, {tableData.columns.length} columns
            </div>
          </div>
        </div>

        {/* MOBILE CARD VIEW */}
      <div className="sm:hidden space-y-4">
        {tableData.rows.map((row, index) => (
          <div
            key={row.id}
            className="border rounded-lg p-3 bg-white shadow-sm space-y-3"
          >
            {/* Header */}
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-gray-700">
                Item {index + 1}
              </h3>
              <button
                onClick={() => removeRow(row.id)}
                className="text-red-600"
              >
                <FaTrash className="w-4 h-4" />
              </button>
            </div>

            {/* Product */}
            <div>
              <label className="text-xs text-gray-500">Product</label>
              <input
                value={row.cells.product ?? ""}
                onChange={(e) =>
                  updateCell(row.id, "product", e.target.value)
                }
                className="w-full border rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-400 focus:outline-none
                      appearance-none"
              />
            </div>

            {/* Image */}
            <div>
              <label className="text-xs text-gray-500">Image</label>
              <div className="flex items-center gap-3">
                {row.cells.image?.preview ? (
                  <img
                    src={row.cells.image.preview}
                    className="w-14 h-14 object-cover rounded"
                  />
                ) : (
                  <div className="w-14 h-14 border flex items-center justify-center text-[10px] text-gray-400">
                    No Image
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleImageUpload(row.id, e.target.files[0])
                  }
                  className="text-xs"
                />
              </div>
            </div>

            {/* Price, Qty, GST */}
            <div className="grid grid-cols-3 gap-1">
              <div>
                <label className="text-xs text-gray-500">Price</label>
                <input
                  type="number"
                  value={row.cells.price ?? ""}
                  onChange={(e) =>
                    updateCell(row.id, "price", e.target.value)
                  }
                  className="w-full border rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-400 focus:outline-none
                      appearance-none"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500">Qty</label>
                <input
                  type="number"
                  value={row.cells.qty ?? ""}
                  onChange={(e) =>
                    updateCell(row.id, "qty", e.target.value)
                  }
                  className="w-full border rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-400 focus:outline-none
                      appearance-none"
                />
              </div>

            <div>
              <label className="text-xs text-gray-500">GST %</label>
              <input
                  type="number"
                  value={row.cells.gst ?? ""}
                  onChange={(e) =>
                    updateCell(row.id, "gst", e.target.value)
                  }
                  className="w-full border rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-400 focus:outline-none
                      appearance-none"
                />
            </div>
            </div>

            {/* EXTRA DYNAMIC COLUMNS (Mobile) */}
            {tableData.columns
              .filter(col => !DEFAULT_COLUMNS.includes(col.key))
              .map(col => (
                <div key={col.key} className="space-y-1">

                  {/* Label row with Remove icon */}
                  <div className="flex items-center gap-2">
                    <input
                      value={col.label}
                      placeholder="Column name"
                      onChange={(e) =>
                        setTableData(prev => ({
                          ...prev,
                          columns: prev.columns.map(c =>
                            c.key === col.key
                              ? { ...c, label: e.target.value }
                              : c
                          )
                        }))
                      }
                      className="flex-1 border border-dashed rounded px-2 py-1 
                                text-xs font-medium text-gray-600 "
                    />

                    <button
                      onClick={() => removeColumn(col.key)}
                      className="text-red-500 text-xs px-1"
                      title="Remove column"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Column Value */}
                  <input
                    value={row.cells[col.key] ?? ""}
                    onChange={(e) =>
                      updateCell(row.id, col.key, e.target.value)
                    }
                    className="w-full border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none
                      appearance-none"
                  />
                </div>
              ))}

            {/* Add Column */}
            <button
              onClick={addColumn}
              className="w-full border border-dashed border-green-400 text-green-600 py-2 rounded-md text-sm flex items-center justify-center gap-1"
            >
              <FaPlus className="text-xs" /> Add Field
            </button>

            {/* Total */}
            <div className="flex justify-between items-center bg-gray-50 rounded p-2">
              <span className="text-xs text-gray-600">Total</span>
              <span className="font-semibold text-sm">
                ₹{row.cells.total || "0.00"}
              </span>
            </div>
          </div>
        ))}

        {/* Add Row */}
        <button
          onClick={addRow}
          className="w-full border border-dashed border-blue-400 text-blue-600 py-2 rounded-md text-sm flex items-center justify-center gap-1"
        >
          <FaPlus className="text-xs" /> Add Item
        </button>
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
              <div className="flex flex-row sm:flex-row md:gap-4 sm:items-center sm:space-x-6 gap-4 text-sm space-y-2">
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
              disabled={interiorQuotationLoading || quotationCreated}
              className="w-full bg-[#0a1628] text-white py-2.5 rounded-md hover:bg-gray-700 transition text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {interiorQuotationLoading ? (
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

      <PrintQuotationDialog
        isOpen={isPrintDialogOpen}
        onClose={() => setIsPrintDialogOpen(false)}
        quotationData={quotationDataToPrint}
        isInteriorQuotation={true}
      />
    </div>
  );
};

export default InteriorQuotation;
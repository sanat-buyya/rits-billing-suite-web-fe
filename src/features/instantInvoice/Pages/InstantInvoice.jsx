import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaUndo,
  FaSearch,
  FaCamera,
  FaClipboardList,
  FaTrash,
  FaCalendarAlt,
  FaFileInvoice,
} from "react-icons/fa";
import Dropdown from "../../../components/DropDown";
import { useState, useEffect, useRef } from "react";
import CustomerSuggestion from "../../../components/CustomerSuggestion";
import Spinner from "../../../components/Spinner";
import AppToast from "../../../services/toastService";
import ScannerPopup from "../../../components/ScannerPopup";
import PrintInvoiceDialog from "../../../components/PrintInvoiceDialog";
import ProductSuggestion from "../../../components/ProductSuggestion";
import { useDispatch, useSelector } from "react-redux";
import {
  getCustomerByNumber,
  getProductsByIds,
  createInstantInvoice,
} from "../instantInvoiceThunk";

export default function CreateInstantInvoice() {
  const dispatch = useDispatch();

  // Get state from Redux store
  const {
    customerData,
    customerDataLoading,
    customerDataError,
    fetchedProduct,
    fetchedProductLoading,
    fetchedProductError,
    createdInvoice,
    createInstantInvoiceLoading,
    createInstantInvoiceError,
  } = useSelector((state) => state.instantInvoice);

  // Product state
  const [products, setProducts] = useState([]);
  const [productQuantities, setProductQuantities] = useState({});
  const [productPrices, setProductPrices] = useState({});
  const [productGstPercentages, setProductGstPercentages] = useState({});
  const [productDiscounts, setProductDiscounts] = useState({});
  const [invoiceDiscount, setInvoiceDiscount] = useState(0);

  // Customer search
  const [searchPhoneNumber, setSearchPhoneNumber] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [customerSuggestions, setCustomerSuggestions] = useState([]);

  // Customer form data
  const [customerId, setCustomerId] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  // Customer lock state
  const [isCustomerLocked, setIsCustomerLocked] = useState(false);

  // Product search
  const [manualProductSearch, setManualProductSearch] = useState("");
  const [manualSearchLoading, setManualSearchLoading] = useState(false);
  const [barcodeSearchLoading, setBarcodeSearchLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  // Invoice options
  const [taxType, setTaxType] = useState("inclusive");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(new Date());

  // Validation
  const [errors, setErrors] = useState({});

  // Print related states
  const [invoiceDataToPrint, setInvoiceDataToPrint] = useState(null);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);

  const [showProductSuggestions, setShowProductSuggestions] = useState(false);
  const [productSuggestions, setProductSuggestions] = useState([]);
  const [invoiceCreated, SetInvoiceCreated] = useState(false);

  // session Store
  const [isDraftRestored, setIsDraftRestored] = useState(false);
  
  const debounceTimer = useRef(null);

  // store data in session
    useEffect(() => {
  const saved = sessionStorage.getItem("quickInvoiceDraft");
  if (!saved) {
    setIsDraftRestored(true);
    return;
  }

  const d = JSON.parse(saved);
  console.log("Restoring draft:", d);

  setCustomerId(d.customerId || null);
  setCustomerName(d.customerName || "");
  setCustomerPhone(d.customerPhone || "");

  setProducts(d.products || []);
  setProductQuantities(d.productQuantities || {});
  setProductPrices(d.productPrices || {});
  setProductGstPercentages(d.productGstPercentages || {});
  setProductDiscounts(d.productDiscounts || {});

  setTaxType(d.taxType || "inclusive");
  setPaymentStatus(d.paymentStatus || "");
  setPaymentType(d.paymentType || "");
  setInvoiceDate(d.invoiceDate ? new Date(d.invoiceDate) : new Date());
  setInvoiceDiscount(d.invoiceDiscount || 0);

  setIsDraftRestored(true);
}, []);

  useEffect(() => {
    setSearchPhoneNumber("");
    setShowSuggestions(false);
    setCustomerSuggestions([]);
  }, []);

  // Handle customer search with API
  useEffect(() => {
    if (!searchPhoneNumber.trim() || searchPhoneNumber.trim().length < 3) {
      setShowSuggestions(false);
      return;
    }

    // Prevent auto-calls when navigating back
    if (isCustomerLocked) return;

    if (debounceTimer.current) {
    clearTimeout(debounceTimer.current);
  }

    debounceTimer.current = setTimeout(async () => {
    try {
      const result = await dispatch(getCustomerByNumber(searchPhoneNumber)).unwrap();

      setCustomerSuggestions(result);
      setShowSuggestions(true);

      if (result.length === 0) {
        AppToast.showError("No customers found with this phone number");
      }
    } catch (error) {
      console.error("Error fetching customer:", error);
      AppToast.showError(error?.message || "Failed to fetch customer");

      setCustomerSuggestions([]);
      setShowSuggestions(false);
    }
  }, 600);

  return () => clearTimeout(debounceTimer.current);
}, [searchPhoneNumber, isCustomerLocked, dispatch]);

  // Update customer suggestions when API data arrives
  useEffect(() => {
    if (!searchPhoneNumber.trim()) return;
    if (!customerData) return;

    setCustomerSuggestions(
      Array.isArray(customerData) ? customerData : [customerData]
    );
    setShowSuggestions(true);
  }, [customerData, searchPhoneNumber]);

  // Handle customer search errors
  useEffect(() => {
    if (customerDataError) {
      AppToast.showError(
        customerDataError.message || "Failed to fetch customer"
      );
      setShowSuggestions(false);
      setCustomerSuggestions([]);
    }
  }, [customerDataError]);

  // Handle product search suggestions
  useEffect(() => {
    if (!manualProductSearch.trim() || manualProductSearch.trim().length < 2) {
      setShowProductSuggestions(false);
      setProductSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await dispatch(
          getProductsByIds(manualProductSearch)
        ).unwrap();
        const productsArray = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : [];

        if (productsArray.length > 0) {
          setProductSuggestions(productsArray);
          setShowProductSuggestions(true);
        } else {
          setProductSuggestions([]);
          setShowProductSuggestions(false);
        }
      } catch (error) {
        console.error("Error fetching product suggestions:", error.data.error);
        AppToast.showError(error.data.error);
        setProductSuggestions([]);
        setShowProductSuggestions(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [manualProductSearch, dispatch]);

  // Handle invoice creation errors
  // useEffect(() => {
  //   if (createInstantInvoiceError) {
  //     AppToast.showError(
  //       createInstantInvoiceError.message || "Failed to create invoice"
  //     );
  //   }
  // }, [createInstantInvoiceError]);

  const handleProductSelect = (product) => {
    const productAdded = addProductToState(product);
    if (productAdded) {
      setManualProductSearch("");
      setShowProductSuggestions(false);
      AppToast.showInfo(`${product.productName} added to invoice`);
    }
  };

  // Select customer
  const handleCustomerSelect = (customer) => {
    console.log("this is the selected customer", customer);

    setCustomerId(customer._id);
    setCustomerName(customer.fullName || "");
    setCustomerPhone(customer.phone || "");
    setSearchPhoneNumber("");

    setIsCustomerLocked(true);
    setShowSuggestions(false);
    setErrors({});
  };

  const handleReset = () => {
    setCustomerId(null);
    setCustomerName("");
    setCustomerPhone("");
    setSearchPhoneNumber("");
    setShowSuggestions(false);
    setCustomerSuggestions([]);
    setIsCustomerLocked(false);
    setErrors({});
  };

  // Add product to state
  const addProductToState = (productData) => {
    const productId = productData._id;

    // Check if product already exists
    if (products.find((p) => p.productId === productId)) {
      AppToast.showInfo("Product already added to invoice");
      return false;
    }

    const newProduct = {
      productId: productId,
      productName: productData.productName,
      hsnOrSac: productData.hsnOrSac,
      description: productData.description,
      basePrice: productData.price,
      baseGst: productData.gst,
    };

    setProducts((prev) => [ ...prev, newProduct]);
    setProductQuantities((prev) => ({ ...prev, [productId]: 1 }));
    setProductPrices((prev) => ({ ...prev, [productId]: productData.price }));
    setProductGstPercentages((prev) => ({
      ...prev,
      [productId]: productData.gst,
    }));
    setProductDiscounts((prev) => ({
      ...prev,
      [productId]: productData.discount || 0,
    }));

    return true;
  };

  //  Manual adding product by id, name
  const handleManualProductAdd = async () => {
    if (!manualProductSearch.trim()) {
      AppToast.showError("Please enter a product name or ID");
      return;
    }

    const exactMatch = productSuggestions.find(
      (product) =>
        product.productId?.toUpperCase() ===
          manualProductSearch.toUpperCase() ||
        product.productName?.toUpperCase() === manualProductSearch.toUpperCase()
    );

    if (exactMatch) {
      handleProductSelect(exactMatch);
    } else {
      setManualSearchLoading(true);
      try {
        const result = await dispatch(
          getProductsByIds(manualProductSearch.trim())
        ).unwrap();

        let productData = result?.data || result;
        if (Array.isArray(productData) && productData.length === 1) {
          handleProductSelect(productData[0]);
        } else if (Array.isArray(productData) && productData.length > 1) {
          setProductSuggestions(productData);
          setShowProductSuggestions(true);
          AppToast.showInfo(
            "Multiple products found. Please select one from suggestions."
          );
        } else {
          AppToast.showError("Product not found");
        }
      } catch (error) {
        //  Handle error immediately here
        AppToast.showError(error.message || "Failed to search product");
      } finally {
        setManualSearchLoading(false);
      }
    }
  };

  // Product adding using barcode - Only add when explicitly selected
  const handleBarcodeSearch = async (barcode) => {
    console.log("this is the barcode", barcode);
    setBarcodeSearchLoading(true);
    try {
      const result = await dispatch(getProductsByIds(barcode)).unwrap();

      let productData = result?.data || result;
      if (Array.isArray(productData) && productData.length === 1) {
        // Only auto-add if there's exactly one match from barcode
        handleProductSelect(productData[0]);
      } else if (Array.isArray(productData) && productData.length > 1) {
        // Show suggestions for multiple matches
        setProductSuggestions(productData);
        setShowProductSuggestions(true);
        AppToast.showInfo("Multiple products found. Please select one.");
      } else {
        AppToast.showError("Product not found for this barcode");
      }
    } catch (error) {
      AppToast.showError("Failed to search product by barcode");
    } finally {
      setBarcodeSearchLoading(false);
    }
  };

  const handleIncrement = (id) => {
    setProductQuantities((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const handleDecrement = (id) => {
    setProductQuantities((prev) => {
      const newQuantity = Math.max((prev[id] || 0) - 1, 0);
      return { ...prev, [id]: newQuantity };
    });
  };

  const handleQuantityChange = (id, value) => {
    const newValue = parseInt(value) || 0;
    setProductQuantities((prev) => ({ ...prev, [id]: newValue }));
  };

  const handlePriceChange = (productId, value) => {
    const price = parseFloat(value) || 0;
    setProductPrices((prev) => ({ ...prev, [productId]: price }));
  };

  const handleGstChange = (productId, value) => {
    const gst = parseFloat(value) || 0;
    setProductGstPercentages((prev) => ({ ...prev, [productId]: gst }));
  };

  const handleDiscountChange = (productId, value) => {
    const discount = parseFloat(value) || 0;
    setProductDiscounts((prev) => ({ ...prev, [productId]: discount }));
  };

  const handleDeleteProduct = (productId) => {
    setProducts((prev) =>
      prev.filter((product) => product.productId !== productId)
    );
    setProductQuantities((prev) => {
      const newQuantities = { ...prev };
      delete newQuantities[productId];
      return newQuantities;
    });
    setProductPrices((prev) => {
      const newPrices = { ...prev };
      delete newPrices[productId];
      return newPrices;
    });
    setProductGstPercentages((prev) => {
      const newGst = { ...prev };
      delete newGst[productId];
      return newGst;
    });
    setProductDiscounts((prev) => {
      const newDiscounts = { ...prev };
      delete newDiscounts[productId];
      return newDiscounts;
    });
  };

  useEffect(() => {
  setPaymentStatus("Paid");
}, []);


 const calculateProductTotal = (productId) => {
  const product = products.find((p) => p.productId === productId);
  if (!product) return 0;

  const basePrice = productPrices[productId] ?? product.basePrice;
  const gstPercentage = productGstPercentages[productId] ?? product.baseGst;
  const discountPercentage = productDiscounts[productId] ?? 0;
  const quantity = productQuantities[productId] || 0;

  if (taxType === "inclusive") {
    // Remove GST from the base price (basePrice includes GST)
    const priceWithoutGst = basePrice / (1 + gstPercentage / 100);

    // Apply product discount
    const discounted = priceWithoutGst * (1 - discountPercentage / 100);

    // Calculate GST again on discounted price
    const gstAmount = discounted * (gstPercentage / 100);

    return (discounted + gstAmount) * quantity;
  } else {
    // Exclusive
    const discounted = basePrice * (1 - discountPercentage / 100);
    const gstAmount = discounted * (gstPercentage / 100);

    return (discounted + gstAmount) * quantity;
  }
};


const calculateTotals = () => {
  let subTotal = 0;
  let totalGst = 0;

  products.forEach((product) => {
    const productId = product.productId;
    const basePrice = productPrices[productId] ?? product.basePrice;
    const gstPercentage = productGstPercentages[productId] ?? product.baseGst;
    const productDiscountPercentage = productDiscounts[productId] ?? 0;
    const quantity = productQuantities[productId] || 0;

    if (taxType === "inclusive") {
      const priceWithoutGst = basePrice / (1 + gstPercentage / 100);
      const discountedWithoutGst =
        priceWithoutGst * (1 - productDiscountPercentage / 100);

      const lineTotalWithoutGst = discountedWithoutGst * quantity;
      const gstAmount = lineTotalWithoutGst * (gstPercentage / 100);

      subTotal += Number(lineTotalWithoutGst.toFixed(2));
      totalGst += Number(gstAmount.toFixed(2));
    } else {
      const discounted = basePrice * (1 - productDiscountPercentage / 100);
      const lineTotalWithoutGst = discounted * quantity;
      const gstAmount = lineTotalWithoutGst * (gstPercentage / 100);

      subTotal += Number(lineTotalWithoutGst.toFixed(2));
      totalGst += Number(gstAmount.toFixed(2));
    }
  });

  const totalBeforeInvoiceDiscount = subTotal + totalGst;

  const invoiceDiscountAmount =
    (totalBeforeInvoiceDiscount * invoiceDiscount) / 100;

  const grandTotal =
    totalBeforeInvoiceDiscount - invoiceDiscountAmount;

  return {
    subTotal,
    totalGst,
    invoiceDiscount: invoiceDiscountAmount,
    grandTotal: Number(grandTotal.toFixed(2)),
  };
};


  const {
    subTotal,
    subTotalAfterDiscount,
    totalGst,
    totalDiscount,
    grandTotal,
  } = calculateTotals();

  const validateCustomerForm = () => {
    let newErrors = {};

    // if (!customerName.trim())
    //   newErrors.customerName = "Customer Name is required";
    // if (!customerPhone.trim()) newErrors.customerPhone = "Phone is required";
    // else if (!/^\d{10}$/.test(customerPhone))
      // newErrors.customerPhone = "Phone must be 10 digits";
    if (customerPhone && customerPhone.length !== 10) newErrors.customerPhone = "Phone must be 10 digits";
    if (products.length === 0) {
      newErrors.products = "Please select at least one product";
    } else {
      const hasValidQuantity = products.some(
        (product) => (productQuantities[product.productId] || 0) > 0
      );
      if (!hasValidQuantity)
        newErrors.products = "Please add quantity for at least one product";
    }

    if (!paymentStatus.trim())
      newErrors.paymentStatus = "Payment Option is required";

    if (paymentStatus === "Paid" && !paymentType.trim()) {
      newErrors.paymentType = "Payment Type is required";
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
  };

  const formatDateForDisplay = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // to store date in session 
    useEffect(() => {
    if (!isDraftRestored) return;
  
    const draft = {
      customerId,
      customerName,
      customerPhone,
  
      products,
      productQuantities,
      productPrices,
      productGstPercentages,
      productDiscounts,
  
      taxType,
      paymentStatus,
      paymentType,
      invoiceDate,
      invoiceDiscount,
    };
  
    console.log("Saving draft:", draft);
    sessionStorage.setItem("quickInvoiceDraft", JSON.stringify(draft));
  }, [
    isDraftRestored,
  
    customerId,
    customerName,
    customerPhone,
  
    products,
    productQuantities,
    productPrices,
    productGstPercentages,
    productDiscounts,
  
    taxType,
    paymentStatus,
    paymentType,
    invoiceDate,
    invoiceDiscount,
  ]);
  

  const handleCreateInvoice = async () => {
    if (validateCustomerForm()) {
      const finalProducts = products.map((product) => {
        const productId = product.productId;
        const currentPrice =
          productPrices[productId] !== undefined
            ? productPrices[productId]
            : product.basePrice;

        const currentGst =
          productGstPercentages[productId] !== undefined
            ? productGstPercentages[productId]
            : product.baseGst;

        const currentDiscount =
          productDiscounts[productId] !== undefined
            ? productDiscounts[productId]
            : 0;

        const quantity = productQuantities[productId] || 0;

        // Calculate product total for the response
        const productTotal = calculateProductTotal(productId);

        return {
          productId: productId,
          productName: product.productName,
          quantity: quantity,
          price: currentPrice,
          gst: currentGst,
          discount: currentDiscount,
          total: productTotal,
          hsn: product.hsnOrSac,
        };
      });

      const selectedCustomer = customerSuggestions.find(
        (customer) => customer.phone === customerPhone
      );

      const customerId = selectedCustomer ? selectedCustomer._id : null;

      const formattedDate = formatDateForDisplay(invoiceDate);

      const payload = {
        customerId: customerId,
        customerName: customerName,
        customerPhone: customerPhone,
        gstType: taxType,
        paymentMode:
          paymentStatus.toUpperCase() === "UNPAID"
            ? "NA"
            : paymentType.toUpperCase(),
        status: paymentStatus.toUpperCase(),
        invoiceDate: formattedDate,
        grandDiscount: invoiceDiscount,
        products: finalProducts,
        // amount: {
        //   subTotal: subTotal,
        //   gst: totalGst,
        //   grandTotal: grandTotal,
        //   grandDiscount: invoiceDiscount,
        // },
      };

      console.log("Quick Invoice payload:", payload);

      try {
        const result = await dispatch(createInstantInvoice(payload)).unwrap();
        setInvoiceDataToPrint(result);
        SetInvoiceCreated(true);
        sessionStorage.removeItem("quickInvoiceDraft");
        AppToast.showSuccess(
          result.message || "Quick Invoice created successfully"
        );
      } catch (error) {
        console.log("failed",error)
        AppToast.showError(error?.error);
      }
    } else {
      const firstErrorKey = Object.keys(errors)[0];
      if (firstErrorKey) {
        const el = document.querySelector(`[name="${firstErrorKey}"]`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.focus();
        }
      }
      return;
    }
  };

  const handlePrintInvoice = () => {
    if (invoiceDataToPrint) {
      setIsPrintDialogOpen(true);
    }
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all data?")) {
      handleReset();
      setProducts([]);
      setProductQuantities({});
      setProductPrices({});
      setProductGstPercentages({});
      setProductDiscounts({});
      setInvoiceDiscount(0);
      setManualProductSearch("");
      setTaxType("inclusive");
      setPaymentStatus("");
      setPaymentType("");
      setInvoiceDate(new Date());
      setInvoiceDataToPrint(null);
      SetInvoiceCreated(false);
      sessionStorage.removeItem("quickInvoiceDraft");
      AppToast.showSuccess("All data cleared!");
    }
  };

  return (
    <div className="p-3 sm:p-6 bg-gray-50 min-h-screen space-y-6">
      {/* Customer Basic details */}
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
              <p className="text-sm text-gray-500">
                Enter basic customer details
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              {customerDataLoading ? (
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Spinner size={16} color="#9CA3AF" />
                </div>
              ) : (
                <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              )}

              <input
                value={searchPhoneNumber}
                // onChange={(e) => setSearchPhoneNumber(e.target.value)}
                onChange={(e) => {
                  let val = e.target.value.replace(/\D/g, "");
                  if (val.length > 10) val = val.slice(0, 10);
                  setSearchPhoneNumber(val);
                }}
                type="number"
                placeholder="Search by mobile number"
                className="w-full border border-blue-200 rounded-md pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none
                [&::-webkit-outer-spin-button]:appearance-none 
                    [&::-webkit-inner-spin-button]:appearance-none"
              />

              <CustomerSuggestion
                showSuggestions={showSuggestions && !customerDataLoading}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Customer Name
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 top-3 text-gray-400" />
              <input
                name="customerName"
                type="text"
                title={
                  isCustomerLocked &&
                  "Locked because a saved customer is selected. Click Reset to edit."
                }
                value={customerName}
                disabled={isCustomerLocked}
                // onChange={(e) => setCustomerName(e.target.value)}
                onChange={(e) => {
                    const value = e.target.value;
                    const formatted = value.charAt(0).toUpperCase() + value.slice(1);
                    setCustomerName(formatted);
                  }}
                placeholder="Enter customer name"
                className={`w-full border  ${
                  errors.customerName ? "border-red-500" : "border-gray-300"
                }  rounded-md pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none`}
              />
            </div>
            {errors.customerName && (
              <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <div className="relative">
              <FaPhone className="absolute left-3 top-3 text-gray-400" />
              <input
                name="customerPhone"
                type="number"
                maxLength={10}
                disabled={isCustomerLocked}
                title={
                  isCustomerLocked &&
                  "Locked because a saved customer is selected. Click Reset to edit."
                }
                value={customerPhone}
                onChange={(e) => {
                  let val = e.target.value.replace(/\D/g, "");
                  if (val.length > 10) val = val.slice(0, 10);
                  setCustomerPhone(val);
                }}
                placeholder="Enter 10-digit phone number"
                className={`w-full border  ${
                  errors.customerPhone ? "border-red-500" : "border-gray-300"
                }  rounded-md pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none
                [&::-webkit-outer-spin-button]:appearance-none 
                    [&::-webkit-inner-spin-button]:appearance-none`}
              />
            </div>
            {errors.customerPhone && (
              <p className="text-red-500 text-xs mt-1">
                {errors.customerPhone}
              </p>
            )}
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

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          {/* Manual Product Input with Suggestions */}
          <div className="relative flex-1">
            {manualSearchLoading || fetchedProductLoading ? (
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
                let value = e.target.value;
                // Allow only letters, numbers, spaces
                value = value.replace(/[^A-Za-z0-9\s]/g, "");
                // Convert to First Letter Caps then lower
                value = value.charAt(0).toUpperCase() + value.slice(1);

                setManualProductSearch(value);
              }}

              onFocus={() => {
                if (
                  manualProductSearch.trim() &&
                  productSuggestions.length > 0
                ) {
                  setShowProductSuggestions(true);
                }
              }}
              onBlur={() => {
                setTimeout(() => setShowProductSuggestions(false), 200);
              }}
              placeholder="Search by Product ID or Name"
              className="w-full border border-gray-300 rounded-md pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />

            <ProductSuggestion
              showSuggestions={showProductSuggestions}
              productSuggestions={productSuggestions}
              onProductSelect={handleProductSelect}
              maxHeight={250}
            />
          </div>

          {/* Scan Barcode Button */}
          <button
            onClick={() => setShowScanner(true)}
            disabled={barcodeSearchLoading}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-sm text-gray-700 transition w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-4 h-4 flex items-center justify-center">
              {barcodeSearchLoading ? (
                <Spinner size={16} color="#4B5563" />
              ) : (
                <FaCamera className="text-gray-500" />
              )}
            </div>
            Scan Barcode
          </button>

          {/* Add Product Button */}
          {/* <button
            onClick={handleManualProductAdd}
            disabled={manualSearchLoading || fetchedProductLoading}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#0a1628] hover:bg-gray-700 text-white rounded-md text-sm transition w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-4 h-4 flex items-center justify-center">
              {manualSearchLoading || fetchedProductLoading ? (
                <Spinner size={16} color="#FFFFFF" />
              ) : (
                <span className="text-lg font-semibold">+</span>
              )}
            </div>
            Add Product
          </button> */}
        </div>
      </div>

      {/* PRODUCT LIST WITH DISCOUNT COLUMN */}
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

        {errors.products && (
          <p className="text-red-500 text-sm mb-4">{errors.products}</p>
        )}

        {/* MOBILE CARD VIEW (<640px) WITH DISCOUNT */}
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
                    {item.hsnOrSac || "N/A"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Price:</span>
                  <input
                    type="number"
                    value={
                      productPrices[item.productId] !== undefined
                        ? productPrices[item.productId]
                        : item.basePrice
                    }
                    // onChange={(e) =>
                    //   handlePriceChange(item.productId, e.target.value)
                    // }
                    onInput={(e) => {
                        // Remove leading zeros immediately as user types
                        if (e.target.value.length > 1 && e.target.value.startsWith('0')) {
                          e.target.value = e.target.value.replace(/^0+/, '');
                        }
                      }}
                       onChange={(e) => {
                        let value = e.target.value;
                        if (value < 0) value = 0;
                        value = value.replace(/^0+(?=\d)/, "");

                        handlePriceChange(item.productId, value);
                      }}
                    className="ml-2 w-20 border border-gray-300 rounded px-2 py-0.5 text-xs focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                </div>
                <div>
                  <span className="text-gray-500">GST:</span>
                  <input
                    type="number"
                    value={
                      productGstPercentages[item.productId] !== undefined
                        ? productGstPercentages[item.productId]
                        : item.baseGst
                    }
                    onInput={(e) => {
                        if (e.target.value.length > 1 && e.target.value.startsWith('0')) {
                          e.target.value = e.target.value.replace(/^0+/, '');
                        }
                      }}
                      onChange={(e) =>{
                        let value = e.target.value;
                        if (value < 0) value = 0;
                        if (value > 100) value = 100;
                        value = value.replace(/^0+(?=\d)/, "");

                        handleGstChange(item.productId, value)
                      }}
                    className="ml-2 w-14 border border-gray-300 rounded px-2 py-0.5 text-xs focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                    {/* <select
                      value={
                        productGstPercentages[item.productId] !== undefined
                          ? productGstPercentages[item.productId]
                          : item.baseGst
                      }
                      onChange={(e) =>
                        handleGstChange(item.productId, Number(e.target.value))
                      }
                      className="ml-2 w-20 border border-gray-300 rounded px-2 py-0.5 text-xs
                        bg-white focus:ring-2 focus:ring-blue-400 focus:outline-none
                        appearance-none"
                    >
                      <option value="0">0%</option>
                      <option value="5">5%</option>
                      <option value="18">18%</option>
                      <option value="40">40%</option>
                    </select> */}
                </div>
                <div>
                  <span className="text-gray-500">Discount:</span>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    max="100"
                    value={
                      productDiscounts[item.productId] !== undefined
                        ? productDiscounts[item.productId]
                        : 0
                    }
                    onInput={(e) => {
                        // Remove leading zeros immediately as user types
                        if (e.target.value.length > 1 && e.target.value.startsWith('0')) {
                          e.target.value = e.target.value.replace(/^0+/, '');
                        }
                      }}
                      // onChange={(e) =>
                        
                      //   handleDiscountChange(item.productId, e.target.value)
                      // }
                      onChange={(e) =>{
                        let value = e.target.value;
                        if (value > 100) value = 100;
                        value = value.replace(/^0+(?=\d)/, "");

                        handleDiscountChange(item.productId, value)
                      }}
                    className="ml-2 w-14 border border-gray-300 rounded px-2 py-0.5 text-xs focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                  <span className="text-xs"> %</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500">Total:</span>
                  <span className="ml-1 font-bold text-gray-900">
                    ₹{calculateProductTotal(item.productId).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDecrement(item.productId)}
                    className="px-2.5 py-1 border border-gray-300 rounded hover:bg-gray-100 text-sm"
                  >
                    -
                  </button>

                  <input
                    type="number"
                    min="0"
                    value={productQuantities[item.productId] || 0}
                    onInput={(e) => {
                        // Remove leading zeros immediately as user types
                        if (e.target.value.length > 1 && e.target.value.startsWith('0')) {
                          e.target.value = e.target.value.replace(/^0+/, '');
                        }
                      }}
                    onChange={(e) =>
                      handleQuantityChange(item.productId, e.target.value)
                    }
                    className="w-12 text-center border border-gray-300 rounded py-1 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />

                  <button
                    onClick={() => handleIncrement(item.productId)}
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
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* DESKTOP TABLE VIEW WITH DISCOUNT COLUMN */}
        <div className="hidden sm:block overflow-x-auto border border-gray-100 rounded-lg max-h-[400px]">
          <table className="w-full text-sm text-left text-gray-700 border-collapse min-w-full">
            <thead className="bg-gray-100 text-gray-600 sticky top-0 z-10">
              <tr>
                <th className="px-3 py-3">Product</th>
                <th className="px-3 py-3">HSN</th>
                <th className="px-3 py-3">Price</th>
                <th className="px-3 py-3">GST %</th>
                <th className="px-3 py-3 text-center">Qty</th>
                <th className="px-3 py-3">Discount %</th>
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
                      type="number"
                      value={
                        productPrices[item.productId] !== undefined
                          ? productPrices[item.productId]
                          : item.basePrice
                      }
                      onInput={(e) => {
                        // Remove leading zeros immediately as user types
                        if (e.target.value.length > 1 && e.target.value.startsWith('0')) {
                          e.target.value = e.target.value.replace(/^0+/, '');
                        }
                      }}
                       onChange={(e) => {
                        let value = e.target.value;
                        if (value < 0) value = 0;
                        value = value.replace(/^0+(?=\d)/, "");

                        handlePriceChange(item.productId, value);
                      }}
                      className="w-24 border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-400 focus:outline-none
                      [&::-webkit-outer-spin-button]:appearance-none 
                    [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <input
                      type="number"
                      value={
                        productGstPercentages[item.productId] !== undefined
                          ? productGstPercentages[item.productId]
                          : item.baseGst
                      }
                      onInput={(e) => {
                        if (e.target.value.length > 1 && e.target.value.startsWith('0')) {
                          e.target.value = e.target.value.replace(/^0+/, '');
                        }
                      }}
                      onChange={(e) =>{
                        let value = e.target.value;
                        if (value < 0) value = 0;
                        if (value > 100) value = 100;
                        value = value.replace(/^0+(?=\d)/, "");

                        handleGstChange(item.productId, value)
                      }}
                      
                      className="w-16 border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-400 focus:outline-none
                      [&::-webkit-outer-spin-button]:appearance-none 
                    [&::-webkit-inner-spin-button]:appearance-none"
                    />
                      {/* <select
                        value={
                          productGstPercentages[item.productId] !== undefined
                            ? productGstPercentages[item.productId]
                            : item.baseGst
                        }
                        onChange={(e) =>
                          handleGstChange(item.productId, Number(e.target.value))
                        }
                        className="w-16 border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-400 focus:outline-none
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
                        onClick={() => handleDecrement(item.productId)}
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
                        if (e.target.value.length > 1 && e.target.value.startsWith('0')) {
                          e.target.value = e.target.value.replace(/^0+/, '');
                        }
                      }}
                        onChange={(e) =>
                          handleQuantityChange(item.productId, e.target.value)
                        }
                        className="w-14 text-center border border-gray-300 rounded py-1 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none
                        [&::-webkit-outer-spin-button]:appearance-none 
                    [&::-webkit-inner-spin-button]:appearance-none"
                      />

                      <button
                        onClick={() => handleIncrement(item.productId)}
                        className="px-2 py-1 border rounded hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <input
                      type="number"
                      step="1"
                      min="0"
                      max="100"
                      value={
                        productDiscounts[item.productId] !== undefined
                          ? productDiscounts[item.productId]
                          : 0
                      }
                      onInput={(e) => {
                        // Remove leading zeros immediately as user types
                        if (e.target.value.length > 1 && e.target.value.startsWith('0')) {
                          e.target.value = e.target.value.replace(/^0+/, '');
                        }
                      }}
                      // onChange={(e) =>
                        
                      //   handleDiscountChange(item.productId, e.target.value)
                      // }
                      onChange={(e) =>{
                        let value = e.target.value;
                        if (value > 100) value = 100;
                        value = value.replace(/^0+(?=\d)/, "");

                        handleDiscountChange(item.productId, value)
                      }}
                      className="w-16 border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-400 focus:outline-none
                      [&::-webkit-outer-spin-button]:appearance-none 
                    [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </td>
                  
                  <td className="px-3 py-3 text-right font-medium text-gray-900">
                    ₹{calculateProductTotal(item.productId).toFixed(2)}
                  </td>
                  <td className="px-3 py-3 text-center align-middle">
                    <button
                      onClick={() => handleDeleteProduct(item.productId)}
                      className="text-red-600 bg-white shadow-sm hover:shadow-md hover:bg-red-50 px-3 py-1.5 rounded-lg flex items-center gap-1 text-sm transition mx-auto"
                    >
                      <FaTrash className="w-3.5 h-3.5 " />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Invoice Details */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
              <FaCalendarAlt className="text-lg" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                Invoice Details
              </h2>
              <p className="text-sm text-gray-500">
                Set dates, tax type, and payment details
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Invoice Date *
              </label>
              <input
                type="date"
                value={formatDateForDisplay(invoiceDate)}
                onChange={(e) => setInvoiceDate(new Date(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            <div>
              <span className="block text-sm font-medium text-gray-700 mb-2">
                Tax Type
              </span>
              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="radio"
                    name="taxType"
                    checked={taxType === "inclusive"}
                    onChange={() => setTaxType("inclusive")}
                    className="accent-blue-600"
                  />
                  <span>Tax Inclusive</span>
                </label>
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="radio"
                    name="taxType"
                    checked={taxType === "exclusive"}
                    onChange={() => setTaxType("exclusive")}
                    className="accent-blue-600"
                  />
                  <span>Tax Exclusive</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Options
              </label>
              <p className="w-full px-3 py-2 border rounded bg-gray-100 text-gray-700">
                Paid
              </p>
              <p className="px-1 text-xs text-gray-500">Quick Invoice supports paid invoices only.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Type *
              </label>
              <Dropdown
                options={["Cash", "Card", "UPI"]}
                placeholder="Select payment type"
                className={`w-full ${
                  errors.paymentType ? "border-red-500" : ""
                }`}
                value={paymentType}
                onChange={(value) => setPaymentType(value)}
                disabled={paymentStatus === "Unpaid"}
                title="Payment type selection is disabled for Unpaid invoices."
              />
              {errors.paymentType && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.paymentType}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Summary WITH EDITABLE DISCOUNT */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
              <FaFileInvoice className="text-lg" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                Summary
              </h2>
              <p className="text-sm text-gray-500">Invoice totals</p>
            </div>
          </div>

          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium">₹{subTotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span>GST Amount</span>
              <span className="text-green-600 font-medium">
                ₹{totalGst.toFixed(2)}
              </span>
            </div>

            {/* Editable Discount Row */}
            <div className="flex justify-between items-center">
              <span>Grand Discount %</span>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  value={invoiceDiscount}
                  // onChange={(e) =>
                  //   setInvoiceDiscount(parseFloat(e.target.value) || 0)
                  // }
                  onInput={(e) => {
                    // Remove leading zeros immediately as user types
                    if (e.target.value.length > 1 && e.target.value.startsWith('0')) {
                      e.target.value = e.target.value.replace(/^0+/, '');
                    }
                  }}
                  onChange={(e) =>{
                        let value = e.target.value;
                        if (value > 100) value = 100;
                        value = value.replace(/^0+(?=\d)/, "");

                        setInvoiceDiscount(parseFloat(value) || 0)
                      }}
                  className="w-20   rounded-md px-2 py-1 border-b-4  focus:border-b-2 focus:border-gray-400 focus:outline-none
                 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="0%"
                />
                <span className="text-gray-500">%</span>
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-md flex justify-between font-semibold text-gray-800">
              <span>Grand Total</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={handleCreateInvoice}
                disabled={createInstantInvoiceLoading || invoiceCreated}
                className="w-full bg-[#0a1628] text-white py-2.5 rounded-md hover:bg-gray-700 transition text-sm font-medium disabled:opacity-50  flex items-center justify-center gap-2"
              >
                {createInstantInvoiceLoading ? (
                  <>
                    <Spinner size={16} color="#FFFFFF" />
                    <span>Generating...</span>
                  </>
                ) : (
                  "Generate Invoice"
                )}
              </button>
              <button
                onClick={handlePrintInvoice}
                disabled={!invoiceDataToPrint}
                className="w-full border border-gray-600 text-gray-700 py-2.5 rounded-md hover:bg-gray-50 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Print Invoice
              </button>
              <button
                onClick={handleClearAll}
                className="w-full border border-gray-300 text-gray-500 py-2.5 rounded-md hover:bg-gray-50 transition text-sm font-medium"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      </div>

      {showScanner && (
        <ScannerPopup
          onClose={() => setShowScanner(false)}
          onDetected={handleBarcodeSearch}
        />
      )}
      <PrintInvoiceDialog
        isOpen={isPrintDialogOpen}
        onClose={() => setIsPrintDialogOpen(false)}
        invoiceData={invoiceDataToPrint}
        isQuickPrint={true}
      />
    </div>
  );
}

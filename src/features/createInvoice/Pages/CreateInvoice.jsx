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
  FaChevronRight,
  FaTag,
} from "react-icons/fa";
import Dropdown from "../../../components/DropDown";
import { useState, useEffect, useMemo, useRef } from "react";
import State from "../../../components/State";
import {
  getCustomerByNumber,
  getProductsByIds,
  createInvoice,
} from "../createInvoiceThunk";
import { useDispatch, useSelector } from "react-redux";
import CustomerSuggestion from "../../../components/CustomerSuggestion";
import Spinner from "../../../components/Spinner";
import AppToast from "../../../services/toastService";
import ScannerPopup from "../../../components/ScannerPopup";
import PrintInvoiceDialog from "../../../components/PrintInvoiceDialog";
import { div } from "framer-motion/client";

export default function CreateInvoice() {
  const dispatch = useDispatch();

  // Product state
  const [products, setProducts] = useState([]);
  const [productQuantities, setProductQuantities] = useState({});
  const [productPrices, setProductPrices] = useState({});
  const [productGstPercentages, setProductGstPercentages] = useState({});
  const [productDiscountPercentage, setProductDiscountPercentage] = useState(
    {}
  );
  const [overAllDiscountPercentage, setOverAllDiscountPercentage] =
    useState(0);

  const [searchProductSuggestion, setSearchProductSuggestion] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");

  const debounceTimer = useRef(null);

  // Customer search
  const [serchPhoneNumber, setSearchPhoneNumber] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [customerSuggestions, setCustomerSuggestions] = useState([]);

  // Customer form data
  const [customerId, setCustomerId] = useState(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerGst, setCustomerGst] = useState("");
  const [customerState, setCustomerState] = useState("");
  const [customerPin, setCustomerPin] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");

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

  //print related states
  const [invoiceDataToPrint, setInvoiceDataToPrint] = useState(null);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  
  const [invoiceCreated, SetInvoiceCreated] = useState(false);
  // session Store
  const [isDraftRestored, setIsDraftRestored] = useState(false);

  // Redux state
  const {
    customerData,
    customerDataLoading,
    customerDataError,
    createInvoiceLoading,
    fetchedProductLoading,
  } = useSelector((state) => state.createInvoice);

  // useEffect(() => {
  //   if (!serchPhoneNumber.trim() || serchPhoneNumber.trim().length < 3) {
  //     setShowSuggestions(false);
  //     return;
  //   }

  //   const timer = setTimeout(() => {
  //     dispatch(getCustomerByNumber(serchPhoneNumber));
  //     setShowSuggestions(true);
  //   }, 400);

  //   return () => clearTimeout(timer);
  // }, [serchPhoneNumber, dispatch]);

  // useEffect(() => {
  //   if (customerData) {
  //     // console.log(customerData)
  //     setCustomerSuggestions(customerData);
  //   }
  // }, [customerData]);

// for restore data from store
  useEffect(() => {
  const saved = sessionStorage.getItem("invoiceDraft");
  if (!saved) {
    setIsDraftRestored(true);
    return;
  }

  const d = JSON.parse(saved);
  console.log("Restoring draft:", d);

  setCustomerId(d.customerId || null);
  setCustomerName(d.customerName || "");
  setCustomerPhone(d.customerPhone || "");
  setCustomerEmail(d.customerEmail || "");
  setCustomerGst(d.customerGst || "");
  setCustomerState(d.customerState || "");
  setCustomerPin(d.customerPin || "");
  setCustomerAddress(d.customerAddress || "");

  setProducts(d.products || []);
  setProductQuantities(d.productQuantities || {});
  setProductPrices(d.productPrices || {});
  setProductGstPercentages(d.productGstPercentages || {});
  setProductDiscountPercentage(d.productDiscountPercentage || {});

  setTaxType(d.taxType || "inclusive");
  setPaymentStatus(d.paymentStatus || "");
  setPaymentType(d.paymentType || "");
  setInvoiceDate(d.invoiceDate ? new Date(d.invoiceDate) : new Date());
  setOverAllDiscountPercentage(d.overAllDiscountPercentage || 0);

  setIsDraftRestored(true);
}, []);


  useEffect(() => {
    if (!serchPhoneNumber.trim() || serchPhoneNumber.trim().length < 3) {
      setShowSuggestions(false);
      return;
    }

  // Clear previous debounce
  if (debounceTimer.current) {
    clearTimeout(debounceTimer.current);
  }

  // Debounce API call
  debounceTimer.current = setTimeout(async () => {
    try {
      const result = await dispatch(getCustomerByNumber(serchPhoneNumber)).unwrap();

      setCustomerSuggestions(result);
      setShowSuggestions(true);

      if (result.length === 0) {
        AppToast.showError("No customers found with this phone number");
      }
    } catch (err) {
      console.error("Error fetching customer:", err);
      setCustomerSuggestions([]);
      setShowSuggestions(false);
    } 
  }, 600);

  return () => clearTimeout(debounceTimer.current);
}, [serchPhoneNumber, dispatch]);


  const handleCustomerSelect = (customer) => {
    console.log("this is the selected customer", customer);

    setCustomerId(customer._id);
    setCustomerName(customer.fullName || "");
    setCustomerPhone(customer.phone || "");
    setCustomerEmail(customer.email || "");
    setCustomerGst(customer.gstNumber || "");
    setCustomerState(customer.state || "");
    setCustomerPin(customer.pinCode || "");
    setCustomerAddress(customer.fullAddress || "");
    setSearchPhoneNumber("");

    setIsCustomerLocked(true);
    setShowSuggestions(false);
    setErrors({});
  };

  const handleReset = () => {
    setCustomerId(null);
    setCustomerName("");
    setCustomerPhone("");
    setCustomerEmail("");
    setCustomerGst("");
    setCustomerState("");
    setCustomerPin("");
    setCustomerAddress("");
    setSearchPhoneNumber("");
    setShowSuggestions(false);
    setCustomerSuggestions([]);
    setIsCustomerLocked(false);
    setErrors({});
  };

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
      productDiscount: 0,
    };

    setProducts((prev) => [ ...prev, newProduct]);
    setProductQuantities((prev) => ({ ...prev, [productId]: 1 }));
    setProductPrices((prev) => ({ ...prev, [productId]: productData.price }));
    setProductGstPercentages((prev) => ({
      ...prev,
      [productId]: productData.gst,
    }));
    setProductDiscountPercentage((prev) => ({
      ...prev,
      [productId]: 0,
    }));
    console.log(products);
    return true;
  };

  // handling  product serch for suggestion
  const handleProductSearch = async (formatted) => {
    try {
      const result = await dispatch(getProductsByIds(formatted)).unwrap();
      // console.log(result[0]);

      if (result.length > 0) {
        setSearchProductSuggestion(result);
      } else {
        setSearchProductSuggestion([]);
      }
    } catch (error) {
      AppToast.showError(error.error);
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
    console.log(id);
    // setManualSearchLoading(true);
    try {
      let result;
      if (id) {
        console.log(searchProductSuggestion);
        result = searchProductSuggestion.find((item) => item._id == id);
        console.log(result);
      } else {
        let found = await dispatch(
          getProductsByIds(manualProductSearch)
        ).unwrap();
        result = found[0];
      }

      if (result) {
        console.log(result);
        const productAdded = addProductToState(result);
        if (productAdded) {
          setManualProductSearch("");
          setSearchProductSuggestion([]);

          AppToast.showInfo(`${result.productName} added to invoice`);
        }
      }
    } catch (error) {
      AppToast.showError("No product found with that ID");
    } finally {
      setManualSearchLoading(false);
    }
  };

  const handleBarcodeSearch = async (barcode) => {
    console.log("this is the barcode", barcode);
    setBarcodeSearchLoading(true);

    try {
      const result = await dispatch(getProductsByIds(barcode)).unwrap();
      if (result) {
        const productAdded = addProductToState(result[0]);
        if (productAdded) {
          AppToast.showInfo(`${result[0].productName} added to invoice`);
        }
      }
    } catch (error) {
      AppToast.showError("No product found with that ID");
    } finally {
      setBarcodeSearchLoading(false);
      setShowScanner(false);
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
    let price = value;

    if (price === "") {
      setProductPrices((prev) => ({
        ...prev,
        [productId]: "",
      }));
      return;
    }

    price = parseFloat(price);

    if (isNaN(price)) price = 0;

    if (price < 0) price = 0;

    setProductPrices((prev) => ({
      ...prev,
      [productId]: price,
    }));
  };

  const handleGstChange = (productId, value) => {
    let gst = value;

    if (gst === "") {
      setProductGstPercentages((prev) => ({
        ...prev,
        [productId]: "",
      }));
      return;
    }

    gst = parseFloat(gst);

    if (isNaN(gst)) gst = 0;

    if (gst < 0) gst = 0;
    if (gst > 100) gst = 100;

    setProductGstPercentages((prev) => ({
      ...prev,
      [productId]: gst,
    }));
  };

  const handleFocus = (productId) => {
    setProductDiscountPercentage((prev) => ({
      ...prev,
      [productId]: "",
    }));
  };

  const handleDiscountChange = (productId, value) => {
    // Allow empty while typing
    if (value === "") {
      setProductDiscountPercentage((prev) => ({
        ...prev,
        [productId]: "",
      }));
      return;
    }

    let discount = parseFloat(value);

    if (isNaN(discount)) discount = 0;

    // Clamp
    if (discount > 100) discount = 100;
    if (discount < 0) discount = 0;

    setProductDiscountPercentage((prev) => ({
      ...prev,
      [productId]: discount,
    }));

    setProducts((prev) =>
      prev.map((p) =>
        p.productId === productId ? { ...p, productDiscount: discount } : p
      )
    );
  };

  const handlOveralleDiscountChange = (value) => {
    // const discount = parseFloat(value) || 0;
    if (value < 0) value = 0;
    if (value > 100) value = 100;
    setOverAllDiscountPercentage(value);
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
  };

  const calculateProductTotal = (productId) => {
    const product = products.find((p) => p.productId === productId);
    if (!product) return 0;

    const basePrice =
      productPrices[productId] !== undefined
        ? productPrices[productId]
        : product.basePrice;

    const gstPercentage =
      productGstPercentages[productId] !== undefined
        ? productGstPercentages[productId]
        : product.baseGst;

    const quantity = productQuantities[productId] || 0;

    const discountPercentage =
      productDiscountPercentage[productId] !== undefined
        ? productDiscountPercentage[productId]
        : product.productDiscount || 0;

    if (taxType === "inclusive") {
      const priceWithoutGst = basePrice * quantity;
      const discountAmount = (discountPercentage * priceWithoutGst) / 100;
      return priceWithoutGst - discountAmount;
    } else {
      const priceWithoutGst = basePrice * quantity;
      const gstAmount = (priceWithoutGst * gstPercentage) / 100;
      const totalBeforeDiscount = priceWithoutGst + gstAmount;
      const discountAmount = (discountPercentage * totalBeforeDiscount) / 100;
      return totalBeforeDiscount - discountAmount;
    }
  };

  const calculateTotals = () => {
    let subTotal = 0;
    let totalGst = 0;

    products.forEach((product) => {
      const productId = product.productId;
      const basePrice =
        productPrices[productId] !== undefined
          ? productPrices[productId]
          : product.basePrice;

      const gstPercentage =
        productGstPercentages[productId] !== undefined
          ? productGstPercentages[productId]
          : product.baseGst;

      const quantity = productQuantities[productId] || 0;

      const discountPercentage =
        productDiscountPercentage[productId] !== undefined
          ? productDiscountPercentage[productId]
          : product.productDiscount || 0;

      if (taxType === "inclusive") {
        const priceWithoutGst = basePrice / (1 + gstPercentage / 100);
        let totalBeforeDiscount = priceWithoutGst * quantity;
        const lineTotal =
          totalBeforeDiscount -
          (totalBeforeDiscount * discountPercentage) / 100;
        const gstAmount = (lineTotal * gstPercentage) / 100;

        subTotal += Number(lineTotal.toFixed(2));
        totalGst += Number(gstAmount.toFixed(2));
      } else {
        // For exclusive: price is without GST
        const totalBeforeDiscount = basePrice * quantity;
        const lineTotal =
          totalBeforeDiscount -
          (totalBeforeDiscount * discountPercentage) / 100;
        const gstAmount = (lineTotal * gstPercentage) / 100;

        subTotal += Number(lineTotal.toFixed(2));
        totalGst += Number(gstAmount.toFixed(2));
      }
    });
    let totalBeforeOveralldiscount = Number(subTotal + totalGst);
    // console.log(totalBeforeOveralldiscount);
    // console.log(overAllDiscountPercentage);
    const grandTotal =
      totalBeforeOveralldiscount -
      (totalBeforeOveralldiscount * overAllDiscountPercentage) / 100;

    return {
      subTotal: subTotal,
      totalGst: totalGst,
      grandTotal: grandTotal,
      totalBeforeOveralldiscount,
    };
  };

  const { subTotal, totalGst, totalBeforeOveralldiscount, grandTotal } =
    calculateTotals();

  const validateField = (field, value) => {
    let error = null;

    switch (field) {
      case "gstNumber":
        if (value.trim() !== "" && !/^[0-9A-Z]{15}$/.test(value.trim())) {
          error = "GST Number must be 15 characters";
        }
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const validateCustomerForm = () => {
    let newErrors = {};

    if (!customerName.trim())
      newErrors.customerName = "Customer Name is required";
    if (!customerPhone.trim()) newErrors.customerPhone = "Phone is required";
    else if (!/^\d{10}$/.test(customerPhone))
      newErrors.customerPhone = "Phone must be 10 digits";
    if (!customerEmail.trim()) newErrors.customerEmail = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(customerEmail))
      newErrors.customerEmail = "Email is invalid";
    if (
      customerGst.trim() !== "" &&
      !/^[0-9A-Z]{15}$/.test(customerGst.trim())
    ) {
      newErrors.gstNumber = "GST Number must be 15 characters";
    }
    // if (!customerState.trim()) newErrors.state = "State is required";
    // if (!customerPin.trim()) newErrors.pincode = "Pincode is required";
    // else if (!/^\d{6}$/.test(customerPin)) newErrors.pincode = "Pincode must be 6 digits";
    if (customerPin.trim() !== "" && !/^\d{6}$/.test(customerPin.trim())) {
      newErrors.pincode = "Pincode must be 6 digits";
    }

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

    //  Scroll immediately to first error (top-to-bottom order)
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
    customerEmail,
    customerGst,
    customerState,
    customerPin,
    customerAddress,

    products,
    productQuantities,
    productPrices,
    productGstPercentages,
    productDiscountPercentage,

    taxType,
    paymentStatus,
    paymentType,
    invoiceDate,
    overAllDiscountPercentage,
  };

  console.log("Saving draft:", draft);
  sessionStorage.setItem("invoiceDraft", JSON.stringify(draft));
}, [
  isDraftRestored,

  customerId,
  customerName,
  customerPhone,
  customerEmail,
  customerGst,
  customerState,
  customerPin,
  customerAddress,

  products,
  productQuantities,
  productPrices,
  productGstPercentages,
  productDiscountPercentage,

  taxType,
  paymentStatus,
  paymentType,
  invoiceDate,
  overAllDiscountPercentage,
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

        const discountPercentage =
          productDiscountPercentage[productId] !== undefined
            ? productDiscountPercentage[productId]
            : product.productDiscount || 0;

        return {
          productId: productId,
          quantity: productQuantities[productId] || 0,
          price: currentPrice,
          gst: currentGst,
          discount: discountPercentage,
          updates: {
            priceChanged: currentPrice !== product.basePrice,
            gstChanged: currentGst !== product.baseGst,
          },
        };
      });

      // const selectedCustomer = customerSuggestions.find(
      //   (customer) => customer.phone === customerPhone
      // );

      // const customerId = selectedCustomer ? selectedCustomer._id : null;

      const formattedDate = formatDateForDisplay(invoiceDate);
      const payload = {
        customerId: customerId,
        customerName: customerName,
        customerPhone: customerPhone,
        customerEmail: customerEmail,
        customerGst: customerGst,
        customerState: customerState,
        customerPin: customerPin,
        customerAddress: customerAddress,
        gstType: taxType,
        paymentMode:
          paymentStatus.toUpperCase() === "UNPAID"
            ? "NA"
            : paymentType.toUpperCase(),
        //  paymentMode: paymentStatus.toUpperCase() === "UNPAID"
        // ? "CARD"
        // : paymentType.toUpperCase(),
        status: paymentStatus.toUpperCase(),
        invoiceDate: formattedDate,
        grandDiscount: overAllDiscountPercentage,
        products: finalProducts,
      };

      console.log("Invoice payload:", payload);

      try {
        const response = await dispatch(createInvoice(payload)).unwrap();
        setInvoiceDataToPrint(response);
        SetInvoiceCreated(true);
        sessionStorage.removeItem("invoiceDraft");
        AppToast.showSuccess("Invoice created successfully!");
      } catch (error) {
        AppToast.showError(error.error || "Failed to create invoice");
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
      return; // stop execution if invalid
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
      setManualProductSearch("");
      setTaxType("inclusive");
      setPaymentStatus("");
      setPaymentType("");
      setInvoiceDataToPrint(null)
      setInvoiceDate(new Date());
      setOverAllDiscountPercentage("0");
      SetInvoiceCreated(false);
      sessionStorage.removeItem("invoiceDraft");
      AppToast.showSuccess("All data cleared!");
    }
  };

  return (
    <div className="p-3 sm:p-6 bg-gray-50 min-h-screen space-y-6">
      {/* CUSTOMER INFORMATION - EXACT SAME UI */}
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
              {customerDataLoading ? (
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Spinner size={16} color="#9CA3AF" />
                </div>
              ) : (
                <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              )}

              <input
                value={serchPhoneNumber}
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
              Customer Name *
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
              Phone Number *
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
                // onChange={(e) => setCustomerPhone(e.target.value)}
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
              <input
                name="customerEmail"
                type="email"
                disabled={isCustomerLocked}
                title={
                  isCustomerLocked &&
                  "Locked because a saved customer is selected. Click Reset to edit."
                }
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="customer@example.com"
                className={`w-full border  ${
                  errors.customerEmail ? "border-red-500" : "border-gray-300"
                }  rounded-md pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none`}
              />
            </div>
            {errors.customerEmail && (
              <p className="text-red-500 text-xs mt-1">
                {errors.customerEmail}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GST Number
            </label>
            <div className="relative">
            <FaTag className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              name="gstNumber"
              value={customerGst}
              maxLength={15}
              disabled={isCustomerLocked}
              title={
                isCustomerLocked &&
                "Locked because a saved customer is selected. Click Reset to edit."
              }
              onChange={(e) => {
                setCustomerGst(e.target.value);
                validateField("gstNumber", e.target.value);
              }}
              placeholder="22AAAAA0000A1Z5"
              className={`w-full border  ${
                errors.gstNumber ? "border-red-500" : "border-gray-300"
              }   rounded-md pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none`}
            />
            </div>
            {errors.gstNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.gstNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State
            </label>
            <State
              className={`w-full border  ${
                errors.state ? "border-red-500" : "border-gray-300"
              }  rounded-md pl-4 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none`}
              name="state"
              onChange={(e) => setCustomerState(e.target.value)}
              value={customerState}
              disabled={isCustomerLocked}
              title={
                isCustomerLocked &&
                "Locked because a saved customer is selected. Click Reset to edit."
              }
            />
            {errors.state && (
              <p className="text-red-500 text-xs mt-1">{errors.state}</p>
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
                value={customerPin}
                disabled={isCustomerLocked}
                title={
                  isCustomerLocked &&
                  "Locked because a saved customer is selected. Click Reset to edit."
                }
                onChange={(e) => {
                  let val = e.target.value.replace(/\D/g, "");
                  if (val.length > 6) val = val.slice(0, 6);
                  setCustomerPin(val);
                }}
                // onChange={(e) => setCustomerPin(e.target.value)}
                placeholder="Enter 6-digit pincode"
                className={`w-full border  ${
                  errors.pincode ? "border-red-500" : "border-gray-300"
                }  rounded-md pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none
                [&::-webkit-outer-spin-button]:appearance-none 
                    [&::-webkit-inner-spin-button]:appearance-none`}
              />
            </div>
            {errors.pincode && (
              <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              name="customerAddress"
              placeholder="Enter complete address"
              disabled={isCustomerLocked}
              title={
                isCustomerLocked &&
                "Locked because a saved customer is selected. Click Reset to edit."
              }
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              rows={2}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
            ></textarea>
          </div>
        </div>
      </div>

      {/* ADD PRODUCTS - EXACT SAME UI */}
      <div
        className="shadow-sm rounded-xl border border-blue-100 p-4 sm:p-6 relative"
        style={{
          background: "linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)",
        }}
      >
        {/* Header */}
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

        {/* Search & Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full relative">
          {/* Manual Product Input */}
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

            {/* 🔽 Suggestions Dropdown */}
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

          {/* Scan Barcode Button */}
          <button
            onClick={() => setShowScanner(true)}
            disabled={barcodeSearchLoading}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 
                 rounded-md hover:bg-gray-50 text-sm text-gray-700 transition w-full sm:w-auto 
                 disabled:opacity-50 disabled:cursor-not-allowed"
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
            onClick={()=>handleManualProductAdd()}
            disabled={manualSearchLoading}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#0a1628] hover:bg-gray-700 
                 text-white rounded-md text-sm transition w-full sm:w-auto 
                 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-4 h-4 flex items-center justify-center">
              {manualSearchLoading ? (
                <Spinner size={16} color="#FFFFFF" />
              ) : (
                <span className="text-lg font-semibold">+</span>
              )}
            </div>
            Add Product
          </button> */}
        </div>
      </div>

      {/* PRODUCT LIST - REMOVED SELECT CHECKBOX */}
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

        {/*  MOBILE CARD VIEW (<640px) - REMOVED CHECKBOX */}
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
                {/* REMOVED CHECKBOX */}
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
                    onChange={(e) =>
                      handlePriceChange(item.productId, e.target.value)
                    }
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
                    onChange={(e) =>
                      handleGstChange(item.productId, e.target.value)
                    }
                    className="ml-2 w-14 border border-gray-300 rounded px-2 py-0.5 text-xs focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                  {/* <select
                    value={
                      productGstPercentages[item.productId] !== undefined
                        ? productGstPercentages[item.productId]
                        : item.baseGst
                    }
                    onChange={(e) =>
                      handleGstChange(item.productId, e.target.value)
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
                  <span className="text-gray-500">Discount %</span>
                  <input
                    type="number"
                    value={
                      productDiscountPercentage[item.productId] !== undefined &&
                      productDiscountPercentage[item.productId] !== null
                        ? productDiscountPercentage[item.productId]
                        : item.productDiscount || 0
                    }
                    onFocus={() => handleFocus(item.productId)}
                    onChange={(e) =>
                      handleDiscountChange(item.productId, e.target.value)
                    }
                    className="ml-2 w-14 border border-gray-300 rounded px-2 py-0.5 text-xs focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                </div>
                <div>
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
                      if (
                        e.target.value.length > 1 &&
                        e.target.value.startsWith("0")
                      ) {
                        e.target.value = e.target.value.replace(/^0+/, "");
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

        <div className="hidden sm:block overflow-x-auto border border-gray-100 rounded-lg max-h-[400px]">
          <table className="w-full text-sm text-left text-gray-700 border-collapse min-w-full">
            <thead className="bg-gray-100 text-gray-600 sticky top-0 z-10">
              <tr>
                {/* REMOVED SELECT TH */}
                <th className="px-3 py-3">Product</th>
                <th className="px-3 py-3">HSN</th>
                <th className="px-3 py-3">Price</th>
                <th className="px-3 py-3">GST %</th>
                <th className="px-3 py-3 text-center">Qty</th>
                <th className="px-3 py-3 text-center">Discount %</th>
                <th className="px-3 py-3 text-right">Total</th>
                <th className="px-3 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((item) => (
                <tr key={item.productId} className="hover:bg-gray-50">
                  {/* REMOVED SELECT TD */}
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
                          if (
                            e.target.value.length > 1 &&
                            e.target.value.startsWith("0")
                          ) {
                            e.target.value = e.target.value.replace(/^0+/, "");
                          }
                        }}
                      onChange={(e) =>
                        handlePriceChange(item.productId, e.target.value)
                      }
                      className="w-24 border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-400 focus:outline-none
                      [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                      "
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
                          if (
                            e.target.value.length > 1 &&
                            e.target.value.startsWith("0")
                          ) {
                            e.target.value = e.target.value.replace(/^0+/, "");
                          }
                        }}
                      onChange={(e) =>
                        handleGstChange(item.productId, e.target.value)
                      }
                      className="w-16 border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-400 focus:outline-none
                      [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                      
                      "
                    />
                    {/* <select
                      value={
                        productGstPercentages[item.productId] !== undefined
                          ? productGstPercentages[item.productId]
                          : item.baseGst
                      }
                      onChange={(e) =>
                        handleGstChange(item.productId, e.target.value)
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
                          if (
                            e.target.value.length > 1 &&
                            e.target.value.startsWith("0")
                          ) {
                            e.target.value = e.target.value.replace(/^0+/, "");
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
                  <td className="px-3 py-3 text-center">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={
                        productDiscountPercentage[item.productId] !==
                          undefined &&
                        productDiscountPercentage[item.productId] !== null
                          ? productDiscountPercentage[item.productId]
                          : item.productDiscount || 0
                      }
                      // onInput={(e) => {
                      //   // Remove leading zeros immediately as user types
                      //   if (
                      //     e.target.value.length > 1 &&
                      //     e.target.value.startsWith("0")
                      //   ) {
                      //     e.target.value = e.target.value.replace(/^0+/, "");
                      //   }

                      // }}
                      onFocus={() => handleFocus(item.productId)}
                      onChange={(e) =>
                        handleDiscountChange(item.productId, e.target.value)
                      }
                      className="w-16 border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-400 focus:outline-none
                         [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                      "
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
                Payment Options *
              </label>
              <Dropdown
                options={["Paid", "Unpaid"]}
                placeholder="Select payment option"
                className={`w-full ${
                  errors.paymentStatus ? "border-red-500" : ""
                }`}
                value={paymentStatus}
                onChange={(value) => {
                  setPaymentStatus(value);
                  if (value === "Unpaid") {
                    setPaymentType(""); // clear payment mode
                  }
                }}
              />
              {errors.paymentStatus && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.paymentStatus}
                </p>
              )}
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
            {/* <div className="flex justify-between">
              <span>total</span>
              <span className="text-green-600 font-medium">
                ₹{totalBeforeOveralldiscount.toFixed(2)}
              </span>
            </div> */}
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Grand Discount %</span>
              <div>
              <input
                type="number"
                value={overAllDiscountPercentage}
                onInput={(e) => {
                    // Remove leading zeros immediately as user types
                    if (e.target.value.length > 1 && e.target.value.startsWith('0')) {
                      e.target.value = e.target.value.replace(/^0+/, '');
                    }
                  }}
                onChange={(e) => handlOveralleDiscountChange(e.target.value)}
                className="w-20   rounded-md px-2 py-1 border-b-4  focus:border-b-2 focus:border-gray-400 focus:outline-none
                 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="text-gray-500"> %</span>
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-md flex justify-between font-semibold text-gray-800">
              <span>Grand Total</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={handleCreateInvoice}
                disabled={createInvoiceLoading || invoiceCreated}
                className="w-full bg-[#0a1628] text-white py-2.5 rounded-md hover:bg-gray-700 transition text-sm font-medium disabled:opacity-50  flex items-center justify-center gap-2"
              >
                {createInvoiceLoading ? (
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
                className="w-full border border-gray-600 text-gray-700 py-2.5 rounded-md hover:bg-gray-50 transition text-sm font-medium disabled:opacity-50"
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
        isQuickPrint= {false}
      />
    </div>
  );
}

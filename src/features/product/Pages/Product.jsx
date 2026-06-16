import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import ScannerPopup from "../../../components/ScannerPopup";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  exportProducts,
} from "../productThunk";
// import { addProductLocally } from "../productSlice";
import ProductTableSkeleton from "./ProductTableSkeleton";
import AppToast from "../../../services/toastService";
import BulkUploadModel from "../Components/BulkUploadModel";
import { FaPrint } from "react-icons/fa";
import printing from "../../../assets/printing.png";
import BarcodePrintModel from "../Components/BarcodePrintModel";
import {
  FaChevronLeft,
  FaChevronRight,
  FaMagnifyingGlass,
  FaTrash,
  FaTag,
  FaPenToSquare,
  FaBox,
  FaIndianRupeeSign,
  FaCartShopping,
  FaArrowRotateLeft,
  FaUserGroup,
  FaDownload,
  FaUpload,
  FaFileLines,
} from "react-icons/fa6";
import Spinner from "../../../components/Spinner";
import { IoKeySharp } from "react-icons/io5";

const Product = () => {
  const dispatch = useDispatch();
  const { products, loading, error, pagination, updateLoading, createLoading, exportLoading,  } =
    useSelector((state) => state.product);

  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [gst, setGst] = useState("");
  const [hsnSac, setHsnsac] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [barCode, setBarcode] = useState("");
  const [hasBarcode, setHasBarcode] = useState("");
  const [id, setId] = useState(null);
  const [localProducts, setLocalProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const searchTimeoutRef = useRef(null);
  const [page, setPage] = useState(1);
  const [showScanner, setShowScanner] = useState(false);

  //bulk upload states
  const [bulkUploadModel, setBulkUploadModel] = useState(false);

  //barcode print related usestate
  const [printData, setPrintData] = useState(null);
  const [openBarcodeModel, setOpenBarcodeModel] = useState(false);

  const [errors, setErrors] = useState({});
  const formRef = useRef(null);

  // fetch products on mount
  useEffect(() => {
    if (!products || products.length === 0) {
      dispatch(fetchProducts(page));
    }
  }, []);

  useEffect(() => {
    dispatch(fetchProducts(page));
  }, [page]);

  // sync localProducts with store products
  useEffect(() => {
    if (Array.isArray(products)) {
      setLocalProducts(products);
    }
  }, [products]);

  // validate form
  const validateForm = () => {
    let newErrors = {};
    const priceStr = String(price || "");
    const gstStr = String(gst || "");
    const hsnStr = String(hsnSac || "");
    const qtyStr = String(quantity || "");

    if (!productName.trim()) newErrors.name = "Product Name is required";
    if (!priceStr.trim()) newErrors.price = "Price is required";
    else if (!/^\d+(\.\d{1,2})?$/.test(priceStr))
      newErrors.price = "Invalid price format";

    if (!gstStr.trim()) newErrors.gst = "GST % is required";
    else if (!/^\d+(\.\d{1,2})?$/.test(gstStr))
      newErrors.gst = "Invalid GST percentage";

    if (!hsnStr.trim()) newErrors.hsnSac = "HSN/SAC Code is required";
    else if (!/^\d{4,8}$/.test(hsnStr))
      newErrors.hsnSac = "HSN/SAC must be 4–8 digits";

    if (!qtyStr.trim()) newErrors.quantity = "Quantity is required";
    else if (!/^\d+$/.test(qtyStr))
      newErrors.quantity = "Quantity must be a number";

    if (!description.trim()) newErrors.description = "Description is required";
    if (!hasBarcode) newErrors.hasBarcode = "Please select an option";
    if (hasBarcode === "yes" && !barCode.trim())
      newErrors.barcode = "Barcode is required when Yes is selected";

    return newErrors;
  };

  // reset form
  const handleReset = () => {
    setId(null);
    setProductName("");
    setPrice("");
    setGst("");
    setHsnsac("");
    setQuantity("");
    setDescription("");
    setBarcode("");
    setHasBarcode("");
    setErrors({});
  };

  // submit form for add/edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const productData = {
        productName,
        price: Number(price),
        gst: Number(gst),
        hsnOrSac: Number(hsnSac),
        quantity: Number(quantity),
        description,
        barcodedProduct: hasBarcode === "yes",
        ...(hasBarcode === "yes" && barCode.trim() !== ""
          ? { productId: barCode.trim() }
          : {}),
      };

      try {
        if (id) {
          // === Update existing product ===
          const response = await dispatch(
            updateProduct({ productId: id, updatedData: productData })
          ).unwrap();

          if (response?.data) {
            AppToast.showSuccess("Product updated successfully!");
            handleReset();
          } else {
            AppToast.showError("Failed to update product. Try again.");
          }
        } else {
          // === Create new product ===
          const response = await dispatch(createProduct(productData)).unwrap();

          if (response?.data) {
            AppToast.showSuccess("Product created successfully!");
            handleReset();
          } else {
            AppToast.showError("Failed to create product. Try again.");
          }
        }
      } catch (err) {
        const msg =
          err?.message || err?.error || "Something went wrong. Try again.";
        AppToast.showError(msg);
      }
    }
  };

  // edit product
  const handleEdit = (product) => {
    setId(product._id);
    setProductName(product.productName);
    setPrice(String(product.price)); // Convert to string
    setGst(String(product.gst));
    setHsnsac(String(product.hsnOrSac));
    setQuantity(String(product.quantity));
    setDescription(product.description || "");
    setHasBarcode(product.barcodedProduct ? "yes" : "no");
    setBarcode(product.productId || "");
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // delete product
  const handleDelete = async (productId) => {
    if (!productId) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmed) return;

    const previous = localProducts;
    setLocalProducts((prev) => prev.filter((p) => p._id !== productId));

    try {
      const res = await dispatch(deleteProduct(productId)).unwrap();
      AppToast.showSuccess(res?.message || "Product deleted successfully");
    } catch (err) {
      setLocalProducts(previous);
      const msg = err?.message || err?.error || "Failed to delete product";
      AppToast.showError(msg);
    }
  };

  // search product
  const handleSearch = (query) => {
    setSearchTerm(query);

    // clear old timer
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    // debounce — wait 300ms after typing stops
    searchTimeoutRef.current = setTimeout(async () => {
      if (!query.trim()) {
        // empty → reload default products
        dispatch(fetchProducts(1));
      } else {
        try {
          const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          await dispatch(searchProducts(safeQuery)).unwrap();
        } catch (err) {
          AppToast.showError("Failed to search products");
        }
      }
    }, 300);
  };

  // Open barcode popup
  // const openBarcodePopup = () => {
  //   setShowScanner(true);
  // };

  // Handle detected barcode
  const handleDetected = async (code) => {
    try {
      if (!code) return;
      const detectedCode = code.toString().trim();
      AppToast.showInfo(`Scanned Barcode: ${detectedCode}`);

      // Set barcode automatically
      setBarcode(detectedCode);
      setHasBarcode("yes");

      setShowScanner(false);
    } catch (error) {
      console.error("Error handling barcode:", error);
      AppToast.showError("Failed to capture barcode");
    }
  };

  // filter products based on search term
  // const products = localProducts
  //   ?.filter((product) => {
  //     const name = product.productName?.toLowerCase() || "";
  //     const id = String(product.productId || "");
  //     const hsn = String(product.hsnOrSac || "");
  //     const desc = product.description?.toLowerCase() || "";
  //     return (
  //       name.includes(searchTerm.toLowerCase()) ||
  //       id.includes(searchTerm) ||
  //       hsn.includes(searchTerm) ||
  //       desc.includes(searchTerm.toLowerCase())
  //     );
  //   }) || [];

  //bulkUpload model handlers
  const openBulkUploadModel = () => {
    setBulkUploadModel(true);
  };

  const handleDownloadTemplate = () => {
    const link = document.createElement("a");
    link.href = "/RITS_BILLINGSUITE_BULKUPLOD_TEMPLATE.xlsx";
    link.download = "RITS_BILLINGSUITE_BULKUPLOD_TEMPLATE.xlsx";
    link.click();
  };

  // export handler
  const handleExportProducts = async () => {
    try {
      await dispatch(exportProducts()).unwrap();
    
    } catch (error) {
      if (error) {
        AppToast.showErrorToast(error?.message || error?.error || "Failed to export products");
      }
    }
  };

  //handle open barcode printnt model
  const handlePrintBarcode = (product) => {
    setPrintData(product);
    setOpenBarcodeModel(true);
  };

  return (
    <div className="p-3 sm:p-6 bg-gray-50 min-h-screen space-y-6">
      {/* PRODUCT FORM */}
      <div
        ref={formRef}
        className="bg-white shadow-sm rounded-xl border border-gray-200 p-4 sm:p-6"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
              <FaBox className="text-base" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                {id ? "Update Product" : "Add Product"}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                {id ? "Modify product details" : "Enter product information"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center justify-center gap-2 text-red-600 border border-red-200 hover:bg-red-50 px-3.5 py-1.5 rounded-md transition text-sm font-medium"
          >
            <FaArrowRotateLeft className="w-4 h-4" />
            Reset
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <div className="relative">
                <FaBox className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  value={productName}
                  // onChange={(e) => setProductName(e.target.value)}
                  onChange={(e) => {
                    const value = e.target.value;
                    const formatted =value.charAt(0).toUpperCase() + value.slice(1);

                    setProductName(formatted);
                  }}
                  placeholder="Enter product name"
                  className={`w-full border rounded-md pl-9 pr-3 py-2 text-sm focus:ring-2 focus:outline-none ${
                    errors.name
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 focus:ring-blue-400"
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-xs mt-0.5">{errors.name}</p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₹) *
              </label>
              <div className="relative">
                <FaIndianRupeeSign className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="number"
                  min={0}
                  value={price}
                  onChange={(e) => {
                    let val = e.target.value;

                    if (val === "") {
                      setPrice("");
                      return;
                    }

                    // val = parseFloat(val);

                    if (isNaN(val) || val < 0) val = 0;

                    setPrice(val);
                  }}
                  placeholder="Enter price"
                  className={`w-full border rounded-md pl-9 pr-3 py-2 text-sm focus:ring-2 focus:outline-none ${
                    errors.price
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 focus:ring-blue-400"
                  }  
                   [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                />
              </div>
              {errors.price && (
                <p className="text-red-500 text-xs mt-0.5">{errors.price}</p>
              )}
            </div>

            {/* GST */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GST % *
              </label>
              <div className="relative">
                <FaTag className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="number"
                  value={gst}
                  onChange={(e) => {
                    let val = e.target.value;
                    if (val === "") {
                      setGst("");
                      return;
                    }

                    // val = parseFloat(val);

                    if (Number(val) < 0) val = "0";
                    if (Number(val) > 100) val = "100";
                    setGst(val);
                  }}
                  placeholder="Enter GST %"
                  className={`w-full border rounded-md pl-9 pr-3 py-2 text-sm focus:ring-2 focus:outline-none ${
                    errors.gst
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 focus:ring-blue-400"
                  }
                   [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
                />
                {/* <select
                  value={gst}
                  onChange={(e) => setGst(e.target.value)}
                  className={`w-full border rounded-md pl-9 pr-3 py-2 text-sm bg-white
                    focus:ring-2 focus:outline-none appearance-none
                    ${
                      errors.gst
                        ? "border-red-500 focus:ring-red-400"
                        : "border-gray-300 focus:ring-blue-400"
                    }
                  `}
                >
                  <option value="">Select GST %</option>
                  <option value="0">0%</option>
                  <option value="5">5%</option>
                  <option value="18">18%</option>
                  <option value="40">40%</option>
                </select> */}
              </div>
              {errors.gst && (
                <p className="text-red-500 text-xs mt-0.5">{errors.gst}</p>
              )}
            </div>

            {/* HSN/SAC */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                HSN/SAC *
              </label>
              <input
                type="text"
                value={hsnSac}
                maxLength={8}
                onChange={(e) => setHsnsac(e.target.value)}
                placeholder="4–8 digit HSN/SAC"
                className={`w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:outline-none ${
                  errors.hsnSac
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-400"
                }`}
              />
              {errors.hsnSac && (
                <p className="text-red-500 text-xs mt-0.5">{errors.hsnSac}</p>
              )}
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity *
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => {
                  let val = e.target.value;
                  if (val === "") {
                    setQuantity("");
                    return;
                  }

                  // val = parseFloat(val);
                  if (isNaN(val) || val < 0) val = 0;
                  
                  setQuantity(val);
                }}
                placeholder="Enter quantity"
                className={`w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:outline-none ${
                  errors.quantity
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-blue-400"
                }
                 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
              />
              {errors.quantity && (
                <p className="text-red-500 text-xs mt-0.5">{errors.quantity}</p>
              )}
            </div>

            {/* Barcode Area */}

            <div className="flex flex-col justify-end w-full">
              {/* If not selected yet or “No” selected → show toggle */}
              {hasBarcode !== "yes" ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 mt-1">
                    Have Barcode? *
                  </label>
                  <div className="flex items-center gap-5 mt-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="barcode"
                        value="yes"
                        checked={hasBarcode === "yes"}
                        onChange={(e) => setHasBarcode(e.target.value)}
                        className="w-4 h-4 text-blue-600 cursor-pointer"
                      />
                      <span className="text-gray-700 text-sm">Yes</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="barcode"
                        value="no"
                        checked={hasBarcode === "no"}
                        onChange={(e) => {
                          setHasBarcode(e.target.value);
                          setBarcode("");
                        }}
                        className="w-4 h-4 text-blue-600 cursor-pointer"
                      />
                      <span className="text-gray-700 text-sm">No</span>
                    </label>
                  </div>
                  {errors.hasBarcode && (
                    <p className="text-red-500 text-xs mt-0.5">
                      {errors.hasBarcode}
                    </p>
                  )}
                </div>
              ) : (
                /* When “Yes” selected → Replace toggle with Scan Button */
                <div className="flex flex-col justify-end w-full">
                  <div className="flex gap-2 w-full">
                    {/* Scan Button - 60% width */}
                    <button
                      type="button"
                      onClick={() => setShowScanner(true)}
                      className="flex-1 basis-[60%] h-[38px] bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-md font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 text-sm px-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 4v16m3-16v16m3-16v16m3-16v16m3-16v16m3-16v16m3-16v16"
                        />
                      </svg>
                      Scan Barcode
                    </button>

                    {/* Cancel (X) Button - 40% width */}
                    <button
                      type="button"
                      onClick={() => {
                        setHasBarcode("no");
                        setBarcode("");
                      }}
                      className="basis-[40%] h-[38px] flex items-center justify-center border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition shadow-sm text-sm font-medium"
                      title="Cancel Barcode"
                    >
                      Cancel
                    </button>
                  </div>

                  {/* Barcode Input (below both buttons) */}
                  {barCode && (
                    <input
                      type="text"
                      value={barCode}
                      onChange={(e) => setBarcode(e.target.value)}
                      placeholder="Scanned barcode will appear here"
                      className="mt-2 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              value={description}
              // onChange={(e) => setDescription(e.target.value)}
              onChange={(e) => {
                const value = e.target.value;
                const formatted = value.charAt(0).toUpperCase() + value.slice(1);
                setDescription(formatted);
              }}
              rows={2}
              placeholder="Enter product description"
              className={`w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:outline-none resize-none ${
                errors.description
                  ? "border-red-500 focus:ring-red-400"
                  : "border-gray-300 focus:ring-blue-400"
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-0.5">
                {errors.description}
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-start pt-1">
            <button
              type="submit"
              className="px-6 py-2 bg-[#0a1628] text-white font-medium rounded-md hover:bg-slate-700 transition text-sm flex items-center gap-2"
            >
              {id ? (
                <>
                  {updateLoading ? (
                    <Spinner size={16} color="#ffff" />
                  ) : (
                    <FaPenToSquare className="w-4 h-4" />
                  )}
                  Update Product
                </>
              ) : (
                <>
                  {createLoading ? (
                    <Spinner size={16} color="#ffff" />
                  ) : (
                    <span className="text-lg leading-none">+</span>
                  )}
                  Add Product
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* PRODUCT LIST */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full">
              <FaBox className="text-lg" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-800">
                Product List
              </h2>
              <p className="text-sm text-gray-500">
                {products?.length || 0} products found
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button
              onClick={handleDownloadTemplate}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 bg-white hover:bg-gray-200 text-black text-sm rounded-md transition-colors"
            >
              <FaDownload className="text-sm" />
              Download Template
            </button>

            <button
              onClick={handleExportProducts}
              disabled={exportLoading}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 bg-white hover:bg-gray-200 text-black text-sm rounded-md transition-colors disabled:opacity-60"
            >
              <FaDownload className="text-sm" />
              {exportLoading ? "Exporting..." : "Export Products"}
            </button>


            {/* Upload button */}
            <button
              onClick={openBulkUploadModel}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 bg-white hover:bg-gray-200 text-black text-sm rounded-md transition-colors"
            >
              <FaUpload className="text-sm" />
              Bulk Upload
            </button>

            <div className="relative w-full md:w-64">
              <FaMagnifyingGlass className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full border border-gray-300 rounded-md pl-9 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* === LOADING & ERROR HANDLER === */}
        {loading ? (
          <ProductTableSkeleton />
        ) : error ? (
          <div className="text-center py-10 text-red-500">
            {typeof error === "object"
              ? error?.message || error?.error || "Failed to load products"
              : error || "Failed to load products"}
          </div>
        ) : (
          <>
            {/* --- Desktop Table --- */}
            <div className="hidden sm:block overflow-x-auto border border-gray-100 rounded-lg min-h-[300px] max-h-[400px]">
              <table className="w-full text-sm text-left text-gray-700 border-collapse min-w-full">
                <thead className="bg-gray-100 text-gray-600 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Name</th>
                    <th className="px-4 py-3 font-semibold">Product ID</th>
                    {/* <th className="px-4 py-3 font-semibold">HSN</th> */}
                    <th className="px-4 py-3 font-semibold">Price</th>
                    <th className="px-4 py-3 font-semibold">GST</th>
                    <th className="px-4 py-3 font-semibold">Quantity</th>
                    <th className="px-4 py-3 font-semibold">Description</th>
                    <th className="px-4 py-3 text-center font-semibold">
                      Actions
                    </th>
                    <th className="px-4 py-3 text-center font-semibold">
                      Barcode Print
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.length > 0 ? (
                    products.map((product) => (
                      <tr
                        key={product._id}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {product.productName}
                        </td>
                        <td className="px-4 py-3">{product.productId}</td>
                        {/* <td className="px-4 py-3">{product.hsnOrSac}</td> */}
                        <td className="px-4 py-3">₹{product.price}</td>
                        <td className="px-4 py-3">{product.gst}%</td>
                        <td className="px-4 py-3">{product.quantity}</td>
                        <td className="px-4 py-3">{product.description}</td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="text-blue-600 bg-white shadow-sm hover:shadow-md hover:bg-blue-50 px-3 py-1.5 rounded-lg flex items-center gap-1 text-sm transition"
                            >
                              <FaPenToSquare className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDelete(product._id)}
                              className="text-red-600 bg-white shadow-sm hover:shadow-md hover:bg-red-50 px-3 py-1.5 rounded-lg flex items-center gap-1 text-sm transition"
                            >
                              <FaTrash className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => handlePrintBarcode(product)}
                            className="text-green-600 bg-white shadow-sm hover:shadow-md hover:bg-green-50 px-3 py-1.5 rounded-lg flex items-center justify-center transition mx-auto"
                          >
                            <img
                              src={printing}
                              alt="Print"
                              className="w-4 h-4"
                            />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="text-center py-6 text-gray-500"
                      >
                        <div className="text-center py-16">
                          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                            <FaBox className="text-3xl text-gray-400" />
                          </div>
                          <p className="text-gray-500 text-sm">
                            No Product found.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* --- Mobile Card View --- */}
            <div className="sm:hidden space-y-3">
              {products.length > 0 ? (
                products.map((product) => (
                  <div
                    key={product._id}
                    className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition bg-white"
                  >
                    {/* Header */}
                    <h3 className="font-semibold text-gray-900 text-base mb-3 flex items-center gap-2">
                      <FaBox className="text-gray-400" />
                      {product.productName}
                    </h3>

                    {/* Product Info - Grid 2 Columns */}
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-700 mb-3">
                      {/* <p className="flex items-center gap-2">
                        <FaTag className="text-gray-400" /> HSN: {product.hsnOrSac}
                      </p> */}
                      <p className="flex items-center gap-2 justify-start">
                        <IoKeySharp className="text-gray-400" />
                        {product.productId}
                      </p>
                      <p className="flex items-center gap-2">
                        <FaCartShopping className="text-gray-400" /> Qty:{" "}
                        {product.quantity}
                      </p>
                      <p className="flex items-center gap-2">
                        <FaTag className="text-gray-400" /> GST: {product.gst}%
                      </p>
                      <p className="flex items-center gap-2 justify-start">
                        <FaIndianRupeeSign className="text-gray-400" />
                        {product.price}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-3 flex items-start gap-2 leading-snug">
                      <FaFileLines className="text-gray-400 mt-0.5" />{" "}
                      {product.description}
                    </p>

                    {/* Barcode (Optional) */}
                    {product.barcodedProduct && (
                      <p className="text-xs text-gray-400 flex items-center gap-2 mb-2 font-medium">
                        <FaBox className="text-gray-400" /> Product ID:{" "}
                        {product.productId}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 bg-white shadow-sm hover:shadow-md hover:bg-blue-50 px-3 py-1.5 rounded-lg flex items-center gap-1 text-sm transition"
                      >
                        <FaPenToSquare className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(product._id, product.productName)
                        }
                        className="text-red-600 bg-white shadow-sm hover:shadow-md hover:bg-red-50 px-3 py-1.5 rounded-lg flex items-center gap-1 text-sm transition"
                      >
                        <FaTrash className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handlePrintBarcode(product)}
                        className="text-green-600 bg-white shadow-sm hover:shadow-md hover:bg-green-50 px-3 py-1.5 rounded-lg flex items-center gap-1 text-sm transition"
                      >
                        <img
                          src={printing}
                          alt="Print"
                          className="w-3.5 h-3.5"
                        />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">
                  <div className="text-center py-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                      <FaBox className="text-3xl text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm">No Prouct found.</p>
                  </div>
                </p>
              )}
            </div>
            {/* Pagination */}
            {pagination?.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
                {/* Prev Button */}
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  className={`flex items-center gap-1 px-3 py-2 text-sm rounded-md border transition ${
                    page <= 1
                      ? "text-gray-400 cursor-not-allowed border-gray-200"
                      : "text-gray-700 hover:bg-gray-50 border-gray-300"
                  }`}
                >
                  <FaChevronLeft className="w-3 h-3" /> Previous
                </button>

                {/* Page Numbers */}
                <div className="flex gap-1 items-center">
                  {/* First Page */}
                  <button
                    onClick={() => setPage(1)}
                    className={`w-9 h-9 flex items-center justify-center text-sm font-medium rounded-md transition ${
                      page === 1
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    1
                  </button>

                  {/* First Ellipsis*/}
                  {page > 4 && <span className="px-1 text-gray-400">...</span>}

                  {/* Pages around current */}
                  {(() => {
                    const pages = [];
                    const start = Math.max(2, page - 1);
                    const end = Math.min(pagination.totalPages - 1, page + 1);
                    
                    for (let i = start; i <= end; i++) {
                      if (i === 1 || i === pagination.totalPages) continue;
                      
                      pages.push(
                        <button
                          key={i}
                          onClick={() => setPage(i)}
                          className={`w-9 h-9 flex items-center justify-center text-sm font-medium rounded-md transition ${
                            page === i
                              ? "bg-blue-600 text-white"
                              : "text-gray-700 hover:bg-gray-100 border border-gray-200"
                          }`}
                        >
                          {i}
                        </button>
                      );
                    }
                    return pages;
                  })()}

                  {/* Last Ellipsis */}
                  {page < pagination.totalPages - 3 && <span className="px-1 text-gray-400">...</span>}

                  {/* Last Page  */}
                  {pagination.totalPages > 1 && (
                    <button
                      onClick={() => setPage(pagination.totalPages)}
                      className={`w-9 h-9 flex items-center justify-center text-sm font-medium rounded-md transition ${
                        page === pagination.totalPages
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 hover:bg-gray-100 border border-gray-200"
                      }`}
                    >
                      {pagination.totalPages}
                    </button>
                  )}
                </div>

                {/* Next Button */}
                <button
                  disabled={page >= pagination.totalPages}
                  onClick={() =>
                    setPage((p) => Math.min(p + 1, pagination.totalPages))
                  }
                  className={`flex items-center gap-1 px-3 py-2 text-sm rounded-md border transition ${
                    page >= pagination.totalPages
                      ? "text-gray-400 cursor-not-allowed border-gray-200"
                      : "text-gray-700 hover:bg-gray-50 border-gray-300"
                  }`}
                >
                  Next <FaChevronRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
      {showScanner && (
        <ScannerPopup
          onClose={() => setShowScanner(false)}
          onDetected={handleDetected}
        />
      )}
      {/* bulk uploadmodel */}
      <BulkUploadModel
        isOpen={bulkUploadModel}
        onClose={() => setBulkUploadModel(false)}
      />
      {/* Barcode Print Modal */}
      <BarcodePrintModel
        isOpen={openBarcodeModel}
        onClose={() => setOpenBarcodeModel(false)}
        printData={printData}
      />
    </div>
  );
};

export default Product;

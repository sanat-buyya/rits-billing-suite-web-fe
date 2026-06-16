import React, { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchInvoiceHistoryData,
  updateInvoiceStatus,
  getInvoiceDataToPrint,
  exportInvoice,
  returnProduct,
} from "../invoiceHistoryThunk";
import {
  FaPrint,
  FaFilter,
  FaDownload,
  FaChevronLeft,
  FaChevronRight,
  FaMagnifyingGlass,
  FaRotateLeft,
  FaArrowRightToBracket,
} from "react-icons/fa6";
import ReturnProducPNG from "../../../assets/return_product.png";
import Spinner from "../../../components/Spinner";
import PrintInvoiceDialog from "../../../components/PrintInvoiceDialog";
import AppToast from "../../../services/toastService";
import InvoiceHistorySkeleton from "./InvoiceHistorySkeleton";
import InvoiceStatusUpdate from "../../../components/InvoiceStatusUpdate";
import QuickInvoiceHistory from "./QuickInvoiceHistoryComponent";
import ReturnProductPopup from "../../../components/ReturnProductPopup";

const InvoiceHistory = () => {
  const [viewMode, setViewMode] = useState("history"); // "history" | "quick"
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [invoiceIdtoPrint, setInvoiceIdtoPrint] = useState(null);
  const [invoiceIdtoReturn, setInvoiceIdtoReturn] = useState(null);
  const [invoiceDataToPrint, setInvoiceDataToPrint] = useState(null);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [showReturnPopup, setShowReturnPopup] = useState(false);
  const [invoiceSkeleton, setInvoiceSkeleton] = useState(true);
  const [invoiceReturnPopup, setInvoiceReturnPopup] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setCurrentPage(1); // reset page on new search
      dispatch(
        fetchInvoiceHistoryData({
          search: searchTerm,
          page: 1,
          status: statusFilter,
        }),
      );
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, statusFilter, dispatch]);

  // Fetch data when page changes
  // useEffect(() => {
  //   console.log('[InvoiceHistory] effect fetch page', currentPage);
  //   dispatch(fetchInvoiceHistoryData(currentPage));
  // }, [dispatch, currentPage]);

  useEffect(() => {
    dispatch(
      fetchInvoiceHistoryData({
        search: searchTerm,
        page: currentPage,
        status: statusFilter,
      }),
    );
  }, [dispatch, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  const {
    invoiceHistoryData,
    invoiceHistoryPage,
    invoiceHistoryTotalPages,
    invoiceHasNextPage,
    invoiceHistoryLoading,
    invoiceHistoryError,
    invoiceExportLoading,
  } = useSelector((state) => state.invoiceHistory);

  // Extract invoices array from the data
  const invoices = useMemo(() => {
    return Array.isArray(invoiceHistoryData) ? invoiceHistoryData : [];
  }, [invoiceHistoryData]);

  console.log("invoiceHisotry", invoiceHistoryData);

  // const filteredInvoices = useMemo(() => {
  //   const term = (searchTerm || "").toLowerCase();
  //   return invoices.filter((invoice) => {
  //     const matchSearch =
  //       invoice.customerName?.toLowerCase().includes(term) ||
  //       invoice.invoiceNo?.toLowerCase().includes(term);

  //     const matchStatus =
  //       statusFilter === "all" ||
  //       invoice.status?.toLowerCase() === statusFilter.toLowerCase();

  //     return matchSearch && matchStatus;
  //   });
  // }, [searchTerm, statusFilter, invoices]);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const totalPages = invoiceHistoryTotalPages || 1;
    const current = invoiceHistoryPage || 1;
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, current - 2);
      let end = Math.min(totalPages, start + maxVisible - 1);

      if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1);
      }

      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push("...");
      }

      for (let i = start; i <= end; i++) pages.push(i);

      if (end < totalPages) {
        if (end < totalPages - 1) pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handlePageChange = (page) => {
    if (
      page >= 1 &&
      page <= invoiceHistoryTotalPages &&
      page !== invoiceHistoryPage
    ) {
      setCurrentPage(page);
    }
  };

  const handlePrevious = () => {
    if (invoiceHistoryPage > 1) {
      handlePageChange(invoiceHistoryPage - 1);
    }
  };

  const handleNext = () => {
    if (invoiceHasNextPage) {
      handlePageChange(invoiceHistoryPage + 1);
    }
  };

  const pageNumbers = getPageNumbers();

  // export handler
  const handleExport = async () => {
    try {
      await dispatch(exportInvoice()).unwrap();
      // AppToast.showSuccessToast("Invoices exported successfully");
    } catch (error) {
      if (
        error?.error !==
        "Subscription expired. Please renew to continue using the service."
      ) {
        AppToast.showErrorToast(
          error?.message || error?.error || "Failed to export invoices",
        );
      }
    }
  };

  const handleConfirmPayment = async ({ selectedPaymentMethod, amount }) => {
    try {
      const res = await dispatch(
        updateInvoiceStatus({
          id: selectedInvoiceId,
          amount,
          paymentMode: selectedPaymentMethod,
        }),
      ).unwrap();

      setTimeout(() => {
        AppToast.showSuccess(res.message || "Invoice marked as paid");
        setShowPaymentPopup(false);
        setSelectedInvoiceId(null);
        dispatch(fetchInvoiceHistoryData(currentPage));
      }, 1000);
    } catch (error) {
      AppToast.showError(error?.message || "Something went wrong");
      setShowPaymentPopup(false);
      setSelectedInvoiceId(null);
    }
  };

  const updateReturnProduct = async (returnedProducts) => {
    try {
      const res = await dispatch(
        returnProduct({
          id: selectedInvoiceId,
          returnedProducts,
        }),
      ).unwrap();

      setTimeout(() => {
        AppToast.showSuccess(res.message || "Product returned Successfully");
        setShowReturnPopup(false);
        setInvoiceIdtoReturn(null);
        dispatch(fetchInvoiceHistoryData(currentPage));
      }, 1000);
    } catch (error) {
      AppToast.showError(error || "Something went wrong");
      setShowReturnPopup(false);
      setInvoiceIdtoReturn(null);
    }
  };

  // handle print function
  const handlePrintInvoice = async (invoiceId) => {
    setInvoiceIdtoPrint(invoiceId);
    if (invoiceId) {
      try {
        const response = await dispatch(
          getInvoiceDataToPrint(invoiceId),
        ).unwrap();
        setInvoiceDataToPrint(response.data);
        setIsPrintDialogOpen(true);
      } catch (error) {
        // optional: AppToast.showError(...)
      } finally {
        setInvoiceIdtoPrint(null);
      }
    }
  };

  const handleReturnProduct = async (invoiceId) => {
    setSelectedInvoiceId(invoiceId);
    setInvoiceIdtoReturn(invoiceId);

    try {
      const response = await dispatch(
        getInvoiceDataToPrint(invoiceId),
      ).unwrap();
      setInvoiceDataToPrint(response.data);
      setShowReturnPopup(true);
    } catch (error) {
    } finally {
      setInvoiceIdtoReturn(null);
    }
  };

  const handleStatus = async (invoiceId) => {
    try {
      const response = await dispatch(
        getInvoiceDataToPrint(invoiceId),
      ).unwrap();
      setInvoiceDataToPrint(response.data);
      setShowPaymentPopup(true);
    } catch (error) {
    } finally {
      setInvoiceIdtoReturn(null);
    }
  };

  return (
    <div className="bg-[#f9fafc] h-full flex flex-col p-3 sm:p-4 md:p-6">
      {/* Top toggle: Quick / Full - centered and styled like other buttons */}
      <div className="mb-3">
        <div className="flex items-center bg-white p-3 rounded-lg shadow-sm">
          <div className=" flex gap-2">
            <button
              onClick={() => setViewMode("history")}
              className={`relative flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200
                ${
                  viewMode === "history"
                    ? "text-gray-800 bg-gradient-to-br from-white to-[#f0f4ff] shadow-md border-b-2 border-blue-500"
                    : "text-gray-700 bg-white hover:bg-gray-100 border-b-2 border-transparent"
                }`}
            >
              Invoice History
            </button>

            <button
              onClick={() => setViewMode("quick")}
              className={`relative flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200
                ${
                  viewMode === "quick"
                    ? "text-gray-800 bg-gradient-to-br from-white to-[#f0f4ff] shadow-md border-b-2 border-blue-500"
                    : "text-gray-700 bg-white hover:bg-gray-100 border-b-2 border-transparent"
                }`}
            >
              Quick Invoice History
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filter Section - Fixed */}
      {viewMode === "history" && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mb-4 bg-white p-3 rounded-lg shadow-sm justify-between flex-shrink-0">
          {/* Search Bar */}
          <div className="flex-1 sm:flex-none flex items-center border border-gray-300 rounded-lg px-3 py-2 gap-2 bg-white w-full sm:max-w-sm">
            <input
              type="text"
              placeholder="Search by invoice number or customer..."
              className="flex-1 min-w-0 border-none focus:outline-none bg-transparent text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaMagnifyingGlass className="w-4 h-4 text-gray-500 flex-shrink-0" />
          </div>

          {/* Right side: Filter + Export */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative">
              <FaFilter className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />

              <select
                className="appearance-none bg-white text-sm font-medium border border-gray-300 rounded-lg 
                          pl-9 px-3 py-2 pr-10 cursor-pointer 
                          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All Status</option>
                <option value="PAID">Paid</option>
                <option value="UNPAID">Unpaid</option>
              </select>

              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">
                ▼
              </span>
            </div>

            <button
              className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-2 text-sm hover:bg-gray-100 transition flex-1 sm:flex-none"
              onClick={handleExport}
              disabled={invoiceExportLoading}
            >
              {invoiceExportLoading ? (
                <Spinner size={16} color="#6b7280" />
              ) : (
                <FaDownload />
              )}
              <span>Export</span>
            </button>
          </div>
        </div>
      )}

      {/* CONTENT */}
      {viewMode === "quick" ? (
        <QuickInvoiceHistory
          invoices={invoices}
          loading={invoiceHistoryLoading}
          onPrint={handlePrintInvoice}
          onMarkPaid={(id) => {
            setSelectedInvoiceId(id);
            setShowPaymentPopup(true);
          }}
          limit={10}
          printingId={invoiceIdtoPrint}
        />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:flex md:flex-col bg-white rounded-lg shadow flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto">
              {invoiceHistoryLoading ? (
                <InvoiceHistorySkeleton />
              ) : (
                <table className="min-w-full text-left text-gray-600 border-separate border-spacing-0">
                  <thead className="bg-gray-100 text-gray-700 uppercase text-xs sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Invoice #</th>
                      <th className="px-4 py-3 font-semibold">Date</th>
                      <th className="px-4 py-3 font-semibold">Customer</th>
                      <th className="px-2 py-3 font-semibold text-left">
                        Amount
                      </th>
                      <th className="px-2 py-3 font-semibold text-left">
                        Paid
                      </th>
                      <th className="px-2 py-3 font-semibold text-left">
                        Pending
                      </th>
                      <th className="px-6 py-3 font-semibold text-right">
                        GST
                      </th>
                      <th className="px-6 py-3 font-semibold text-center">
                        Payment Mode
                      </th>
                      <th className="px-8 py-3 font-semibold text-right">
                        Status
                      </th>
                      <th className="px-4 py-3 font-semibold text-center">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice, index) => (
                      <tr
                        key={invoice.id}
                        className={`border-b border-gray-200 hover:bg-blue-50 transition ${
                          index % 2 === 1 ? "bg-gray-50" : "bg-white"
                        }`}
                      >
                        <td className="px-4 py-3 text-sm font-medium">
                          {invoice.invoiceNo}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {new Date(invoice.date).toLocaleDateString("en-GB")}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {invoice.customerName}
                        </td>
                        <td className="px-2 py-3 text-sm text-left font-medium">
                          ₹{invoice.grandTotal?.toLocaleString() ?? "0.00"}
                        </td>

                        <td className="px-2 py-3 text-sm text-green-600 text-left font-medium">
                          ₹{invoice.paidAmount?.toLocaleString() ?? "0.00"}
                        </td>

                        <td className="px-2 py-3 text-sm text-red-600 text-left font-medium">
                          ₹{invoice.pendingAmount?.toLocaleString() ?? "0.00"}
                        </td>
                        <td className="px-6 py-3 text-sm text-right">
                          ₹{invoice.gst?.toLocaleString() ?? "0.00"}
                        </td>
                        <td className="px-1 py-3 text-center">
                          {invoice.paymentMode}
                        </td>
                        <td className="px-1 py-3 text-right">
                          <button
                            disabled={invoice.status?.toLowerCase() === "paid"}
                            onClick={async () => {
                              if (invoice.status?.toLowerCase() === "unpaid") {
                                setSelectedInvoiceId(invoice.id);
                                handleStatus(invoice.id);
                              }
                            }}
                            className={`inline-flex items-center justify-center w-[90px] px-2 py-1 text-xs font-medium rounded-full border shadow-md transition-all duration-200
                          ${
                            invoice.status?.toLowerCase() === "paid"
                              ? "bg-white text-green-700 border-green-300  cursor-not-allowed"
                              : "bg-white text-yellow-700 border-yellow-300 hover:bg-yellow-50 hover:shadow-current"
                          }`}
                            title={
                              invoice.status?.toLowerCase() === "paid"
                                ? "Already marked as PAID"
                                : "Click to mark as PAID"
                            }
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                                invoice.status?.toLowerCase() === "paid"
                                  ? "bg-green-500"
                                  : "bg-yellow-500"
                              }`}
                            ></span>
                            <span className="font-medium">
                              {invoice.status?.toUpperCase()}
                            </span>
                          </button>
                        </td>

                        <td className="px-4 py-4 gap-4 flex justify-center items-center">
                          <button
                            title="Return Product"
                            onClick={() => handleReturnProduct(invoice.id)}
                            className="text-gray-600 hover:text-gray-900 transition"
                          >
                            {/* {invoice.id === invoiceIdtoReturn ? <Spinner size={18} color="#0a1628" /> : <FaRotateLeft className="w-5 h-5 mx-auto" />} */}
                            {invoice.id === invoiceIdtoReturn ? (
                              <Spinner size={18} color="#0a1628" />
                            ) : (
                              <div className="lg:w-5 h-5 md:w-5 md:h-5 ">
                                <img src={ReturnProducPNG} alt="Return" />
                              </div>
                            )}
                          </button>
                          <button
                            title="Print Invoice"
                            onClick={() => handlePrintInvoice(invoice.id)}
                            className="text-gray-700 hover:text-gray-900 transition"
                          >
                            {invoice.id === invoiceIdtoPrint ? (
                              <Spinner size={18} color="#0a1628" />
                            ) : (
                              <FaPrint className="w-5 h-5 mx-auto" />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {!invoiceHistoryLoading && invoices.length === 0 && (
                <div className="flex-1 flex items-center justify-center text-gray-500 py-8">
                  No invoices found.
                </div>
              )}
            </div>

            {/* Pagination - Stays Inside View */}
            <div className="sticky bottom-0 left-0 right-0 px-4 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between z-20">
              <div className="flex justify-center items-center gap-1 mx-auto">
                <button
                  onClick={handlePrevious}
                  disabled={invoiceHistoryPage === 1}
                  className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition border border-gray-300 ${
                    invoiceHistoryPage === 1
                      ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <FaChevronLeft className="w-3 h-3" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-1 mx-2">
                  {pageNumbers.map((page, index) =>
                    page === "..." ? (
                      <span
                        key={`ellipsis-${index}`}
                        className="w-8 h-8 flex items-center justify-center text-sm text-gray-400"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        disabled={page > invoiceHistoryTotalPages}
                        className={`w-8 h-8 flex items-center justify-center text-sm font-medium rounded-lg transition ${
                          page === invoiceHistoryPage
                            ? "bg-blue-600 text-white"
                            : page > invoiceHistoryTotalPages
                              ? "text-gray-300 cursor-not-allowed"
                              : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}
                </div>

                <button
                  onClick={handleNext}
                  disabled={!invoiceHasNextPage}
                  className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition border border-gray-300 ${
                    !invoiceHasNextPage
                      ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <span>Next</span>
                  <FaChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto space-y-3">
              {invoiceHistoryLoading ? (
                <InvoiceHistorySkeleton invoiceSkeleton={invoiceSkeleton} />
              ) : (
                invoices.map((invoice, index) => (
                  <div
                    key={invoice.id}
                    className={`rounded-lg shadow p-4 ${index % 2 === 1 ? "bg-gray-50" : "bg-white"}`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">
                          {invoice.invoiceNo}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {new Date(invoice.date).toLocaleDateString("en-GB")}
                        </div>
                      </div>
                      <div className="flex gap-4 items-center">
                        <button
                          disabled={invoice.status?.toLowerCase() === "paid"}
                          onClick={async () => {
                            if (invoice.status?.toLowerCase() === "unpaid") {
                              setSelectedInvoiceId(invoice.id);
                              handleStatus(invoice.id);
                            }
                          }}
                          className={`inline-flex items-center justify-center w-[90px] px-2 py-1 text-xs font-medium rounded-full border shadow-md transition-all duration-200
                ${invoice.status?.toLowerCase() === "paid" ? "bg-white text-green-700 border-green-300 cursor-not-allowed" : "bg-white text-yellow-700 border-yellow-300 hover:bg-yellow-50 hover:shadow-current"}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full mr-1.5 ${invoice.status?.toLowerCase() === "paid" ? "bg-green-500" : "bg-yellow-500"}`}
                          ></span>
                          <span className="font-medium">
                            {invoice.status?.toUpperCase()}
                          </span>
                        </button>
                        {/* return button */}
                        <button
                          title="Return Product"
                          onClick={() => handleReturnProduct(invoice.id)}
                          className="text-gray-600 hover:text-gray-900 transition mr-2"
                        >
                          {invoice.id === invoiceIdtoReturn ? (
                            <Spinner size={18} color="#0a1628" />
                          ) : (
                            <div className="">
                              <img
                                src={ReturnProducPNG}
                                alt="Return"
                                height={23}
                                width={23}
                              />
                            </div>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="text-sm text-gray-700 mb-3 font-medium">
                      {invoice.customerName}
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                      <div>
                        <div className="text-xs text-gray-500">
                          Total Amount
                        </div>
                        <div className="text-sm font-semibold text-gray-900">
                          ₹{invoice.grandTotal?.toLocaleString() ?? "0.00"}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          GST: ₹{invoice.gst?.toLocaleString() ?? "0.00"}
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="flex flex-col text-right">
                          <div className="text-xs text-green-600 font-medium">
                            Paid
                          </div>
                          <div className="text-sm font-semibold text-green-600">
                            ₹{invoice.paidAmount?.toLocaleString() ?? "0.00"}
                          </div>
                        </div>
                        <div className="flex flex-col text-right">
                          <div className="text-xs text-red-600 font-medium">
                            Pending
                          </div>
                          <div className="text-sm font-semibold text-red-600">
                            ₹{invoice.pendingAmount?.toLocaleString() ?? "0.00"}
                          </div>
                        </div>
                        <button
                          title="Print Invoice"
                          className="text-gray-700 hover:text-gray-900 p-2 hover:bg-gray-100 rounded-lg transition"
                          onClick={() => handlePrintInvoice(invoice.id)}
                        >
                          {invoice.id === invoiceIdtoPrint ? (
                            <Spinner size={18} color="#0a1628" />
                          ) : (
                            <FaPrint className="w-5 h-5 mx-auto" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
              {!invoiceHistoryLoading && invoices.length === 0 && (
                <div className="flex-1 flex items-center justify-center text-gray-500 py-8">
                  No invoices found.
                </div>
              )}
            </div>

            {/* Mobile Pagination - Sticky */}
            <div className="sticky bottom-0 bg-white rounded-lg shadow p-3 flex-shrink-0 z-20">
              <div className="flex items-center justify-center gap-1">
                <button
                  onClick={handlePrevious}
                  disabled={invoiceHistoryPage === 1}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg transition border border-gray-300 ${
                    invoiceHistoryPage === 1
                      ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <FaChevronLeft className="w-3 h-3" />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                {pageNumbers.map((page, index) =>
                  page === "..." ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="w-7 h-7 flex items-center justify-center text-xs text-gray-400"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      disabled={page > invoiceHistoryTotalPages}
                      className={`w-7 h-7 flex items-center justify-center text-xs font-medium rounded-lg transition ${
                        page === invoiceHistoryPage
                          ? "bg-blue-600 text-white"
                          : page > invoiceHistoryTotalPages
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}

                <button
                  onClick={handleNext}
                  disabled={!invoiceHasNextPage}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg transition border border-gray-300 ${
                    !invoiceHasNextPage
                      ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <span className="hidden sm:inline">Next</span>
                  <FaChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <PrintInvoiceDialog
        isOpen={isPrintDialogOpen}
        onClose={() => setIsPrintDialogOpen(false)}
        invoiceData={invoiceDataToPrint}
        isQuickPrint={false}
      />

      {showReturnPopup && (
        <ReturnProductPopup
          onClose={() => {
            setShowReturnPopup(false);
            setInvoiceIdtoReturn(null);
          }}
          invoiceData={invoiceDataToPrint}
          onSubmit={updateReturnProduct}
          invoiceReturnPopup={invoiceReturnPopup}
        />
      )}

      {showPaymentPopup && (
        <InvoiceStatusUpdate
          invoiceData={invoiceDataToPrint}
          onClose={() => {
            setShowPaymentPopup(false);
            setSelectedInvoiceId(null);
          }}
          onConfirm={handleConfirmPayment}
        />
      )}
    </div>
  );
};

export default InvoiceHistory;

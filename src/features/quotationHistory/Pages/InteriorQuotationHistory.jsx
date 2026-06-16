import React, { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchInteriorQuotationHistoryData,
} from "../interiorQuotationHistoryThunk";
import {
  FaPrint,
  FaFilter,
  FaDownload,
  FaChevronLeft,
  FaChevronRight,
  FaMagnifyingGlass,
  FaRotateLeft,
  FaArrowRightToBracket
} from "react-icons/fa6";
import Spinner from "../../../components/Spinner";
import PrintQuotationDialog from "../../../components/PrintQuotationDialog";
import AppToast from "../../../services/toastService";
import InvoiceHistorySkeleton from "../../invoiceHistory/Pages/InvoiceHistorySkeleton";

const QuotationHistory = () => {
  const [viewMode, setViewMode] = useState("interior"); // "interior" | "history" 
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [quotationIdToPrint, setQuotationIdToPrint] = useState(null);
  const [quotationDataToPrint, setQuotationDataToPrint] = useState(null);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [invoiceSkeleton, setInvoiceSkeleton] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
  const delayDebounce = setTimeout(() => {
    setCurrentPage(1); // reset page on new search
    dispatch(fetchInteriorQuotationHistoryData({ search: searchTerm, page: 1, }));
  }, 500);

  return () => clearTimeout(delayDebounce);
}, [searchTerm, dispatch]); 

  useEffect(() => {
  dispatch(fetchInteriorQuotationHistoryData({ search: searchTerm, page: currentPage, }));
}, [dispatch, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [viewMode]);

  const {
    interiorQuotationHistoryData,
  interiorQuotationHistoryLoading,
  interiorQuotationHistoryError,
  interiorQuotationHistoryPage,
  interiorQuotationHistoryTotalPages,
  interiorQuotationHasNextPage,
  } = useSelector((state) => state.interiorQuotationHistory);

  // Extract invoices array from the data
  const interiorQuotation = useMemo(() => {
    return Array.isArray(interiorQuotationHistoryData) ? interiorQuotationHistoryData : [];
  }, [interiorQuotationHistoryData]);

  console.log("interiorQuotationHistoryData", interiorQuotationHistoryData);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const totalPages = interiorQuotationHistoryTotalPages || 1;
    const current = interiorQuotationHistoryPage || 1;
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
    if (page >= 1 && page <= interiorQuotationHistoryTotalPages && page !== interiorQuotationHistoryPage) {
      setCurrentPage(page);
    }
  };

  const handlePrevious = () => {
    if (interiorQuotationHistoryPage > 1) {
      handlePageChange(interiorQuotationHistoryPage - 1);
    }
  };

  const handleNext = () => {
    if (interiorQuotationHasNextPage) {
      handlePageChange(interiorQuotationHistoryPage + 1);
    }
  };

  const pageNumbers = getPageNumbers();

  // export handler
//   const handleExport = async () => {
//     try {
//       await dispatch(exportInvoice()).unwrap();
//       // AppToast.showSuccessToast("Invoices exported successfully");
//     } catch (error) {
//       if (error?.error !== "Subscription expired. Please renew to continue using the service.") {
//         AppToast.showErrorToast(error?.message || error?.error || "Failed to export quotations");
//       }
//     }
//   };

  // handle print function
  const handlePrintInvoice = (quotationId) => {
  const selectedQuotation = interiorQuotation.find(
    (q) => q._id === quotationId
  );

  if (!selectedQuotation) {
    AppToast.showErrorToast("Quotation not found");
    return;
  }

  setQuotationDataToPrint(selectedQuotation);
  setIsPrintDialogOpen(true);
};




  return (
<div className="bg-[#f9fafc] h-full flex flex-col p-3 sm:p-4 md:p-6">
      {/* Top toggle: Quick / Full - centered and styled like other buttons */}
      <div className="mb-3">
        <div className="flex items-center bg-white p-3 rounded-lg shadow-sm">
          <div className=" flex gap-2">
            <button
              onClick={() => setViewMode("interior")}
              className={`relative flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200
                ${
                  viewMode === "interior"
                    ? "text-gray-800 bg-gradient-to-br from-white to-[#f0f4ff] shadow-md border-b-2 border-blue-500"
                    : "text-gray-700 bg-white hover:bg-gray-100 border-b-2 border-transparent"
                }`}
            >
              Interior Quotation History
            </button>

          </div>
        </div>
      </div>

      {/* Search & Filter Section - Fixed */}
      {viewMode === "interior" && (
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mb-4 bg-white p-3 rounded-lg shadow-sm justify-between flex-shrink-0">
        {/* Search Bar */}
        <div className="flex-1 sm:flex-none flex items-center border border-gray-300 rounded-lg px-3 py-2 gap-2 bg-white w-full sm:max-w-sm">
          <input
            type="text"
            placeholder="Search by Interior Quotation number or customer..."
            className="flex-1 min-w-0 border-none focus:outline-none bg-transparent text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaMagnifyingGlass className="w-4 h-4 text-gray-500 flex-shrink-0" />
        </div>

        {/* Right side: Filter + Export */}
        {/* <div className="flex items-center gap-2 w-full sm:w-auto">
          
          <button
            className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-2 text-sm hover:bg-gray-100 transition flex-1 sm:flex-none"
            onClick={handleExport}
            disabled={invoiceExportLoading}
          >
            {invoiceExportLoading ? <Spinner size={16} color="#6b7280" /> : <FaDownload />}
            <span>Export</span>
          </button>
        </div> */}
      </div>
      )}

      
          {/* Desktop Table */}
          <div className="hidden md:flex md:flex-col bg-white rounded-lg shadow flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto">
              {interiorQuotationHistoryLoading ? (
                <InvoiceHistorySkeleton />
              ) : (
                <table className="min-w-full text-left text-gray-600 border-separate border-spacing-0">
                  <thead className="bg-gray-100 text-gray-700 uppercase text-xs sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Interior #</th>
                      <th className="px-4 py-3 font-semibold">Date</th>
                      <th className="px-4 py-3 font-semibold">Customer</th>
                      <th className="px-4 py-3 font-semibold">Email</th>
                      <th className="px-2 py-3 font-semibold text-left">Amount</th>
                      <th className="px-6 py-3 font-semibold text-right">GST</th>
                      <th className="px-4 py-3 font-semibold text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {interiorQuotation.map((quotation, index) => (
                      <tr
                        key={quotation._id}
                        className={`border-b border-gray-200 hover:bg-blue-50 transition ${
                          index % 2 === 1 ? "bg-gray-50" : "bg-white"
                        }`}
                      >
                        <td className="px-4 py-3 text-sm font-medium">{quotation.quotationNo}</td>
                        <td className="px-4 py-3 text-sm">
                          {new Date(quotation.date).toLocaleDateString("en-GB")}
                        </td>
                        <td className="px-4 py-3 text-sm">{quotation.customerName}</td>
                        <td className="px-4 py-3 text-sm">{quotation.customerEmail}</td>
                        <td className="px-2 py-3 text-sm text-left font-medium">
                          ₹{quotation.amount?.grandTotal?.toLocaleString() ?? "0.00"}
                        </td>

                        <td className="px-6 py-3 text-sm text-right">
                          ₹{quotation.amount?.gst?.toLocaleString() ?? "0.00"}
                        </td>

                        <td className="px-4 py-4 gap-4 flex justify-center items-center">
                          <button title="Print Interior Quot.." onClick={() => handlePrintInvoice(quotation._id)} className="text-gray-700 hover:text-gray-900 transition">
                            <FaPrint className="w-5 h-5 mx-auto" />
                            </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {!interiorQuotationHistoryLoading && interiorQuotation.length === 0 && (
              <div className="flex-1 flex items-center justify-center text-gray-500 py-8">
                No Quotations found.
              </div>
            )}
            </div>

            {/* Pagination - Stays Inside View */}
            <div className="sticky bottom-0 left-0 right-0 px-4 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between z-20">
              <div className="flex justify-center items-center gap-1 mx-auto">
                <button
                  onClick={handlePrevious}
                  disabled={interiorQuotationHistoryPage === 1}
                  className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition border border-gray-300 ${
                    interiorQuotationHistoryPage === 1 ? "text-gray-400 bg-gray-100 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <FaChevronLeft className="w-3 h-3" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-1 mx-2">
                  {pageNumbers.map((page, index) =>
                    page === "..." ? (
                      <span key={`ellipsis-${index}`} className="w-8 h-8 flex items-center justify-center text-sm text-gray-400">
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        disabled={page > interiorQuotationHistoryTotalPages}
                        className={`w-8 h-8 flex items-center justify-center text-sm font-medium rounded-lg transition ${
                          page === interiorQuotationHistoryPage ? "bg-blue-600 text-white" : page > interiorQuotationHistoryTotalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>

                <button
                  onClick={handleNext}
                  disabled={!interiorQuotationHasNextPage}
                  className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition border border-gray-300 ${
                    !interiorQuotationHasNextPage ? "text-gray-400 bg-gray-100 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"
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
              {interiorQuotationHistoryLoading ? (
                <InvoiceHistorySkeleton invoiceSkeleton={invoiceSkeleton} />
              ) : (
                interiorQuotation.map((quotation, index) => (
                  <div key={quotation._id} className={`rounded-lg shadow p-4 ${index % 2 === 1 ? "bg-gray-50" : "bg-white"}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{quotation.quotationNo}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{new Date(quotation.date).toLocaleDateString("en-GB")}</div>
                      </div>
                      
                    </div>

                    <div className="text-sm text-gray-700 mb-3 font-medium">{quotation.customerName}</div>

                    <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                      <div>
                        <div className="text-xs text-gray-500">Total Amount</div>
                        <div className="text-sm font-semibold text-gray-900">₹{quotation.amount?.grandTotal?.toLocaleString() ?? "0.00"}</div>
                        <div className="text-xs text-gray-500 mt-1">GST: ₹{quotation.amount?.gst?.toLocaleString() ?? "0.00"}</div>
                      </div>

                      <div className="flex items-center space-x-4">
                        
                        <button title="Print Interior Quot.." className="text-gray-700 hover:text-gray-900 p-2 hover:bg-gray-100 rounded-lg transition" onClick={() => handlePrintInvoice(quotation._id)}>
                          <FaPrint className="w-5 h-5 mx-auto" />
                          </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
              {!interiorQuotationHistoryLoading && interiorQuotation.length === 0 && (
                <div className="flex-1 flex items-center justify-center text-gray-500 py-8">
                  No Quotations found.
                </div>
              )}
            </div>

            {/* Mobile Pagination - Sticky */}
            <div className="sticky bottom-0 bg-white rounded-lg shadow p-3 flex-shrink-0 z-20">
              <div className="flex items-center justify-center gap-1">
                <button
                  onClick={handlePrevious}
                  disabled={interiorQuotationHistoryPage === 1}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg transition border border-gray-300 ${
                    interiorQuotationHistoryPage === 1 ? "text-gray-400 bg-gray-100 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <FaChevronLeft className="w-3 h-3" />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                {pageNumbers.map((page, index) =>
                  page === "..." ? (
                    <span key={`ellipsis-${index}`} className="w-7 h-7 flex items-center justify-center text-xs text-gray-400">
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      disabled={page > interiorQuotationHistoryTotalPages}
                      className={`w-7 h-7 flex items-center justify-center text-xs font-medium rounded-lg transition ${
                        page === interiorQuotationHistoryPage ? "bg-blue-600 text-white" : page > interiorQuotationHistoryTotalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  onClick={handleNext}
                  disabled={!interiorQuotationHasNextPage}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg transition border border-gray-300 ${
                    !interiorQuotationHasNextPage ? "text-gray-400 bg-gray-100 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <span className="hidden sm:inline">Next</span>
                  <FaChevronRight className="w-3 h-3" />
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

export default QuotationHistory;
import React, { useEffect, memo, useState, useMemo } from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaMagnifyingGlass,
  FaPrint,
  FaDownload,
} from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../../components/Spinner";
import InvoiceHistorySkeleton from "./InvoiceHistorySkeleton";
import { getInvoiceDataToPrint } from "../quickInvoiceHistoryThunk";
import PrintInvoiceDialog from "../../../components/PrintInvoiceDialog";
import ReturnProductPopup from "../../../components/ReturnProductPopup";
import ReturnProducPNG from "../../../assets/return_product.png";
import AppToast from "../../../services/toastService";
import {
  fetchQuickInvoices,
  returnProduct,
  quickInvoiceExportInvoice,
} from "../quickInvoiceHistoryThunk";

const QuickInvoiceHistory = ({ limit = 10 }) => {
  const dispatch = useDispatch();
  const [invoiceIdtoPrint, setInvoiceIdtoPrint] = useState(null);
  const [invoiceDataToPrint, setInvoiceDataToPrint] = useState(null);
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [invoiceSkeleton, setInvoiceSkeleton] = useState(false);
  const [invoiceIdtoReturn, setInvoiceIdtoReturn] = useState(null);
  const [showReturnPopup, setShowReturnPopup] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [invoiceReturnPopup, setInvoiceReturnPopup] = useState(false);

  const {
    quickInvoiceData,
    quickInvoiceLoading,
    quickInvoicePage,
    quickInvoiceTotalPages,
    quickInvoiceHasNextPage,
    quickInvoiceExportLoading,
    quickInvoiceExportError,
    quickInvoiceExportSuccess,
  } = useSelector((state) => state.quickInvoiceHistory);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const debounce = setTimeout(() => {
      setCurrentPage(1);
      dispatch(fetchQuickInvoices({ search: searchTerm, page: 1 }));
    }, 500);

    return () => clearTimeout(debounce);
  }, [searchTerm, dispatch]);

  useEffect(() => {
    dispatch(fetchQuickInvoices({ search: searchTerm, page: currentPage }));
  }, [dispatch, currentPage]);

  const list = quickInvoiceData?.slice(0, limit) || [];

  // const filteredList = useMemo(() => {
  //   const term = searchTerm.trim().toLowerCase();
  //   if (!term) return list;

  //   return list.filter(
  //     (invoice) =>
  //       invoice.invoiceNo?.toLowerCase().includes(term) ||
  //       invoice.customerName?.toLowerCase().includes(term) ||
  //       invoice.customerPhone?.toLowerCase().includes(term)
  //   );
  // }, [list, searchTerm]);

  const getPageNumbers = () => {
    const total = Math.max(1, Number(quickInvoiceTotalPages || 1));
    const current = Math.max(1, Number(quickInvoicePage || 1));
    const pages = [];
    const maxVisible = 5;

    if (total <= maxVisible) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      let start = Math.max(1, current - 2);
      let end = Math.min(total, start + maxVisible - 1);

      if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1);
      }

      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push("...");
      }

      for (let i = start; i <= end; i++) pages.push(i);

      if (end < total) {
        if (end < total - 1) pages.push("...");
        pages.push(total);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  const onPageChange = (page) => {
    if (page >= 1 && page <= quickInvoiceTotalPages) {
      setCurrentPage(page);
    }
  };

  const onPrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const onNext = () => {
    if (quickInvoiceHasNextPage) setCurrentPage(currentPage + 1);
  };

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
        dispatch(fetchQuickInvoices(quickInvoicePage));
      }, 1000);
    } catch (error) {
      console.log(error);
      AppToast.showError(error || "Something went wrong");
      setShowReturnPopup(false);
      setInvoiceIdtoReturn(null);
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

  // export handler
  const handleQuickExport = async () => {
    try {
      await dispatch(quickInvoiceExportInvoice()).unwrap();
    } catch (error) {
      AppToast.showErrorToast(error?.message || "Failed to export invoices");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow flex-1 min-h-0 flex flex-col">
      <div className="flex justify-between flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mb-4 p-3 rounded-lg shadow-sm bg-white flex-shrink-0">
        {/* SEARCH BAR */}
        <div className="flex-1 sm:flex-none flex items-center border border-gray-300 rounded-lg px-3 py-2 gap-2 bg-white w-full sm:max-w-sm">
          <input
            type="text"
            placeholder="Search by quick invoice number or customer..."
            className="flex-1 min-w-0 border-none focus:outline-none bg-transparent text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaMagnifyingGlass className="w-4 h-4 text-gray-500 flex-shrink-0" />
        </div>

        <button
          className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-2 text-sm hover:bg-gray-100 transition flex-1 sm:flex-none"
          onClick={handleQuickExport}
          disabled={quickInvoiceExportLoading}
        >
          {quickInvoiceExportLoading ? (
            <Spinner size={16} color="#6b7280" />
          ) : (
            <FaDownload />
          )}

          <span>Export</span>
        </button>
      </div>

      {/* CONTENT */}
      <div className="flex-1 min-h-0 flex flex-col">
        <>
          {/* DESKTOP TABLE */}
          <div className="hidden md:flex md:flex-col bg-white rounded-lg shadow flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto">
              {quickInvoiceLoading && (
                <div className="flex-1 min-h-0">
                  <InvoiceHistorySkeleton />
                </div>
              )}
              <table className="min-w-full text-left text-gray-600 border-separate border-spacing-0">
                <thead className="bg-gray-100 text-gray-700 uppercase sticky top-0 z-10 text-xs">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Invoice #</th>
                    <th className="px-4 py-3 font-semibold">Date</th>
                    <th className="px-4 py-3 font-semibold">Customer</th>
                    <th className="px-4 py-3 font-semibold">Phone</th>
                    <th className="px-2 py-3 font-semibold text-left">
                      Amount
                    </th>
                    <th className="px-6 py-3 font-semibold text-right">GST</th>
                    <th className="px-6 py-3 font-semibold text-center">
                      Payment Mode
                    </th>
                    <th className="px-4 py-3 font-semibold text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((invoice, index) => (
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
                        {invoice.date
                          ? new Date(invoice.date).toLocaleDateString("en-GB")
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {invoice.customerName || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {invoice.customerPhone || "—"}
                      </td>
                      <td className="px-2 py-3 text-sm font-medium">
                        ₹{invoice.grandTotal?.toLocaleString() ?? "0.00"}
                      </td>
                      <td className="px-6 py-3 text-sm text-right">
                        ₹{invoice.gst?.toLocaleString() ?? "0.00"}
                      </td>
                      <td className="px-6 py-3 text-sm text-center">
                        {invoice.paymentMode}
                      </td>
                      <td className="px-4 py-3 text-center gap-4 flex justify-center">
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
                          title="Print Quick Invoice"
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
              {!quickInvoiceLoading && list.length === 0 && (
                <div className="flex-1 flex items-center justify-center text-gray-500 py-8">
                  No invoices found.
                </div>
              )}
            </div>
            {/* DESKTOP PAGINATION — EXACT MATCH TO InvoiceHistory */}
            {/* {pageNumbers.length > 1 && ( */}
            <div className="sticky bottom-0 left-0 right-0 px-4 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between z-20">
              <div className="flex justify-center items-center gap-1 mx-auto">
                <button
                  onClick={onPrevious}
                  disabled={Number(quickInvoicePage || 1) === 1}
                  className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition border border-gray-300 ${
                    Number(quickInvoicePage || 1) === 1
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
                        key={`ellipsis-d-${index}`}
                        className="w-8 h-8 flex items-center justify-center text-sm text-gray-400"
                      >
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        disabled={page > Number(quickInvoiceTotalPages || 1)}
                        className={`w-8 h-8 flex items-center justify-center text-sm font-medium rounded-lg transition ${
                          page === Number(quickInvoicePage || 1)
                            ? "bg-blue-600 text-white"
                            : page > Number(quickInvoiceTotalPages || 1)
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
                  onClick={onNext}
                  disabled={!quickInvoiceHasNextPage}
                  className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition border border-gray-300 ${
                    !quickInvoiceHasNextPage
                      ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <span>Next</span>
                  <FaChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
            {/* )} */}
          </div>

          {/* MOBILE LIST */}
          <div className="md:hidden flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto space-y-3">
              {quickInvoiceLoading && (
                <div className="flex-1 min-h-0">
                  <InvoiceHistorySkeleton invoiceSkeleton={invoiceSkeleton} />
                </div>
              )}
              {list.map((invoice, index) => (
                <div
                  key={invoice.id}
                  className={`rounded-lg shadow p-4 ${
                    index % 2 === 1 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <div className="flex justify-between">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {invoice.invoiceNo}
                      </div>
                      <div className="text-xs text-gray-500">
                        {invoice.date
                          ? new Date(invoice.date).toLocaleDateString("en-GB")
                          : "—"}
                      </div>
                    </div>
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

                  <div className="text-sm text-gray-700 mt-2 font-medium">
                    {invoice.customerName || "No Name"}
                  </div>

                  <div className="flex justify-between pt-3 border-t border-gray-100 mt-3">
                    <div>
                      <div className="text-xs text-gray-500">Amount</div>
                      <div className="text-sm font-semibold text-gray-900">
                        ₹{invoice.grandTotal?.toLocaleString() ?? "0.00"}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        GST: ₹{invoice.gst?.toLocaleString() ?? "0.00"}
                      </div>
                    </div>
                    <div>
                      <button
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
              ))}
              {!quickInvoiceLoading && list.length === 0 && (
                <div className="flex-1 flex items-center justify-center text-gray-500 py-8">
                  No invoices found.
                </div>
              )}
            </div>
          </div>
        </>

        {/* MOBILE PAGINATION */}
        <div className="md:hidden flex flex-col min-h-0">
          {/* {pageNumbers.length > 1 && ( */}
          <div className="sticky bottom-0 bg-white rounded-lg shadow p-3 flex-shrink-0 z-20">
            <div className="flex items-center justify-center gap-1">
              <button
                onClick={onPrevious}
                disabled={Number(quickInvoicePage || 1) === 1}
                className={`px-2.5 py-1.5 text-xs rounded-lg transition border border-gray-300 ${
                  Number(quickInvoicePage || 1) === 1
                    ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <FaChevronLeft className="w-3 h-3" />
              </button>

              {pageNumbers.map((page, index) =>
                page === "..." ? (
                  <span
                    key={`ellipsis-m-${index}`}
                    className="w-7 h-7 flex items-center justify-center text-xs text-gray-400"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`w-7 h-7 flex items-center justify-center text-xs font-medium rounded-lg transition ${
                      page === Number(quickInvoicePage || 1)
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}

              <button
                onClick={onNext}
                disabled={!quickInvoiceHasNextPage}
                className={`px-2.5 py-1.5 text-xs rounded-lg transition border border-gray-300 ${
                  !quickInvoiceHasNextPage
                    ? "text-gray-400 bg-gray-100 cursor-not-allowed"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <FaChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
          {/* )} */}
        </div>
      </div>
      <PrintInvoiceDialog
        isOpen={isPrintDialogOpen}
        onClose={() => setIsPrintDialogOpen(false)}
        invoiceData={invoiceDataToPrint}
        isQuickPrint={true}
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
    </div>
  );
};

export default memo(QuickInvoiceHistory);

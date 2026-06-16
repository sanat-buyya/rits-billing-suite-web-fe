import React, { useState, useEffect } from "react";
import { SlCalender } from "react-icons/sl";
import { useSelector, useDispatch } from 'react-redux';
import {fetchDashboardData} from '../dashBoardThunk';
import { FaFileInvoice, FaChartLine, FaReceipt } from "react-icons/fa6";
import { HiPrinter } from "react-icons/hi";
import { FaBoxOpen } from "react-icons/fa";
import { HiOutlineExclamationTriangle } from "react-icons/hi2";
import PrintInvoiceDialog from "../../../components/PrintInvoiceDialog";
import { getInvoiceDataToPrint } from "../../invoiceHistory/invoiceHistoryThunk";
import Spinner from "../../../components/Spinner";
import DashboardSkeleton from "./DashBoardSkeleton"
import { useNavigate } from "react-router-dom";

const DashBoard = () => {
  const dispatch = useDispatch();
   const navigate = useNavigate();

  // Redux state
  const { dashboardData, dashboardLoading, dashboardError } = useSelector(
    (state) => state.dashboard
  );

    // Local states for print
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [invoiceDataToPrint, setInvoiceDataToPrint] = useState(null);
  const [invoiceIdToPrint, setInvoiceIdToPrint] = useState(null);

  const formatNumber = (value) => {
    if (typeof value === "number") {
      if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)}Cr`;
      if (value >= 100000) return `₹${(value / 100000).toFixed(2)}L`;
      if (value >= 1000) return `₹${(value / 1000).toFixed(2)}K`;
      return `₹${value.toFixed(2)}`;
    }
    return value || "₹0";
  };

  // Fetch dashboard data on mount
  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  // Extract real data
  const summary = dashboardData?.summary || {};
  const recentInvoices = dashboardData?.recentInvoices || [];
  const lowStockProducts = dashboardData?.lowStockProducts || [];

  const hasLowStock = lowStockProducts.length > 0;

  // Print Invoice Dialog State
  const handlePrintInvoice = async (invoiceId) => {
    setInvoiceIdToPrint(invoiceId);
    if (invoiceId) {
      try {
        const response = await dispatch(getInvoiceDataToPrint(invoiceId)).unwrap();
        setInvoiceDataToPrint(response.data);
        setIsPrintDialogOpen(true);
      } catch (error) {
        console.error("Error fetching invoice data:", error);
      } finally {
        setInvoiceIdToPrint(null);
      }
    }
  };

  if (dashboardLoading) {
  return <DashboardSkeleton />;
}

if (dashboardError) {
  return (
    <div className="min-h-screen bg-[#f9fafc] flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-500 text-lg">Error loading dashboard</div>
        <button 
          onClick={() => navigate("/dashboard")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    </div>
  );
}


  return (
    <div className="min-h-screen bg-[#f9fafc] pb-10">
      {/* ===== Top Cards ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 p-3 sm:p-4 md:p-6">
        {/* Total Invoices */}
        <div
          className="relative flex justify-between items-center border border-gray-100 shadow-md rounded-2xl p-4 md:p-6 hover:shadow-lg transition-all duration-300"
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, #f0f4ff 100%)",
          }}
        >
          <div className="flex-1 min-w-0 pr-2">
            <p className="text-xs md:text-sm text-gray-500">Total Invoices</p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800 mt-1">{summary.totalInvoices + summary.totalQuickInvoices || "0"}</h1>
          </div>
          <div className="flex-shrink-0">
            <div className="bg-blue-100 text-blue-600 p-3 md:p-4 rounded-2xl shadow-sm">
              <FaFileInvoice className="text-xl md:text-2xl" />
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div
          className="relative flex justify-between items-center border border-gray-100 shadow-md rounded-2xl p-4 md:p-6 hover:shadow-lg transition-all duration-300"
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, #e0fbfa 100%)",
          }}
        >
          <div className="flex-1 min-w-0 pr-2">
            <p className="text-xs md:text-sm text-gray-500">Total Revenue</p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800 mt-1">{formatNumber(summary.totalRevenue || 0)}</h1>
          </div>
          <div className="flex-shrink-0">
            <div className="bg-cyan-100 text-cyan-600 p-3 md:p-4 rounded-2xl shadow-sm">
              <FaChartLine className="text-xl md:text-2xl" />
            </div>
          </div>
        </div>

        {/* Total GST */}
        <div
          className="relative flex justify-between items-center border border-gray-100 shadow-md rounded-2xl p-4 md:p-6 hover:shadow-lg transition-all duration-300"
          style={{
            background: "linear-gradient(135deg, #ffffff 0%, #e8eaff 100%)",
          }}
        >
          <div className="flex-1 min-w-0 pr-2">
            <p className="text-xs md:text-sm text-gray-500">Total GST</p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-800 mt-1">{formatNumber(summary.totalGST || 0)}</h1>
          </div>
          <div className="flex-shrink-0">
            <div className="bg-indigo-100 text-indigo-600 p-3 md:p-4 rounded-2xl shadow-sm">
              <FaReceipt className="text-xl md:text-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* ===== Low Stock Section ===== */}
      <div className="px-3 sm:px-4 md:px-6">
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 w-full p-4 md:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-3">
            <div className="flex items-start gap-3 md:gap-5">
              <div className="bg-red-50 text-red-500 p-2 rounded-xl flex-shrink-0">
                <HiOutlineExclamationTriangle className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div>
                <h2 className="text-base md:text-lg font-semibold text-gray-800">Low Stock Products</h2>
                <p className="text-xs md:text-sm text-gray-500">Items running low on inventory</p>
              </div>
            </div>
            <button  onClick={() => navigate("/products")} 
            className="text-xs md:text-sm font-medium text-blue-600 hover:text-blue-700 self-end sm:self-auto whitespace-nowrap">
              See All →
            </button>
          </div>

          {/* Cards or Empty State */}
          {lowStockProducts.length > 0 ? (
            <div
              className={`grid gap-3 md:gap-4 lg:gap-5 ${
                lowStockProducts.length === 1
                  ? "grid-cols-1"
                  : lowStockProducts.length === 2
                  ? "grid-cols-1 sm:grid-cols-2"
                  : lowStockProducts.length === 3
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
              }`}
            >
              {lowStockProducts.map((item) => (
                <div
                  key={item._id}
                  className={`rounded-xl shadow-sm p-4 md:p-5 hover:shadow-lg transition-all duration-300 border
                    ${
                      item.status === "critical"
                        ? "bg-gradient-to-br from-[#ffffff] to-[#fef3f3] border-[#FFE2E2]"
                        : "bg-gradient-to-br from-[#ffffff] to-[#FEFCE9] border-[#FEF9C2]"
                    }`}
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-gray-800 text-sm md:text-base">{item.productName}</h3>
                    <span
                      className={`px-2 py-0.5 text-xs font-semibold rounded-full flex-shrink-0 ${
                        item.status === "critical"
                          ? "bg-[#FB2C36] text-white"
                          : "bg-[#F0B100] text-white"
                      }`}
                    >
                      {item.status === "critical" ? "Critical" : "Low"}
                    </span>
                  </div>

                  <div className="text-xs md:text-sm text-gray-600 space-y-1">
                    <p>
                      Current Stock:{" "}
                      <span
                        className={`font-medium ${
                          item.status === "critical" ? "text-red-600" : "text-yellow-600"
                        }`}
                      >
                        {item.quantity}
                      </span>
                    </p>
                    <p>
                      Min Required: <span className="font-medium text-gray-700">10</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
          <div className="flex flex-col items-center justify-center py-10 text-gray-500">
            <div className="bg-red-50 text-red-500 p-2 rounded-xl flex-shrink-0">
              <FaBoxOpen  className="w-10 h-10 text-red-300" />
            </div>
            <p className="mt-3 text-sm md:text-base font-medium text-gray-500">
              No low stock products to show.
            </p>
          </div>
        )}

        </div>
      </div>




      {/* ===== Recent Invoices Section ===== */}
<div className="px-3 sm:px-4 md:px-6 mt-6 md:mt-8">
  <div className="bg-white rounded-2xl shadow-md border border-gray-100 w-full p-4 md:p-6">
    {/* Header */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-3">
      <div className="flex items-start gap-3 md:gap-5">
        <div className="bg-blue-50 text-blue-500 p-2 rounded-xl flex-shrink-0">
          <FaFileInvoice className="w-5 h-5 md:w-6 md:h-6" />
        </div>
        <div>
          <h2 className="text-base md:text-lg font-semibold text-gray-800">Recent Invoices</h2>
          <p className="text-xs md:text-sm text-gray-500">10 most recent invoice records</p>
        </div>
      </div>
    </div>

    {/* Content */}
    {recentInvoices.length > 0 ? (
      <>
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto -mx-4 md:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full text-sm text-left border border-gray-200 rounded-xl overflow-hidden">
              <thead className="bg-[#E5F1FF] text-blue-900">
                <tr>
                  <th className="px-4 lg:px-6 py-3 font-semibold rounded-tl-xl whitespace-nowrap">Invoice #</th>
                  <th className="px-4 lg:px-6 py-3 font-semibold whitespace-nowrap">Date</th>
                  <th className="px-4 lg:px-6 py-3 font-semibold whitespace-nowrap">Customer</th>
                  <th className="px-4 lg:px-6 py-3 font-semibold whitespace-nowrap">Amount</th>
                  <th className="px-4 lg:px-6 py-3 font-semibold text-center whitespace-nowrap">Status</th>
                  <th className="px-4 lg:px-6 py-3 font-semibold text-center rounded-tr-xl whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentInvoices.map((invoice) => (
                  <tr
                    key={invoice._id}
                    className="hover:bg-blue-50 even:bg-[#F7FAFF] transition duration-200"
                  >
                    <td className="px-4 lg:px-6 py-3 md:py-4 text-blue-900 font-medium whitespace-nowrap">
                      {invoice.invoiceNo}
                    </td>
                    <td className="px-4 lg:px-6 py-3 md:py-4 text-gray-600 whitespace-nowrap">
                      {new Date(invoice.date).toLocaleDateString("en-GB")}
                    </td>
                    <td className="px-4 lg:px-6 py-3 md:py-4 text-gray-700 whitespace-nowrap font-semibold">
                      {invoice.customerName}
                    </td>
                    <td className="px-4 lg:px-6 py-3 md:py-4 text-gray-800 font-normal whitespace-nowrap">
                      ₹{invoice?.amount?.grandTotal?.toFixed(2)?.toLocaleString() ?? "0.00"}
                    </td>
                    <td className="px-4 lg:px-6 py-3 md:py-4 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex justify-center items-center px-2 md:px-3 py-1 text-xs md:text-sm font-semibold rounded-full w-16 md:w-20 ${
                          invoice.status === "PAID"
                            ? "text-green-700 bg-green-100"
                            : "text-yellow-700 bg-yellow-100"
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>

                    <td className="px-4 lg:px-6 py-3 md:py-4 text-center whitespace-nowrap">
                      <button
                        className="text-blue-900 hover:text-cyan-600 transition"
                        onClick={() => handlePrintInvoice(invoice._id)}
                      >
                        {invoice._id === invoiceIdToPrint ? (
                          <Spinner size={18} color="#2a4365" />
                        ) : (
                          <HiPrinter className="w-5 h-5 md:w-6 md:h-6" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {recentInvoices.map((invoice, index) => (
            <div
              key={invoice._id}
              className={`rounded-lg shadow p-4 ${
                index % 2 === 1 ? "bg-gray-50" : "bg-white"
              } border border-gray-100`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-blue-900">
                    {invoice.invoiceNo}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {new Date(invoice.date).toLocaleDateString("en-GB")}
                  </div>
                </div>
                <span
                  className={`inline-flex items-center justify-center px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap flex-shrink-0 ml-2 ${
                    invoice.status === "PAID"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {invoice.status}
                </span>
              </div>
              <div className="text-sm text-gray-700 mb-3 font-medium">
                {invoice.customerName}
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <div>
                  <div className="text-xs text-gray-500">Amount</div>
                  <div className="text-base font-semibold text-gray-900">
                    ₹{invoice?.amount?.grandTotal?.toFixed(2)?.toLocaleString() ?? "0.00"}
                  </div>
                </div>
                <button
                  className="text-blue-900 hover:text-cyan-600 p-2 hover:bg-gray-100 rounded-lg transition"
                  onClick={() => handlePrintInvoice(invoice._id)}
                >
                  {invoice._id === invoiceIdToPrint ? (
                    <Spinner size={18} color="#2a4365" />
                  ) : (
                    <HiPrinter className="w-5 h-5 md:w-6 md:h-6" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </>
    ) : (
<div className="flex flex-col items-center justify-center py-10 text-gray-500">
  <div className="bg-blue-50 text-blue-500 p-2 rounded-xl flex-shrink-0">
    <FaFileInvoice className="w-10 h-10 text-blue-300" />
  </div>
  <p className="mt-3 text-sm md:text-base font-medium text-gray-500">
    No recent invoices found.
  </p>
</div>
    )}
  </div>
</div>

      
      {/* Print Invoice Dialog */}
      <PrintInvoiceDialog
        isOpen={isPrintDialogOpen}
        onClose={() => setIsPrintDialogOpen(false)}
        invoiceData={invoiceDataToPrint}
      />
    </div>
  );
};

export default DashBoard;
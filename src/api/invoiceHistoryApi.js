import axiosInstance from "./axiosInstance";
import storeRef from "./axiosInstance";

// Convert ArrayBuffer to Blob and trigger download
function downloadFileFromArrayBuffer(arrayBuffer, fileName, mimeType) {
  const blob = new Blob([arrayBuffer], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

const invoiceHistoryApi = {};

invoiceHistoryApi.getInvoiceHistoryData = async (search = "", page = 1, status = "ALL") => {
  const response = await axiosInstance.get(`/dashboard/get-invoicesV2?search=${encodeURIComponent(search)}&page=${page}&status=${status}`);
  return response.data;
};

invoiceHistoryApi.updateInvoiceStatus = async (id, amount, paymentMode) => {
  const response = await axiosInstance.put(`/dashboard/mark-paid-invoiceV2/${id}`, { amount, paymentMode });
  return response.data;
};

// Return Product api
invoiceHistoryApi.returnProduct = async (id, returnedProducts) => {
  const response = await axiosInstance.put(`invoicev2/return-products/${id}`,{ returnedProducts });
  return response.data;
};

//getting invoice printing data
invoiceHistoryApi.getInvoiceData = async (id) => {
  const response = await axiosInstance.get(`invoicev2/get-invoice/${id}`);
  return response.data;
};

// export invoice
invoiceHistoryApi.exportInvoiceApi = async () => {
  try {
    // Fetch binary Excel file
    const response = await axiosInstance.get("dashboard/invoices-exportV2", {
      responseType: "arraybuffer",
    });

    //  Trigger browser download
    downloadFileFromArrayBuffer(
      response.data,
      "ritsinvoiceDetails.xlsx",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    return { success: true };
  } catch (error) {
    const status = error?.response?.status;
    console.log("from INvoice History API", status);
    if (status === 402) {
      storeRef.dispatch({ type: "subscription/show402Popup" });
      return;
    }
    console.error("Export Invoice Error:", error);
    throw error;
  }
};


export default invoiceHistoryApi;
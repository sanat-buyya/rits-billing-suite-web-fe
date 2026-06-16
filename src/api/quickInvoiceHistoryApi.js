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

const quickInvoiceHistoryApi = {};

quickInvoiceHistoryApi.getQuickInvoiceHistory = async (search = "", page = 1) => {
  const response = await axiosInstance.get(
    `/dashboard/get-quick-invoices?search=${encodeURIComponent(search)}&page=${page}`
  );
  return response.data; 
};

quickInvoiceHistoryApi.getInvoiceData = async (id) => {
  const response = await axiosInstance.get(`quickInvoice/get-quick-invoice/${id}`);
  return response.data;
};

// Return Product api
quickInvoiceHistoryApi.returnProduct = async (id, returnedProducts) => {
  const response = await axiosInstance.put(`quickInvoice/return-quick-invoice/${id}`,{ returnedProducts });
  return response.data;
};

quickInvoiceHistoryApi.quickInvoiceExportInvoiceApi = async () => {
  try {
    // Fetch binary Excel file
    const response = await axiosInstance.get("dashboard/quick-invoices-exportV2", {
      responseType: "arraybuffer",
    });

    //  Trigger browser download
    downloadFileFromArrayBuffer(
      response.data,
      "ritsquickinvoiceDetails.xlsx",
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



export default quickInvoiceHistoryApi;
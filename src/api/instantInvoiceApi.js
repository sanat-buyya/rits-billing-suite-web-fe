import axiosInstance from "./axiosInstance";

const instantInvoiceApi = {};

instantInvoiceApi.getCustomerByNumber = async (number) => {
    const response = await axiosInstance.get(`/customers/search-customers?query=${number}`);
    return response.data;
}

instantInvoiceApi.getProductsByIds = async (productId) => {
  const response = await axiosInstance.get(`/productv2/${productId}`);
  return response.data;
};

instantInvoiceApi.createInstantInvoice = async (invoiceData) => {
  const response = await axiosInstance.post("/quickInvoice/create-quick-invoice", invoiceData);
  return response.data;
};

export default instantInvoiceApi
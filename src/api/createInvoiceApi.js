import axiosInstance from "./axiosInstance";

const createInvoiceApi = {};

createInvoiceApi.getCustomerByNumber = async (number) => {
    const response = await axiosInstance.get(`/customers/search-customers?query=${number}`);
    return response.data;
}

createInvoiceApi.getProductsByIds = async (productId) => {
  const response = await axiosInstance.get(`/productv2/${productId}`);
  return response.data;
};

createInvoiceApi.createInvoice = async (invoiceData) => {
  const response = await axiosInstance.post("/invoicev2/create-invoice", invoiceData);
  return response.data;
};

export default createInvoiceApi
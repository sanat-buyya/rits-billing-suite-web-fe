import axiosInstance from "./axiosInstance";

const quotationApi = {};


//Get customer by mobile number
quotationApi.getCustomersByMobileNumber = async (mobileNumber) => {
  const response = await axiosInstance.get(
    `/customers/search-customers?query=${mobileNumber}`
  );
  return response.data;
};


//Get product by product ID
quotationApi.getProductsByIds = async (productId) => {
  const response = await axiosInstance.get(`/productv2/${productId}`);
  return response.data;
};

//create invoice
quotationApi.createQuotationApi = async (quotationData) => {
  console.log("🟨 [API] Sending Payload to Server:", quotationData);
  const response = await axiosInstance.post("/quotation2/create-quotation", quotationData);
  console.log("🟩 [API] Server Response:", response.data);
  return response.data;
};

export default quotationApi;
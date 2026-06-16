import axiosInstance from "./axiosInstance";

const customerApi = {};

customerApi.getCustomerApi = async (page = 1) => {
    const response = await axiosInstance.get(`/customers/get-customers?page=${page}`);
    return response;
};

customerApi.serchCustomer = async ({ searchInput, page = 1 }) => {
  const response = await axiosInstance.get(
    `/customers/search-customers?query=${searchInput}&page=${page}`
  );
  return response;
};

customerApi.createCustomer = async (data) => {
  const response = await axiosInstance.post("/customers/create-customer", data);
  return response;
};

customerApi.updateCustomer = async (customerId, data) => {
  const response = await axiosInstance.put(`/customers/update-customer/${customerId}`, data);
  return response;
};

customerApi.deleteCustomer = async (customerId) => {
  const response = await axiosInstance.delete(`/customers/delete-customer/${customerId}`);
  return response;
};


export default customerApi;
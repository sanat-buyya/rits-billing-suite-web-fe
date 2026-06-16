import axiosInstance from "./axiosInstance";

const subscriptionApi = {};

subscriptionApi.getAllSubscriptionPlansApi = async () => {
  const response = await axiosInstance.get("/subscription/getAllPlans");
  return response.data;
};


subscriptionApi.getPlanDetailsApi = async () => {
  const response = await axiosInstance.get("/subscription/getPlanDetails");
  return response.data;
};
export default subscriptionApi;
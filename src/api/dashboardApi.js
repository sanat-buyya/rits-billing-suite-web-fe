import axiosInstance from "./axiosInstance";

const dashboardApi = {};



dashboardApi.getDashboardData = async () => {
  const response = await axiosInstance.get("/dashboard/get-dashboardV2");
  console.log("Dashboard Data:", response);
  return response.data;
}

export default dashboardApi;
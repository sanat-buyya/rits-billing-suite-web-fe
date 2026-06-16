import axiosInstance from "./axiosInstance";


const profileApi = {};

profileApi.getUserInfo = async () => {
  const response = await axiosInstance.get("/dashboard/get-users-info");
    return response.data?.user; 
  
}

export default profileApi;
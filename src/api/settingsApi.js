import axiosInstance from "./axiosInstance";

const settingsApi = {};

settingsApi.updateSettingsApi = async (settingsData) => {
  const formData = new FormData();
 
  // append all text fields except businessLogo
  Object.entries(settingsData).forEach(([key, value]) => {
    if (value !== undefined && value !== null && key !== "businessLogo") {
      formData.append(key, value);
    }
  });
 
  // Handle businessLogo for web (File object)
if (settingsData.businessLogo instanceof File) {
  const file = settingsData.businessLogo;
  const fileExt = file.name.split(".").pop().toLowerCase();
  let mimeType = "image/jpeg";
  if (fileExt === "png") mimeType = "image/png";
  else if (fileExt === "jpg" || fileExt === "jpeg") mimeType = "image/jpeg";

  const safeShopName = (settingsData.shopName || "business")
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_]/g, ""); // sanitize shop name

  const fileName = `${safeShopName}_logo.${fileExt}`;

  // Append file directly to FormData
  formData.append("businessLogo", file, fileName);
}

 
  const response = await axiosInstance.put(
    "/settings/update-business-info",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
 
  return response.data;
};
 
settingsApi.getBusinessInfoApi = async () => {
  const response = await axiosInstance.get("/settings/get-business-info");
  return response.data;
};


export default settingsApi;
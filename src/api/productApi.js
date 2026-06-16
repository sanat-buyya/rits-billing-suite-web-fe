import axiosInstance from "./axiosInstance";

// Convert ArrayBuffer to file and download
export function downloadFileFromArrayBuffer(arrayBuffer, fileName, mimeType) {
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



const productsApi = {};

// Fetch all products with pagination 
productsApi.fetchProductsApi = async (page = 1) => {
  const response = await axiosInstance.get(`productv2/get-all-products?page=${page}`);
  return response.data;
};

// Create a new product
productsApi.createProductApi = async (productData) => {
  const response = await axiosInstance.post("/productv2/create-product", productData);
  return response.data;
};

// Get a single product by product code
productsApi.getProductByCodeApi = async (productCode) => {
  const response = await axiosInstance.get(`/productv2/${productCode}`);
  return response.data;
};

// Update a product by ID
productsApi.updateProductApi = async (productId, updatedData) => {
  const response = await axiosInstance.put(`/productv2/update/${productId}`, updatedData);
  return response.data;
};

// Search product by query
productsApi.searchProductApi = async (query) => {
  const response = await axiosInstance.get(`/productv2/search?query=${query}`);
  return response.data;
};

// Delete a product by ID
productsApi.deleteProductApi = async (productId) => {
  const response = await axiosInstance.delete(`/productv2/delete/${productId}`);
  return response.data;
};

//bulk upload products
productsApi.bulkUploadProductsApi = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file); 

    const response = await axiosInstance.post(
      "/productv2/bulk-upload",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return response.data;
  } catch (error) {
    console.error("Bulk upload error:", error);
    throw error;
  }
};

// export products
productsApi.exportProductsApi = async () => {
  try {
    // Fetch binary Excel file
    const response = await axiosInstance.get("/productv2/getallproducts", {
      responseType: "arraybuffer",
    });

    //  Trigger browser download
    downloadFileFromArrayBuffer(
      response.data,
      "Products.xlsx",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    return { success: true };
  } catch (error) {
    const status = error?.response?.status;
    console.log("from Product API", status);
    if (status === 402) {
      storeRef.dispatch({ type: "subscription/show402Popup" });
      return;
    }
    console.error("Export Products Error:", error);
    throw error;
  }
};

export default productsApi;

// src/features/products/productThunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import productsApi from "../../api/productApi";

// Fetch all products (paginated)
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (page = 1, { rejectWithValue }) => {
    try {
      const response = await productsApi.fetchProductsApi(page);
      return response; // { message, data, pagination }
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch products");
    }
  }
);


// Create a new product
export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const response = await productsApi.createProductApi(productData);
      return response; // { message, data }
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create product");
    }
  }
);


// Update an existing product
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ productId, updatedData }, { rejectWithValue }) => {
    try {
      const response = await productsApi.updateProductApi(productId, updatedData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to update product" }
      );
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await productsApi.deleteProductApi(productId);
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data || { message: "Failed to delete product" }
      );
    }
  }
);

// Search products (paginated or simple query)
// === Search Products ===
export const searchProducts = createAsyncThunk(
  "products/searchProducts",
  async (query, { rejectWithValue }) => {
    try {
      const response = await productsApi.searchProductApi(query);
      return response; // { message, data: [...] }
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to search products" }
      );
    }
  }
);

// Bulk upload products
export const bulkUploadProducts = createAsyncThunk(
  "products/bulkUploadProducts",
  async (file, { rejectWithValue }) => {
    try {
      const response = await productsApi.bulkUploadProductsApi(file);
      return response; 
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to bulk upload products" }
      );
    }
  }
);

// export products
export const exportProducts = createAsyncThunk(
  "product/exportProducts",
  async (_, { rejectWithValue }) => {
    try {
      const result = await productsApi.exportProductsApi();
      return result;
    } catch (error) {
      console.error("Export Products Error ", error);
      return rejectWithValue(error.response?.data || "Failed to export invoices");
    
  
    }
  }
);



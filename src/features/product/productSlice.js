// src/features/products/productSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { fetchProducts, createProduct, updateProduct, deleteProduct, searchProducts, bulkUploadProducts, exportProducts } from "./productThunk";

const initialState = {
  products: [],
  pagination: null,
  loading: false,
  error: null,

  createLoading: false,
  createError: null,
  createSuccess: false,

  updateLoading: false,
  updateError: null,
  updateSuccess: false,

  bulkUploadProductsLoading: false,
  bulkUploadProductsError: null,
  bulkUploadProductsSuccess: false,

  exportProductsLoading: false,
  exportProductsError: null,
  exportProductsSuccess: false,

};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
  },

  extraReducers: (builder) => {
    builder
      // Fetch all products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.data || [];
        state.pagination = action.payload.pagination || null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create a new product
      .addCase(createProduct.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
        state.createSuccess = false;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.createLoading = false;
        state.createSuccess = true;
        state.createError = null;
        const newProduct = action.payload?.data;
        if (newProduct) {
          state.products.unshift(newProduct);

          // Update pagination count
          if (state.pagination) {
            state.pagination.total += 1;
          }
        } // instant update
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.createLoading = false;
        state.createSuccess = false;
        state.createError = action.payload;
      })


      .addCase(updateProduct.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = true;
        const updatedProduct = action.payload?.data;

        if (updatedProduct && Array.isArray(state.products)) {
          const index = state.products.findIndex(
            (p) => p._id === updatedProduct._id
          );
          if (index !== -1) {
            state.products[index] = updatedProduct; // ✅ Instant update
          }
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = false;
        state.updateError = action.payload;
      })

      // === DELETE ===
      .addCase(deleteProduct.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.deleteLoading = false;
        const deletedId = action.payload?.data?._id;
        if (deletedId) {
          state.products = state.products.filter((p) => p._id !== deletedId);
          if (state.pagination && state.pagination.total > 0) {
            state.pagination.total -= 1;
          }
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload;
      })

      // === Search Products ===
      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        // Only replace products with searched results
        state.products = action.payload.data || [];
        // No pagination in search response yet
        state.pagination = null;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // === Bulk Upload Products ===
      .addCase(bulkUploadProducts.pending, (state) => {
        state.bulkUploadProductsLoading = true;
        state.bulkUploadProductsError = null;
        state.bulkUploadProductsSuccess = false;
      })
      .addCase(bulkUploadProducts.fulfilled, (state, action) => {
        state.bulkUploadProductsLoading = false;
        state.bulkUploadProductsSuccess = true;
        state.bulkUploadProductsError = null;
      })
      .addCase(bulkUploadProducts.rejected, (state, action) => {
        state.bulkUploadProductsLoading = false;
        state.bulkUploadProductsSuccess = false;
        state.bulkUploadProductsError = action.payload;
      })

      // export products
      .addCase(exportProducts.pending, (state) => {
        state.exportProductsLoading = true;
        state.exportProductsError = null;
        state.exportProductsSuccess = false;
      })
      .addCase(exportProducts.fulfilled, (state, action) => {
        state.exportProductsLoading = false;
        state.exportProductsSuccess = true;
      })
      .addCase(exportProducts.rejected, (state, action) => {
        state.exportProductsLoading = false;
        state.exportProductsError = action.payload;
        state.exportProductsSuccess = false;
      });

  },
});


export default productSlice.reducer;

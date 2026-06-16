import { createSlice } from "@reduxjs/toolkit";
import { fetchCustomersByMobileNumber, fetchProductByIds, createQuotation  } from "./quotationThunk";

const initialState = {
    customerData: null,
    customerDataLoading: false,
    customerDataError: null,

    fetchedProduct: null,
    fetchedProductLoading: false,
    fetchedProductError: null,

    createQuotationData: null,
    createQuotationLoading: false,
    createQuotationError: null
}



const quotationSlice = createSlice(
    {
        name: "quotation",
        initialState,
        reducers: {

        },
        extraReducers: (builder) => {
            builder  
                     // search customer with mobileno.
                    .addCase(fetchCustomersByMobileNumber.pending, (state) => {
                      state.customerDataLoading = true;
                      state.customerDataError = null;
                    })
                    .addCase(fetchCustomersByMobileNumber.fulfilled, (state, action) => {
                      state.customerDataLoading = false;
                      state.customerData = action.payload;
                    })
                    .addCase(fetchCustomersByMobileNumber.rejected, (state, action) => {
                      state.customerDataLoading = false;
                      state.customerDataError = action.payload;
                    })

                    .addCase(fetchProductByIds.pending, (state) => {   
                            state.fetchedProductLoading = true;
                            state.fetchedProductError = null;
                          })
                    .addCase(fetchProductByIds.fulfilled, (state, action) => {
                            state.fetchedProductLoading = false;
                            state.fetchedProduct = action.payload;
                          })
                    .addCase(fetchProductByIds.rejected, (state, action) => {
                            state.fetchedProductLoading = false;
                            state.fetchedProductError = action.payload;
                          })

                    .addCase(createQuotation.pending, (state) => {
                        state.createQuotationLoading = true;
                        state.createQuotationError = null;
                    })      
                    .addCase(createQuotation.fulfilled,(state, action) => {
                        state.createQuotationLoading = false;
                        state.createQuotationData = action.payload;
                    })
                    .addCase(createQuotation.rejected, (state, action)=> {
                        state.createQuotationLoading = false;
                        state.createQuotationError= action.payload;
                    })
        },
    }
);

export default quotationSlice.reducer;
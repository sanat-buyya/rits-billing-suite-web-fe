import { createSlice } from "@reduxjs/toolkit";
import { getCustomerByNumber, getProductsByIds, createInvoice } from "./createInvoiceThunk";


const initialState = {
    customerData: null,
    customerDataLoading: false,
    customerDataError: null,
    selectedCustomer:null,

    fetchedProduct: null,
    fetchedProductLoading: false,
    fetchedProductError: null,

    invoiceProducts: [],
    productQuantities: {},
    productPrices: {},
    productGstPercentages: {},
    productDiscountPercentage: {},

    createInvoice: null,
    createInvoiceLoading: false,
    createInvoiceError: null
}

const createInvoiceSlice = createSlice({
    name: "createInvoice",
    initialState,
    reducers: {
        addSelectedCustomerToState: (state, action)=>{
            console.log("data :", action.payload);
            state.selectedCustomer = action.payload;
            console.log("stateData", state.selectedCustomer);
        },
        addSelectedProductToState: (state, action) => {
            console.log("prod", action.payload);
            const product = action.payload;
            const exists = state.invoiceProducts.find(
                (p) => p.productId === product.productId
            );
            if (!exists) {
                state.invoiceProducts.push(product);
            }
        },
        
    },
    extraReducers: (builder) => {
        builder
        .addCase(getCustomerByNumber.pending, (state) => {
            state.customerDataLoading = true;
            state.customerDataError = null;
        })
        .addCase(getCustomerByNumber.fulfilled, (state, action) => {
            state.customerDataLoading = false;
            state.customerData = action.payload;
        })
        .addCase(getCustomerByNumber.rejected, (state, action) => {
            state.customerDataLoading = false;
            state.customerDataError = action.payload;
        })

        .addCase(getProductsByIds.pending, (state) => {
            state.fetchedProductLoading = true;
            state.fetchedProductError = null;
        })
        .addCase(getProductsByIds.fulfilled, (state, action) => {
            state.fetchedProductLoading = false;
            state.fetchedProduct = action.payload;
        })
        .addCase(getProductsByIds.rejected, (state, action) => {
            state.fetchedProductLoading = false;
            state.fetchedProductError = action.payload;
        })

        .addCase(createInvoice.pending, (state) => {
            state.createInvoiceLoading = true;
            state.createInvoiceError = null;
        })
        .addCase(createInvoice.fulfilled, (state, action) => {
            state.createInvoiceLoading = false;
            state.createInvoice = action.payload;
        })
        .addCase(createInvoice.rejected, (state, action) => {
            state.createInvoiceLoading = false;
            state.createInvoiceError = action.payload;
        })
    }
})

export const {addSelectedCustomerToState, addSelectedProductToState}= createInvoiceSlice.actions

export default createInvoiceSlice.reducer
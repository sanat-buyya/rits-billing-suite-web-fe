import { createSlice } from "@reduxjs/toolkit";
import {
  getCustomers,
  searchCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "./customerThunk";

const initialState = {
  customers: null,
  customersLoading: false,
  customersError: null,
  customersPage: null,
  totalPages: null,
  nextPage: false,

  serchCustomerLoading: true,
  serchCustomerError: null,

  createCustomerData: null,
  createCustomerLoading: false,
  createCustomerError: null,

  updateCustomer: null,
  updateCustomerLoading: false,
  updateCustomerError: null,

  deleteCustomer: null,
  deleteCustomerLoading: false,
  deleteCustomerError: null,
};

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    addCustomerToState: (state, action) => {
      if (!Array.isArray(state.customers)) {
        // console.log("it is not array");
        state.customers = [];
      }
      // console.log("addcustomer state action payload", action.payload);
      state.customers.unshift(action.payload);
      if (state.customers.length > 10) {
        state.totalPages++;
        state.customers.pop();
      }
    },
      updateCustomerToState: (state, action) => {
        const index = state.customers.findIndex(
          (c) => c._id === action.payload.customerId
        );
        if (index !== -1) {
          
          state.customers[index] = {
            ...state.customers[index], 
            ...action.payload.customerData  
          };
        }
      },
    deleteCustomerFromState: (state, action) => {
      state.customers = state.customers.filter((c) => c._id != action.payload);
      // console.log(state.customers.length)
      if(state.customers.length<=0){
        state.totalPages--;
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getCustomers.pending, (state) => {
        state.customersLoading = true;
        state.customersError = null;
      })
      .addCase(getCustomers.fulfilled, (state, action) => {
        state.customersLoading = false;
        const { data, pagination } = action.payload;
        state.customers = data;
        state.customersPage = pagination.page;
        state.totalPages = pagination.totalPages;
        state.nextPage = pagination.hasNextPage;
        // console.log("action apyload", action.payload);
        // console.log("action apyload", Array.isArray(data));
      })
      .addCase(getCustomers.rejected, (state, action) => {
        state.customersLoading = false;
        state.customersError = action.payload;
      })

      .addCase(searchCustomers.pending, (state) => {
        state.serchCustomerLoading = true;
        state.serchCustomerError = null;
      })
      .addCase(searchCustomers.fulfilled, (state, action) => {
        state.serchCustomerLoading = false;
        state.customers = action.payload.data;
        // console.log("action payload search", action.payload.data);
      })
      .addCase(searchCustomers.rejected, (state, action) => {
        state.serchCustomerLoading = false;
        state.serchCustomerError = action.payload;
      })

      .addCase(createCustomer.pending, (state) => {
        state.createCustomerLoading = true;
        state.createCustomerError = null;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.createCustomerLoading = false;
        state.createCustomerData = action.payload;
        //  console.log("create",action.payload.data)
        // state.customers=action.payload.data
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.createCustomerLoading = false;
        state.createCustomerError = action.payload;
      })

      .addCase(updateCustomer.pending, (state) => {
        state.updateCustomerLoading = true;
        state.updateCustomerError = null;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.updateCustomerLoading = false;
        state.updateCustomer = action.payload;
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.updateCustomerLoading = false;
        state.updateCustomerError = action.payload;
      })

      .addCase(deleteCustomer.pending, (state) => {
        state.deleteCustomerLoading = true;
        state.deleteCustomerError = null;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.deleteCustomerLoading = false;
        state.deleteCustomer = action.payload;
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.deleteCustomerLoading = false;
        state.deleteCustomerError = action.payload;
      });
  },
});

export const {
  addCustomer,
  addCustomerToState,
  updateCustomerToState,
  deleteCustomerFromState,
} = customerSlice.actions;
export default customerSlice.reducer;

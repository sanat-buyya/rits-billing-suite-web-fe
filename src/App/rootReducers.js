import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import profileReducer from "../features/profile/profileSlice";
import dashboardReducer from "../features/dashBoard/dashBoardSlice";
import invoiceHistoryReducer from "../features/invoiceHistory/invoiceHistorySlice";
import customerReducer from "../features/customer/customerSlice";
import settingsReducer from "../features/setting/settingsSlice";
import quotationReducer from "../features/quotation/quotationSlice"
import createInvoiceReducer from "../features/createInvoice/createInvoiceSlice"
import subscriptionReducer from "../features/Subscription/subscriptionSlice";
import paymentReducer from "../features/Subscription/paymentSlice";
import productReducer from "../features/product/productSlice";
import instantInvoiceSlice from "../features/instantInvoice/instantInvoiceSlice"
import quickInvoiceHistoryReducer from "../features/invoiceHistory/quickInvoiceHistorySlice";
import interiorQuotationReducer from "../features/quotation/interiorQuotationSlice";
import interiorQuotationHistoryReducer from "../features/quotationHistory/interiorQuotationHistorySlice";

const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  dashboard: dashboardReducer,
  invoiceHistory: invoiceHistoryReducer,
  customer: customerReducer,
  settings: settingsReducer,
  quotation: quotationReducer,
  subscription: subscriptionReducer,
  payment: paymentReducer,
  product: productReducer,
  createInvoice: createInvoiceReducer,
  instantInvoice: instantInvoiceSlice,
  quickInvoiceHistory: quickInvoiceHistoryReducer,
  interiorQuotation: interiorQuotationReducer,
  interiorQuotationHistory: interiorQuotationHistoryReducer,
});

export default rootReducer;

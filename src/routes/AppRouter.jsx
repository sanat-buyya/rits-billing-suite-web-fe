import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import publicRoutes from "./PublicRoutes";

import ProtectedRoutes from "./ProtectedRoutes";
import MainLayout from "../Layouts/MainLayout";
import DashBoard from "../features/dashBoard/Pages/DashBoard";
import InstantInvoice from "../features/instantInvoice/Pages/InstantInvoice"
import CreateInvoice from "../features/createInvoice/Pages/CreateInvoice";
import Quotation from "../features/quotation/Pages/Quotation";
import InvoiceHistory from "../features/invoiceHistory/Pages/InvoiceHistory";
import QuotationHistory from "../features/quotationHistory/Pages/InteriorQuotationHistory";
import Product from "../features/product/Pages/Product";
import Customer from "../features/customer/Pages/Customer";
import Subscription from "../features/Subscription/Pages/SubsCription";
import Settings from "../features/setting/Pages/Settings";
import Profile from "../features/profile/Pages/Profile"

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        {publicRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}

        {/* Protected routes */}
        <Route element={<ProtectedRoutes />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<DashBoard />} />
            <Route path="/instant-invoice" element={<InstantInvoice />} />
            <Route path="/create-invoice" element={<CreateInvoice />} />
            <Route path="/quotation" element={<Quotation />} />
            <Route path="/invoice-history" element={<InvoiceHistory />} />
            <Route path="/quotation-history" element={<QuotationHistory />} />
            <Route path="/products" element={<Product />} />
            <Route path="/customers" element={<Customer />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;

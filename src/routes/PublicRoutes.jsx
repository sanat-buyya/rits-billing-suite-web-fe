import LandingPage from "../features/landing/Pages/LandingPage";
import LoginPage from "../features/auth/Pages/LoginPage";
import RegisterPage from "../features/auth/Pages/RegisterPage";
import VerifyOtp from "../features/auth/Pages/VerifyOtp";
import PrivacyPolicy from "../features/landing/Pages/PrivacyPolicy";
import SendEmailForgetPassword from "../features/auth/Pages/SendEmailForgetPassword";
import ResetPasswordPage from "../features/auth/Pages/ResetPasswordPage";
import ContactUs from "../features/landing/Pages/ContactUs";

const publicRoutes = [
    { path: "/", element: <LandingPage /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/register", element: <RegisterPage /> },
    { path: "/verify-otp", element: <VerifyOtp /> },
    { path: "/privacy-policy", element: <PrivacyPolicy /> }, 
    { path: "/send-email-forget-password", element: <SendEmailForgetPassword /> },  
    { path: "/reset-password", element: <ResetPasswordPage /> },
    { path: "/ContactUs", element: <ContactUs /> },
]

export default publicRoutes
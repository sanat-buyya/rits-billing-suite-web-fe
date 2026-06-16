import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import RegSuccessPopup from "../components/RegSuccessPopup";
import TrialExpiredPopup from "../components/TrialEndedPopup";
import { clearVerifyState, changingSubscriptionState } from "../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const MainLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showTrialExpiredPopup, setShowTrialExpiredPopup] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { verifyMessage, subsCriptionExpired } = useSelector((state) => state.auth);

  console.log("subsCriptionExpired in layout:", subsCriptionExpired);

  // Registration success popup
  useEffect(() => {
    if (verifyMessage) {
      setShowSuccessPopup(true);
    }
  }, [verifyMessage]);

  const handleCloseSuccessPopup = () => {
    setShowSuccessPopup(false);
    dispatch(clearVerifyState());
  };

  const handleViewPlans = () => {
    setShowSuccessPopup(false);
    dispatch(clearVerifyState());
    navigate("/subscription");
  };

  // Subscription expired popup
  useEffect(() => {
    if (subsCriptionExpired) {
      setShowTrialExpiredPopup(true);
    }
  }, [subsCriptionExpired]);

  const handleCloseTrialPopup = () => {
    setShowTrialExpiredPopup(false);
    dispatch(changingSubscriptionState());
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* Sidebar */}
      <SideBar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main content */}
      <div className="flex flex-col flex-1 md:ml-0">
        {/* Header */}
        <Header onMobileMenuClick={() => setMobileOpen(true)} />

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* Registration Success Popup */}
      {showSuccessPopup && (
        <RegSuccessPopup
          onClose={handleCloseSuccessPopup}
          onViewPlans={handleViewPlans}
        />
      )}

      {/* Trial Expired Popup */}
      {showTrialExpiredPopup && (
        <TrialExpiredPopup onClose={handleCloseTrialPopup} />
      )}
    </div>
  );
};

export default MainLayout;

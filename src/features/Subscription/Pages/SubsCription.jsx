import React, { useRef, useState, useEffect } from "react";
import { HiPlusCircle } from "react-icons/hi";
import {
  getAllSubscriptionPlansThunk,
  getPlanDetailsThunk,
} from "../subscriptionThunk";
import { verifyPaymentThunk, createOrderThunk } from "../paymentThunk";
import { useSelector, useDispatch } from "react-redux";
import AppToast from "../../../services/toastService";
import SubscriptionSkeleton from "./SubsCriptionSkeleton";
import { i } from "framer-motion/client";
import Spinner from "../../../components/Spinner";
import { restoreUser } from "../../auth/authThunk";

//  Icons
const CheckIcon = () => (
  <svg
    className="w-5 h-5 text-green-500 mr-2 flex-shrink-0"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M5 13l4 4L19 7"
    />
  </svg>
);

const XIcon = () => (
  <svg
    className="w-5 h-5 text-gray-400 mr-2 flex-shrink-0"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

// ✅ Plans Data
const pricingPlans = [
  {
    name: "Monthly Plan",
    price: 319,
    originalPrice: 399,
    discount: 20,
    duration: "30 Days",
    description:
      "Get complete access to Create Invoices, Generate Quotations, Track Invoice History, Manage Products, and Customers—all in one place.",
    features: [
      { text: "Full Access to Billing Tools", included: true },
      { text: "30 Days Validity", included: true },
      { text: "Customer Management", included: true },
      { text: "Product Management", included: true },
    ],
  },
  {
    name: "Quarterly Plan",
    price: 899,
    originalPrice: 1199,
    discount: 25,
    duration: "90 Days",
    description:
      "Extended access to Create Invoices, Generate Quotations, Track Invoice History, Manage Products, and Customers—ensuring smoother billing.",
    features: [
      { text: "Full Access to Billing Tools", included: true },
      { text: "90 Days Validity", included: true },
      { text: "Customer Management", included: true },
      { text: "Invoice History Tracking", included: true },
    ],
  },
  {
    name: "Semi-Annual Plan",
    price: 1799,
    originalPrice: 2399,
    discount: 25,
    duration: "180 Days",
    description:
      "Comprehensive access to Invoicing, Quotations, Product, and Customer Management—designed for sustained growth and hassle-free billing.",
    features: [
      { text: "Unlimited Billing Access", included: true },
      { text: "6 Months Validity", included: true },
      { text: "Advanced Quotation System", included: true },
      { text: "Priority Support", included: true },
    ],
  },
  {
    name: "Annual Plan",
    price: 3499,
    originalPrice: 4793,
    discount: 27,
    duration: "365 Days",
    description:
      "Complete access to all features—Invoicing, Quotations, History, Product, and Customer Management—for long-term growth.",
    features: [
      { text: "Unlimited Access", included: true },
      { text: "1 Year Validity", included: true },
      { text: "Advanced Analytics", included: true },
      { text: "Priority Support", included: true },
    ],
  },
];

// ✅ Account Overview Card (from first code) — now scrolls to "Choose Your Plan"
const AccountOverviewCard = ({ onUpgradeClick, planDetails }) => {
  const currentPlanName = planDetails?.data.subscriptionPlanName;
  let totalDays;
  switch (currentPlanName) {
    case "Monthly Plan":
      totalDays = 30;
      break;
    case "Quarterly Plan":
      totalDays = 90;
      break;
    case "Semi-Annual Plan":
      totalDays = 180;
      break;
    case "Annual Plan":
      totalDays = 365;
      break;
    default:
      totalDays = 5;
      break;
  }
  // console.log(totalDays);
  const daysRemaining = planDetails?.data.totalDaysRemaining;
  const currentdate = new Date();
  // console.log(currentdate);

  //formating date
  // console.log(planDetails?.data.planRenewalDate);
  const renewalDate = new Date(planDetails?.data.planRenewalDate);
  // console.log(renewalDate);
  let renewal = renewalDate.toLocaleDateString("en-GB");
  const nextPaymentDate = renewal;

  const progressPercentage = Math.max(
    0,
    Math.min(100, (daysRemaining / totalDays) * 100)
  );

  return (
    <div
      className="relative border border-gray-100 shadow-md rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
      style={{
        background: "linear-gradient(135deg, #ffffff 0%, #f0f4ff 100%)",
      }}
    >
      <div className="flex flex-col lg:flex-row justify-between gap-6">
        {/* Left */}
        <div>
          <div className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full uppercase mb-2">
            {currentPlanName}
          </div>
          <p className="text-lg font-semibold text-gray-900">
            {daysRemaining} Days Remaining
          </p>
          <p className="text-sm text-gray-500 mb-3">
            Next Billing: {nextPaymentDate}
          </p>

          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                progressPercentage > 50
                  ? "bg-green-500"
                  : progressPercentage > 20
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>

          <p className="text-xs text-gray-500 mt-1">
            {progressPercentage.toFixed(0)}% of your plan duration remaining
          </p>
        </div>

        {/* Right */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onUpgradeClick}
            className="flex items-center justify-center bg-[#0a1628] hover:bg-slate-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md transition-colors"
          >
            Upgrade Plan
            <HiPlusCircle className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ✅ Pricing Card
const PricingCard = ({ plan, onclickPaymentHandel, loading, id }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-transform duration-300 hover:scale-[1.02] relative">
    {plan.discount > 0 && (
      <div className="absolute -top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase shadow">
        {plan.discount}% OFF
      </div>
    )}
    <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.planName}</h3>
    <p className="text-gray-500 mb-4 text-sm">{plan.description}</p>

    <div className="flex items-baseline mb-6">
      <span className="text-3xl font-extrabold text-gray-900">
        ₹{plan.finalPrice}
      </span>
      <span className="text-sm text-gray-400 line-through ml-2">
        ₹{plan.price}
      </span>
    </div>

    {/* {console.log(pricingPlans.find((item) => item.name == plan.planName))} */}
    {plan.planName == "Monthly plan" ? (
      <ul className="space-y-2 text-gray-600 text-sm mb-6">
        <li className="flex items-center">
          {" "}
          <CheckIcon />
          Full Access to Billing Tools
        </li>
        <li className="flex items-center">
          {" "}
          <CheckIcon />
          30 Days Validity
        </li>
        <li className="flex items-center">
          {" "}
          <CheckIcon />
          Customer Management
        </li>
        <li className="flex items-center">
          {" "}
          <CheckIcon />
          Product Management
        </li>
      </ul>
    ) : (
      ""
    )}
    {plan.planName == "Quarterly Plan" ? (
      <ul className="space-y-2 text-gray-600 text-sm mb-6">
        <li className="flex items-center">
          {" "}
          <CheckIcon />
          Full Access to Billing Tools
        </li>
        <li className="flex items-center">
          {" "}
          <CheckIcon />
          90 Days Validity
        </li>
        <li className="flex items-center">
          {" "}
          <CheckIcon />
          Customer Management
        </li>
        <li className="flex items-center">
          {" "}
          <CheckIcon />
          Invoice History Tracking
        </li>
      </ul>
    ) : (
      ""
    )}
    {plan.planName == "Semi-Annual Plan" ? (
      <ul className="space-y-2 text-gray-600 text-sm mb-6">
        <li className="flex items-center">
          {" "}
          <CheckIcon />
          Unlimited Billing Access
        </li>
        <li className="flex items-center">
          {" "}
          <CheckIcon />6 Months Validity
        </li>
        <li className="flex items-center">
          {" "}
          <CheckIcon />
          Advanced Quotation System
        </li>
        <li className="flex items-center">
          {" "}
          <CheckIcon />
          Priority Support
        </li>
      </ul>
    ) : (
      ""
    )}
    {plan.planName == "Annual Plan" ? (
      <ul className="space-y-2 text-gray-600 text-sm mb-6">
        <li className="flex items-center">
          {" "}
          <CheckIcon />
          Unlimited Billing Access
        </li>
        <li className="flex items-center">
          {" "}
          <CheckIcon />1 Year Validity
        </li>
        <li className="flex items-center">
          {" "}
          <CheckIcon />
          Advanced Analytics
        </li>
        <li className="flex items-center">
          {" "}
          <CheckIcon />
          Priority Support
        </li>
      </ul>
    ) : (
      ""
    )}

    {/* <ul className="space-y-2 text-gray-600 text-sm mb-6">
      {pricingPlans
        .find((item) => item.name == plan.planName)
        .features.map((feature, i) => (
          <li key={i} className="flex items-center">
            {feature.included ? <CheckIcon /> : <XIcon />}
            {feature.text}
          </li>
        ))}
    </ul> */}

    <button
      className="flex justify-center items-center gap-1 w-full py-2.5 rounded-lg bg-[#0a1628] hover:bg-slate-700 text-white font-semibold transition-all"
      onClick={() => onclickPaymentHandel(plan._id)}
    >
      {loading && id == plan._id ? (
        <Spinner size={16} color="White" />
      ) : (
        "Subscribe"
      )}
    </button>
  </div>
);

//  Main Page — with smooth scroll
const Subscription = () => {
  const planSectionRef = useRef(null);
  const dispatch = useDispatch();
  const [subscriptionPlanID, setSubscriptionPlanID] = useState("");

  const {
    getAllSubscriptionsData,
    getAllSubscriptionsLoading,
    getPlanDetailsData,
  } = useSelector((state) => state.subscription);
  const { createOrderLoading, verifyPaymentData } = useSelector(
    (state) => state.payment
  );

  const handleUpgradeClick = () => {
    planSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getAllPlans = async () => {
    await dispatch(getAllSubscriptionPlansThunk())
      .unwrap()
      .then((res) => {
        // console.log(res.data);
      })
      .catch((err) => {
        console.log("get  all subscription plan  details", err);
      });
  };

  const getCurrentSubscribedDetails = async () => {
    await dispatch(getPlanDetailsThunk())
      .unwrap()
      .then((res) => {
        // console.log(res);
      })
      .catch((err) => {
        console.log("error from getCurrentSubscribedDetails", err);
      });
  };

  useEffect(() => {
    getAllPlans();
    getCurrentSubscribedDetails();
  }, [verifyPaymentData]);

  const handlePayment = async (subscriptionId) => {
    setSubscriptionPlanID(subscriptionId);
    await dispatch(createOrderThunk(subscriptionId))
      .unwrap()
      .then((res) => {
        // console.log(res.data);
        let subscriptionPlanId = res.data.notes.subscriptionPlanId;
        const options = {
          key: res.data.notes.RazorpayKeyId, // from dashboard
          amount: res.data.amount, // in paise (e.g. 50000 for ₹500)
          currency: res.data.currency,
          name: "RITS Billing Suit", // your brand or project name
          description: "Subscription Payment",
          order_id: res.data.id,
          handler: async function (response) {
            // console.log("Payment success:", response);
            await dispatch(
              verifyPaymentThunk({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                subscriptionPlanId,
              })
            )
              .unwrap()
              .then((res) => {
                // console.log(res);
                // console.log(res.message);
                 if (res) {
                  AppToast.showSuccess(
                    "Hey we received your payment successfully"
                  );
                }
                dispatch(restoreUser())
              })
              .catch((err) => {
                console.log(err);
                  AppToast.showError(
                  err?.message ||
                    "Payment received, but verification failed. Our team will review and refund if required"
                );
              });
          },

          theme: {
            color: "#3b82f6", // Tailwind blue
          },
        };

        // Open Razorpay checkout
        const rzp = new window.Razorpay(options);
        rzp.open();

        //  Optional: handle payment failure
        rzp.on("payment.failed", function (response) {
          // console.error("Payment failed:", response.error);
          AppToast.showError("Payment failed. Please try again.");
        });
      })
      .catch((err) => {
        console.log("error from create order payment", err);
      });
  };

  // loading razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <>
      {getAllSubscriptionsLoading ? (
        <SubscriptionSkeleton />
      ) : (
        <div className="bg-[#f9fafc] shadow-sm p-6 md:p-8 border border-gray-200">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Upgrade Your Billing Experience
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Choose the plan that fits your business and unlock powerful
              features.
            </p>
          </div>

          {/* Current Plan */}
          <AccountOverviewCard
            onUpgradeClick={handleUpgradeClick}
            planDetails={getPlanDetailsData}
          />

          {/* Plans Section */}
          <div ref={planSectionRef} className="mt-10 scroll-mt-24">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
              Choose Your Plan
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {getAllSubscriptionsData?.map((plan, index) => (
                <PricingCard
                  key={index}
                  plan={plan}
                  onclickPaymentHandel={handlePayment}
                  loading={createOrderLoading}
                  id={subscriptionPlanID}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Subscription;

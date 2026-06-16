import axiosInstance from "./axiosInstance";

const paymentApi = {};

paymentApi.createOrderApi = async (subscriptionId) => {
  const response = await axiosInstance.post("/payment/createOrder", {
    subscriptionId,
  });
  return response.data;
};

paymentApi.verifyPaymentApi = async ({
  razorpay_payment_id,
  razorpay_order_id,
  razorpay_signature,
  subscriptionPlanId,
}) => {
  // console.log(
  //   "Payment data in API:",
  //   razorpay_payment_id,
  //   razorpay_order_id,
  //   razorpay_signature,
  //   subscriptionPlanId
  // );
  const response = await axiosInstance.post("/payment/verify", {
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    subscriptionPlanId,
  });
  return response.data;
};
export default paymentApi;

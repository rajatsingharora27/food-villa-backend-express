import Razorpay from "razorpay";

export const constgetRazorPayInstance = () => {
  if (process.env.RAZORPAY_ID !== undefined && process.env.RAZORPAY_PASSWORD !== undefined) {
    return new Razorpay({ key_id: process.env.RAZORPAY_ID, key_secret: process.env.RAZORPAY_PASSWORD });
  }
};

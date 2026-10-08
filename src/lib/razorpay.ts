import Razorpay from "razorpay";

const key_id =
  process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_sreesha_demo";
const key_secret = process.env.RAZORPAY_KEY_SECRET || "sreesha_mock_secret_key_2026";

export const razorpay = new Razorpay({
  key_id,
  key_secret,
});

export const getRazorpayKeyId = () => key_id;

import express from 'express';
import { sendCustomerOtp, verifyCustomerOtp } from "../controller/otpController";

const router = express.Router();

// Endpoint for sending OTP
router.post('/send-otp', sendCustomerOtp);

// Endpoint for verifying OTP
router.post('/verify', verifyCustomerOtp);

export default router;
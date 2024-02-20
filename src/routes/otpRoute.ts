import express from "express";

import { customerOtp, verifyCustomerOtp } from "../controller/otp";

const router = express.Router();

router.post('/send-otp', customerOtp);

router.post('/verify-otp', verifyCustomerOtp);
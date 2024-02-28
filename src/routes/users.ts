import express from "express";
import { createUser, createGoogleUser, loginUser } from '../controller/userController';
import { verifyCustomerOtp } from "../controller/userController";

const router = express.Router();

/* GET users listing. */
router.get("/", function (req, res) {
  res.send("respond with a resource");
});

// Endpoint for creating a new user
router.post('/createUser', createUser);

// Endpoint for creating a new user using Google Sign-In
router.post('/createGoogleUser', createGoogleUser);

// Enpoint for sending OTP
router.post('/send-otp', createUser);

// Enpoint for verifying OTP
router.post('/verify-otp', verifyCustomerOtp);

router.post('/login', loginUser);

export default router;

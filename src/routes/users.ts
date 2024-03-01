import express from "express";
import { createUser, createGoogleUser, loginUser, savePayment, changePassword } from '../controller/userController';

const router = express.Router();


// Endpoint for creating a new user
router.post('/createUser', createUser);

// Endpoint for creating a new user using Google Sign-In
router.post('/createGoogleUser', createGoogleUser);


// Enpoint for making payment
router.post('/save-payment', savePayment);


// Enpoint forchange password
router.post('/change-password', changePassword);


router.post('/login', loginUser);

export default router;

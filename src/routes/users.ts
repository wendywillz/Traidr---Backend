import express from "express";
import { createUser, createGoogleUser, loginUser, savePayment, changePassword, handleGoogleCallback, getUserShopId, updateUser } from '../controller/userController';

import { getUserIdFromToken } from "../utils/getModelId";

const router = express.Router();


// Endpoint for creating a new user
router.post('/createUser', createUser);

// Endpoint for creating a new user using Google Sign-In
router.post('/createGoogleUser', createGoogleUser);

// Endpoint for handling Google OAuth callback
router.get('/auth/google/callback', handleGoogleCallback);

// Enpoint for making payment
router.post('/save-payment', savePayment);


// Enpoint forchange password
router.post('/change-password', changePassword);

router.get('/get-user-shopId', getUserShopId);
router.post('/login', loginUser);

//Endpoint for updating users
router.post(`/edit-profile`, updateUser)
router.get('/get-id', getUserIdFromToken)
export default router;

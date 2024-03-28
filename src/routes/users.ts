import express from "express";
import { createUser, createGoogleUser, loginUser, savePayment, changePassword, calculateUserActiveDuration, handleGoogleCallback, getUserShopId, updateUser } from '../controller/userController';

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
router.post(`/edit-profile/:userid`, updateUser)

//Endpoint for calculating user active duration
router.post('/active-duration', calculateUserActiveDuration);

export default router;

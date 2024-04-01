import express from "express";

import { calculateUserActiveDuration, getAllUsersGender, getUserActiveDuration } from "../controller/adminController";

const router = express.Router();


router.get('/user-analytics/gender', getAllUsersGender)

//Endpoint for calculating user active duration
router.post('/user-analytics/active-duration', calculateUserActiveDuration);

// Endpoint to get average active user
router.get('/user-analytics/get-average-user', getUserActiveDuration)
export default router;
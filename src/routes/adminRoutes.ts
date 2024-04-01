import express from "express";

import { calculateAverageUsageTimeForAllUser, checkAndVerifyAdminToken, getAllUsersGender, getAverageUsageTimeForAllUser, getDailyActiveUser, updateLastActiveAt} from "../controller/adminController";


const router = express.Router();


router.get('/user-analytics/gender', getAllUsersGender)

//Endpoint for calculating user active duration
router.post('/user-analytics/calculate-active-duration', calculateAverageUsageTimeForAllUser);

// Endpoint to get average active user
router.get('/user-analytics/get-average-usage-time', getAverageUsageTimeForAllUser)

router.get('/verify-token', checkAndVerifyAdminToken)

router.post('/send-last-active-time', updateLastActiveAt)

router.get('/get-daily-active-user', getDailyActiveUser)

export default router;
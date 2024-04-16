import express from "express";

import { calculateAverageUsageTimeForAllUser, checkAndVerifyAdminToken, getAllUsersGender, getAverageUsageTimeForAllUser, getDailyActiveUser, getMonthlyActiveUser, updateLastActiveAt, completedOrdersByUser, getAdminDashboardSummary, getTenantDetails, getProductRevenue, getTenantRevenue} from "../controller/adminController";


const router = express.Router();


router.get('/user-analytics/gender', getAllUsersGender)

//Endpoint for calculating user active duration
router.post('/user-analytics/calculate-active-duration', calculateAverageUsageTimeForAllUser);

// Endpoint to get average active user
router.get('/user-analytics/get-average-usage-time', getAverageUsageTimeForAllUser)

router.get('/verify-token', checkAndVerifyAdminToken)

router.post('/send-last-active-time', updateLastActiveAt)

router.get('/get-daily-active-user', getDailyActiveUser)

router.get('/get-monthly-active-user', getMonthlyActiveUser)

//endpoint to get admin-dashboard-summary for the data cards
router.get('/get-dashboard-summary', getAdminDashboardSummary)

//endpoint to get tenants database
router.get('/get-tenant-db', getTenantDetails)

//endpoint to get revenue by products
router.get('/get-product-revenue', getProductRevenue)

//endpoint to get revenue by vendor
router.get('/get-tenant-revenue', getTenantRevenue)


// Endpoint for creating completedOrders
router.get('/completed-orders-by-user', completedOrdersByUser);

export default router;
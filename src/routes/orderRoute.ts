import express from 'express';
import { completedOrdersByUser } from '../controller/orderController';
 
const router = express.Router();
 
// Endpoint for creating completedOrders
router.get('/completed-orders-by-user', completedOrdersByUser);
 
 
 
export default router;
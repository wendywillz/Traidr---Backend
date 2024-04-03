import express from 'express';
import { addOrderItems, getOrderItems, deleteOrder } from '../controller/orderController';
 
const router = express.Router();
 

router.post('/create-order/', addOrderItems)

router.get('/get-order-items/:userId', getOrderItems)
router.post('/delete-order/', deleteOrder)

 
 
 
export default router;
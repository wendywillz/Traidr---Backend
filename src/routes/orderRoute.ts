import express from 'express';
import { addOrderItems, deleteOrder } from '../controller/orderController';
 
const router = express.Router();
 

router.post('/create-order/', addOrderItems)
router.post('/delete-order/', deleteOrder)

 
 
 
export default router;
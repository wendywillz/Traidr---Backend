import express from 'express';
import { addOrderItems, getOrderItems, cancelOrder} from '../controller/orderController';
 
const router = express.Router();
 

router.post('/create-order/', addOrderItems)

router.get('/get-order-items/:userId', getOrderItems)
router.post('/cancel-order/', cancelOrder) 

 
 
 
export default router;
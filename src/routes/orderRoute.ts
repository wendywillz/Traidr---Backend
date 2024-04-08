import express from 'express';
import { addOrderItems, getOrderItems, cancelOrder} from '../controller/orderController';
import { getAllOrderHistories, getSaleSummaryById } from '../controller/saleController';

const router = express.Router();
 

router.post('/create-order/', addOrderItems)

router.get('/get-order-items', getOrderItems)
router.post('/cancel-order/', cancelOrder) 
router.get('/order-history', getAllOrderHistories)
router.get ('/order-history/:saleId', getSaleSummaryById)

 
 
 
export default router;
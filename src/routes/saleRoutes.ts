import express from "express";
import { createSale, getSaleSummary, deleteSale, cancelSaleAndOrder, completeSaleAndClearCart } from "../controller/saleController";

import { cancelDeliverySaleAndOrder } from "../controller/deliveryController";

const router = express.Router();
router.post('/create-sale', createSale)

router.get('/get-sale-summary', getSaleSummary)
router.post('/complete-sale', completeSaleAndClearCart)//not yet implemented on frontend


router.post('/cancel-sale', cancelSaleAndOrder)
router.post('/cancel-delivey-and-sale', cancelDeliverySaleAndOrder)//not yet implemented on frontend


router.post('/delete-sale', deleteSale)


export default router;
import express from "express";
import { createSale, getSaleSummary, deleteSale, cancelSaleAndOrder } from "../controller/saleController";

const router = express.Router();
router.post('/create-sale', createSale)

router.get('/get-sale-summary/:userId', getSaleSummary)

router.post('/delete-sale', deleteSale)
router.post('/cancel-sale', cancelSaleAndOrder)


export default router;
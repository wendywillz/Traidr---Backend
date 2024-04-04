import express from "express";
import { createSale, getSpcifiedSale, deleteSale } from "../controller/saleController";

const router = express.Router();
router.post('/create-sale', createSale)

router.get('/get-sale', getSpcifiedSale)

router.post('/delete-sale', deleteSale)


export default router;
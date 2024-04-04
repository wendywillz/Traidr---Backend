import express from "express";
import { createSale,getSpcifiedSale, deleteSale } from "../controller/saleController";

const router = express.Router();
router.post('/create-sale', createSale)


export default router;
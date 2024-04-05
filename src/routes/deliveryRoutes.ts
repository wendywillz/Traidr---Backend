import express from "express";
import { createDeliveryDetails } from "../controller/deliveryController";

const router = express.Router();
router.post('/create-delivery/:userId', createDeliveryDetails)
export default router;
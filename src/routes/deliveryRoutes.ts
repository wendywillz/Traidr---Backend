import express from "express";
import { createDeliveryDetails } from "../controller/deliveryController";

const router = express.Router();
router.post('/create-delivery/', createDeliveryDetails)
export default router;
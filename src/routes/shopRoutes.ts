import express from "express";
import { createNewShop, getShopById } from "../controller/shopController";
const router = express.Router();

router.post("/create-shop", createNewShop);
router.get("/get-shop/:shopId", getShopById);


export default router;
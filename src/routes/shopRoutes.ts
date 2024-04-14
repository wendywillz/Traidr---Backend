import express from "express";
import { createNewShop, getShopById, getShopOwnerByShopId } from "../controller/shopController";
const router = express.Router();

router.post("/create-shop", createNewShop);
router.get("/get-shop/:shopId", getShopById);
router.get("/get-shop-owner/:shopId", getShopOwnerByShopId)


export default router;
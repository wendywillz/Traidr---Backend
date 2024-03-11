import express from "express";
import { createNewShop, getShopById } from "../controller/shopController";
import { getAllShopCategories } from "../controller/categories";
const router = express.Router();

router.post("/create-shop", createNewShop);
router.get("/get-shop/:shopId", getShopById);
router.get("/get-shop-categories", getAllShopCategories);


export default router;
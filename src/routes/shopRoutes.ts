import express from "express";
import { createNewShop } from "../controller/shopController";
const router = express.Router();

router.post("/create-shop", createNewShop);

export default router;
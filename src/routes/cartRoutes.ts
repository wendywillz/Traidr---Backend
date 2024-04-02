import express from "express";
import { addToCart, getUserCartItems, deleteCartItem } from "../controller/cartController";



const router = express.Router();
 router.post('/add-to-cart/', addToCart)

 router.get('/get-cart-items/:userId', getUserCartItems)
 router.post('/delete-cart-item', deleteCartItem)


export default router;
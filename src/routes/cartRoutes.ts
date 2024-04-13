import express from "express";
import { addToCart, getUserCartItems, deleteCartItem, moveItemToWishList } from "../controller/cartController";



const router = express.Router();
 router.post('/add-to-cart/', addToCart)
 router.get('/get-cart-items/', getUserCartItems)
 router.post('/delete-cart-item', deleteCartItem)
 router.post('/move-to-wishlist', moveItemToWishList)


export default router;
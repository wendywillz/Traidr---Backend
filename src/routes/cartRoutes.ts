import express from "express";
import { addToCart, getUserCartItems, deleteCartItem, moveItemToWishList, getCartCount } from "../controller/cartController";



const router = express.Router();
 router.post('/add-to-cart/', addToCart)
 router.get('/get-cart-items/', getUserCartItems)
 router.post('/delete-cart-item', deleteCartItem)
 router.post('/move-to-wishlist', moveItemToWishList)
 router.get('/get-cart-count', getCartCount )


export default router;
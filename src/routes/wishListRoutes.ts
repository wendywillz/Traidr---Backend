import express from "express";
import { addToWishList, getWishListItems, deleteWishListItem, getWishListCount } from "../controller/wishListController";



const router = express.Router();
 router.post('/add-item/', addToWishList)
 router.post('/delete-item/', deleteWishListItem)
 router.get('/get-items/', getWishListItems)
 //router.get('/get-count', getWishListCount)


export default router;
import express from "express";
import { addToWishList, getWishListItems, deleteWishListItem, getWishListProductIds } from "../controller/wishListController";



const router = express.Router();
 router.post('/add-item/', addToWishList)
 router.post('/delete-item/', deleteWishListItem)
 router.get('/get-items/', getWishListItems)
 router.get('/get-item-ids/', getWishListProductIds)
 //router.get('/get-count', getWishListCount)


export default router;
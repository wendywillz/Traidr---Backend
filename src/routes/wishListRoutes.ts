import express from "express";
import { addToWishList, getWishListItems, deleteWishListItem } from "../controller/wishListController";



const router = express.Router();
 router.post('/add-item/', addToWishList)

 router.get('/get-items/', getWishListItems)
 router.post('/delete-item', deleteWishListItem)


export default router;
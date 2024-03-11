import { shopCategories } from "../utils/categories";
import { Request, Response } from "express";
export const getAllShopCategories = (req: Request, res: Response) => { 
    try {
        res.json({shopCategories})
    } catch (error) {
        console.log("error", error)
        res.json({errorGettingCategories: "internal server error"})
    }
}
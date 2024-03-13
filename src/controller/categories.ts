import { productCategories } from "../utils/categories";
import { Request, Response } from "express";
export const getAllProductsCategory = (req: Request, res: Response) => { 
    try {
        res.json({productCategories})
    } catch (error) {
        console.log("error", error)
        res.json({errorGettingCategories: "internal server error"})
    }
}
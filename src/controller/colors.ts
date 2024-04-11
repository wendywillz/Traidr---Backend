import { productColors } from "../utils/colors";
import { Request, Response } from "express";
export const getAllProductsColors = (req: Request, res: Response) => { 
    try {
        res.json({productColors})
    } catch (error) {
        console.log("error", error)
        res.json({errorGettingColors: "Error getting colors"})
    }
}
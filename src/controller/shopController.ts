import ShopModel from '../model/shop';
import { Request, Response } from 'express';

export const createNewShop = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("req.body", req.body)
    const { shopName, shopDescription, shopCurrency, shopCategory, shopCountry,
      shopStreetAddress,
      shopCity,
      shopState,
      shopZipCode, shopOwner } = req.body;
    const newShop = await ShopModel.create({
        shopName,
        shopCurrency,
      shopDescription,
      shopCategory,
      shopCountry,
      shopStreetAddress,
      shopCity,
      shopState,
      shopZipCode,
      shopOwner
    });
      console.log("newShop", newShop)
    res.json({ shopCreated: newShop })
  } catch (error) {
    console.log('Error adding shop:', error)
    res.json({ error: 'Error adding shop' });
  }
};
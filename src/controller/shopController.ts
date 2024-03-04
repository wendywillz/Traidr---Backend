import ShopModel from '../model/shop';
import { Request, Response } from 'express';

export const createNewShop = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shopName, shopDescription, shopCurrency, shopCategory, shopLocation, shopOwner } = req.body;
    const newShop = await ShopModel.create({
        shopName,
        shopCurrency,
      shopDescription,
      shopCategory,
      shopLocation,
      shopOwner
    });
      console.log("newShop", newShop)
    res.json({ shopAdded: newShop })
  } catch (error) {
    console.log('Error adding shop:', error)
    res.json({ error: 'Error adding shop' });
  }
};
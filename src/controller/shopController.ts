import ShopModel from '../model/shop';
import { Request, Response } from 'express';
import User from '../model/user';
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
    const user = await User.findOne({ where: { userId: shopOwner } });
    if (!user) { 
      res.json({ userError: 'User not found' });
    }
    else {
      await user.update({ isSeller: true });
      res.json({ shopCreated: newShop })
    }
      // console.log("newShop", newShop)
    
  } catch (error) {
    console.log('Error adding shop:', error)
    res.json({ error: 'Error adding shop' });
  }
};
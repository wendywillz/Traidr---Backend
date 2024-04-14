import ShopModel from '../model/shop';
import { Request, Response } from 'express';
import User from '../model/user';


export const createNewShop = async (req: Request, res: Response): Promise<void> => {
  try {
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
      await user.update({isSeller: true})
      res.json({ shopCreated: newShop })
    }
      // console.log("newShop", newShop)
    
  } catch (error) {
    console.log('Error adding shop:', error)
    res.json({ error: 'Error adding shop' });
  }
};

export const getShopById = async (req: Request, res: Response): Promise<void> => { 
  try {
    const { shopId } = req.params;
    const shop = await ShopModel.findOne({ where: { shopId } });
    res.json({ shop });
  } catch (error) {
    console.log('Error getting products:', error)
    res.json({ error: 'Error getting products' });
  }
}

export const getShopOwnerByShopId = async(req:Request, res:Response): Promise<void> =>{
  const {shopId} = req.params

  const specifiedShop = await ShopModel.findByPk(shopId)
  if(!specifiedShop){
    console.log(`Shop not found`);
    res.json({error: `Shop not found`})
    return
  }
  const shopOwnerId = specifiedShop?.dataValues.shopOwner

  const shopOwner = await User.findByPk(shopOwnerId, {attributes:[`name`, `email`, `phoneNumber`, `profilePic`]})

  if(!shopOwner){
    console.log(`Shop Owner not Found`);
    res.json({error: `Shop Owner not found`})
    return
  }

  res.json({shopOwner})
}
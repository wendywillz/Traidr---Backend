import { Request, Response } from 'express';
import Product from '../model/product';
import WishList from '../model/wishList';
import WishListItem from '../model/wishListItem';
import { getUserIdFromToken } from '../utils/getModelId';
import { config } from 'dotenv';
config();




export const createNewWishList= async (currentUserId: string)=>{
    const newUserWishList = await WishList.create({
        userId: currentUserId
    })
    return newUserWishList
}

//add to wishList would execute on a post request from the frontend
export const addToWishList = async(req:Request, res:Response)=>{
    // const currentProductId = req.params.productId
    const currentUserId = await getUserIdFromToken(req, res)
    const {currentProductId} = req.body

    const currentProduct = await Product.findByPk(currentProductId)
    if(!currentProduct){
        res.json({message: `Product does not exist`})
        console.log(`Product ${currentProductId} does not exist`);
        return
    }
    
    const productShopId = currentProduct?.shopId

    const existingUserWishList = await WishList.findOne({where:{userId: currentUserId}})
    console.log(existingUserWishList);
        
    
    let userWishListId;
    if(!existingUserWishList){
        const newUserWishList = await createNewWishList(currentUserId)
       userWishListId = newUserWishList.dataValues?.wishListId
       
      await WishListItem.create({
        wishListId: userWishListId,
        userId: currentUserId,
        productId: currentProductId,
        shopId: productShopId
    })
      } else {userWishListId = existingUserWishList?.dataValues?.wishListId }

      

        
    
      console.log(`NEW WISHLIST ITEM`, currentProductId);
     
    const existingWishListItem = await WishListItem.findOne({where:{productId: currentProductId}})

    if(!existingWishListItem){
        try {
             await WishListItem.create({
                wishListId: userWishListId,
                userId: currentUserId,
                productId: currentProductId,
                shopId: productShopId
            })
        } catch (error) {
            res.json({errorMessage: `error creating wishListItem. Reason: ${error}`})
            console.log(`Error creating wishList Item`);
        }
    } else{
        res.json({message: `Item is already in wishlist`})
        console.log(`Item is already in wishlist`);
        return
    }

    res.json({success: `WishListItem created`})
    console.log(`WishList item created`);
}


export const getWishListItems = async(req:Request, res:Response)=>{
    const userId = await getUserIdFromToken(req, res)
      const userWishList = await WishList.findOne({where:{userId:userId}})
      if(!userWishList){
          res.json({message: `WishList Does not exist`})
          return
       }
       const wishListId = userWishList?.dataValues?.wishListId


     const userWishListItems = await WishListItem.findAll({where:{
        wishListId:wishListId,
        userId: userId 
     }})

     const wishListProducts:Product[] =[]
     for(const  item of userWishListItems){
        const  wishListProduct= await Product.findByPk(item.dataValues.productId)
        if(!wishListProduct){continue}
        wishListProducts.push(wishListProduct)
     }

     interface WishListProductDetail{
        productId: string;
        productTitle: string;
        productImage: string;
        productPrice: number;
        productDescription: string;
      //  sourceShop: string;
     }
     let wishListProductDetail:WishListProductDetail = {
         productId: '',
         productTitle: '',
         productImage: '',
         productPrice: 0,
         productDescription: '',
        // sourceShop: ''
     }
     const  wishListProductDetails:WishListProductDetail[]=[]

     for (const  wishListProduct of wishListProducts){
        // let correspondingWishListItem = await WishListItem.findOne({where:{productId:wishListProduct.dataValues.productId}});
        // let correspondingShop = await Shop.findByPk(wishListProduct.dataValues.shopId)
        
        wishListProductDetail = {
            productId: wishListProduct.dataValues.productId,
            productTitle: wishListProduct.dataValues.productTitle,
            productImage: wishListProduct.dataValues.productImages[0],
            productPrice: wishListProduct.dataValues.productPrice,
            productDescription:wishListProduct.dataValues.productDescription,
           // sourceShop: correspondingShop?.dataValues.shopName
 
        }
        wishListProductDetails.push(wishListProductDetail)
     }
    

     res.json({wishListProductDetails})
     
}

export const getWishListCount = async(req:Request, res:Response)=>{
    const userId = await getUserIdFromToken(req, res)
    const userWishList = await WishList.findOne({where:{userId:userId}})
    if(!userWishList){
        res.json({error: `WishList does not exist`})
        console.log(`Wish List not found`);
        return
    }
    const userWishListId = userWishList?.dataValues.wishListId
    const wishListLength = await WishListItem.count({where:{
        userId:userId,
        wishListId: userWishListId
    }})
    if(!wishListLength){
        res.json({error: `WishListItems do not exist`})
        console.log(`WishListItems do not exist`);
        return
    }

    const wishListItemNumber = {
        wishListItemCount:wishListLength 
    }
    res.json({wishListItemNumber})
    


}

export const deleteWishListItem = async(req:Request, res:Response)=>{
    const currentUserId = await getUserIdFromToken(req, res)
    const {productId} = req.body
    
    const selectedWishListItem = await WishListItem.findOne({where:{
        userId: currentUserId,
        productId:productId
    }})
    if(!selectedWishListItem){
        res.json({message:`Item does not exist in wish list`})
    }
    selectedWishListItem?.destroy()
     res.json({success: `Wish List Item deleted`})
 }

export const getWishListProductIds = async(req:Request, res:Response)=>{
    const userId = await getUserIdFromToken(req, res)
      const userWishList = await WishList.findOne({where:{userId:userId}})
      if(!userWishList){
          res.json({message: `WishList Does not exist`})
          return
       }
       const wishListId = userWishList?.dataValues?.wishListId


     const userWishListItems = await WishListItem.findAll({where:{
        wishListId:wishListId,
        userId: userId 
     }, attributes:[`productId`]})


     if(!userWishListItems){
        console.log(`No wish List Items`);
        res.json({message: `No Wish list items`})
        return
     }

     const userWishListItemIds = []

     for(const item of userWishListItems){
        userWishListItemIds.push(item.productId)
     }

     res.json({userWishListItemIds})

}
import { Request, Response } from 'express';
import Product from '../model/product';
import Cart from '../model/cart';
import CartItem from '../model/cartItem';
import ShopModel from '../model/shop';
import User from '../model/user';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
config();
const secret: string = process.env.secret as string;

// const BACKEND_URL = process.env.BACKEND_URL;

const createNewCart = async (currentUserId: string)=>{
    const newUserCart = await Cart.create({
        userId: currentUserId
    })
    return newUserCart
}

//add to cart would execute on a post request from the frontend
export const addToCart = async(req:Request, res:Response)=>{
    // const currentProductId = req.params.productId
    const {currentUserId, currentProductId, productQuantity} = req.body
    let cart;

    const currentProduct = await Product.findByPk(currentProductId)
    if(!currentProduct){
        res.json({message: `Product does not exist`})
    }
    
    const productShopId = currentProduct?.shopId
    const existingUserCart = await Cart.findOne({where:{userId: currentUserId}})
    console.log(existingUserCart);
        
    
    let userCartId;
    if(!existingUserCart){
        const newUserCart = await createNewCart(currentUserId)
       userCartId = newUserCart.dataValues?.cartId
       const newCartItem =
      await CartItem.create({
        cartId: userCartId,
        userId: currentUserId,
        productId: currentProductId,
        productQuantity: productQuantity,
        shopId: productShopId
    })
      } else {userCartId = existingUserCart?.dataValues?.cartId }

      

        
    
      console.log(`NEW CART ITEM`, currentProductId);
     
    const existingCartItem = await CartItem.findOne({where:{productId: currentProductId}})

    if(!existingCartItem){
        try {
            const newCartItem = await CartItem.create({
                cartId: userCartId,
                userId: currentUserId,
                productId: currentProductId,
                productQuantity: productQuantity,
                shopId: productShopId
            })
        } catch (error) {
            res.json({errorMessage: `error creating cartItem. Reason: ${error}`})
        }
    } else{
        await existingCartItem.update({
             productQuantity: productQuantity
        })
    }

    res.json({success: `CartItem created`})
}


//get all cart items per user.
export const getUserCartItems = async(req:Request, res:Response)=>{
    // const cartId = req.params.cartId
    // const userCart = await Cart.findByPk(cartId)
    // if(!userCart){
    //     res.json({message: `Cart Does not exist`})
    //  }
    //  const userId = userCart?.dataValues?.userId

    //Using JWT to get the user
    // const token = req.headers.authorization?.split(' ')[1]
    // let userId;  
    // if (!token) {
    //     res.json({ noTokenError: 'Unauthorized - Token not provided' })
    //   } else {
    //     const decoded = jwt.verify(token, secret) as { userEmail: string }
    //     const user = await User.findOne({
    //       where: { email: decoded.userEmail }
    //     })
    //     userId = user?.dataValues.userId
    //   }
  
    const userId = req.params.userId
      const userCart = await Cart.findOne({where:{userId:userId}})
      if(!userCart){
          res.json({message: `Cart Does not exist`})
       }
       const cartId = userCart?.dataValues?.cartId


     const userCartItems = await CartItem.findAll({where:{
        cartId:cartId,
        userId: userId 
     }})

     let cartProducts:Product[] =[]
     for(let item of userCartItems){
        let cartProduct= await Product.findByPk(item.dataValues.productId)
        if(!cartProduct){continue}
        cartProducts.push(cartProduct)
     }

     interface CartProductDetail{
        productId: string;
        productTitle: string;
        productImage: string;
        productPrice: number;
        productQuantity: number;
        productTotal: number;
        sourceShop: string;
     }
     let cartProductDetail:CartProductDetail = {
         productId: '',
         productTitle: '',
         productImage: '',
         productPrice: 0,
         productQuantity: 0,
         productTotal:0,
         sourceShop: ''
     }
     let cartProductDetails:CartProductDetail[]=[]

     for (let cartProduct of cartProducts){
        let correspondingCartItem = await CartItem.findOne({where:{productId:cartProduct.dataValues.productId}});
        let correspondingShop = await ShopModel.findByPk(cartProduct.dataValues.shopId)
        
        cartProductDetail = {
            productId: cartProduct.dataValues.productId,
            productTitle: cartProduct.dataValues.productTitle,
            productImage: cartProduct.dataValues.productImages[0],
            productPrice: cartProduct.dataValues.productPrice,
            productQuantity: correspondingCartItem?.dataValues?.productQuantity, 
            productTotal: 0,
            sourceShop: correspondingShop?.dataValues.shopName
 
        }
        cartProductDetails.push(cartProductDetail)
     }
     for (cartProductDetail of cartProductDetails){
        cartProductDetail.productTotal = cartProductDetail.productPrice * cartProductDetail.productQuantity
     }

     res.json({cartProductDetails})
     
}

 export const deleteCartItem = async(req:Request, res:Response)=>{
    const {userId, productId} = req.body
    
    const selectedCartItem = await CartItem.findOne({where:{
        userId: userId,
        productId:productId
    }})
    if(!selectedCartItem){
        res.json({message:`Item does not exist in cart`})
    }
     selectedCartItem?.destroy()
     res.json({success: `CartItem deleted`})
 }












/**
  const token = req.headers.authorization?.split(' ')[1]
  let userId;  
  if (!token) {
      res.json({ noTokenError: 'Unauthorized - Token not provided' })
    } else {
      const decoded = jwt.verify(token, secret) as { userEmail: string }
      const user = await User.findOne({
        where: { email: decoded.userEmail }
      })
      userId = user?.dataValues.userId
    }

    const userCart = await Cart.findByPk({where:{userId:userId}})
    if(!userCart){
        res.json({message: `Cart Does not exist`})
     }
     const cartId = userCart?.dataValues?.cartId
 */
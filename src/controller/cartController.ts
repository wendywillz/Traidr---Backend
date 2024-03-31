import { Request, Response } from 'express';
import Product from '../model/product';
import Cart from '../model/cart';
import CartItem from '../model/cartItem';
import ShopModel from '../model/shop';
import User from '../model/user';

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
        productQuantity: productQuantity
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
                 productQuantity: productQuantity
            })
        } catch (error) {
            res.json({errorMessage: `error creating cartItem. Reason: ${error}`})
        }
    } else{
        await existingCartItem.update({
             productQuantity: productQuantity
        })
    }

    res.json({message: `CartItem created`})
}



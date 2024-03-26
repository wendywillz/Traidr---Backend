import { Request, Response } from 'express';
import Product from '../model/product';
import Cart from '../model/cart';
import CartItem from '../model/cartItem';
import ShopModel from '../model/shop';
import dotenv from 'dotenv';
import path from 'node:path';
import fs from 'node:fs';
import User from '../model/user';
import { Op } from 'sequelize';
dotenv.config();

const BACKEND_URL = process.env.BACKEND_URL;

const createNewCart = async (currentUserId: string)=>{
    const newUserCart = await Cart.create({
        userId: currentUserId
    })
    return newUserCart
}

//add to cart would execute on a post request from the frontend
export const addToCart = async(req:Request, res:Response)=>{
    const currentProductId = req.params.id
    const {currentUserId, productQuantity,} = req.body
    
    const currentProduct = await Product.findByPk(currentProductId)
    if(!currentProduct){
        res.json({message: `Product does not exist`})
    }
    const existingUserCart = await Cart.findOne({where:{userId: currentUserId}})

    if(!existingUserCart){
        const newUserCart = await createNewCart(currentUserId)
        const newUserCartId = newUserCart.id
        try {
            const newCartItem = await CartItem.create({
                cartId: newUserCartId,
                userId: currentUserId,
                productId: currentProductId,
                productQuantity: productQuantity
            })
        } catch (error) {
            res.json({errorMessage: `error creating cartItem. Reason: ${error}`})
        }
       
       //If there is no existing Cart, there would automatically not be any existing cart items.
       }

    const existingUserCartId = existingUserCart?.id
    const existingCartItem = await CartItem.findOne({where:{productId: currentProductId}})

    if(!existingCartItem){
        try {
            const newCartItem = await CartItem.create({
                cartId: existingUserCartId,
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

    /* consider another way to get the user id */
}
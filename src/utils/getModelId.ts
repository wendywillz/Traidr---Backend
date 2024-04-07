import Cart from "../model/cart"
import Order from "../model/order"
import User from "../model/user"
import Sale from "../model/sale"
import DeliveryDetail from "../model/deliveryDetail"
import { Request, Response } from "express"
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();
const BACKEND_URL = process.env.BACKEND_URL;
const secret: string = process.env.secret as string;


//SPECIFIC CART ID
export const getSpecificCartId = async(currentUserId:string)=>{
    const userCart = await Cart.findOne({where:{userId:currentUserId}})
  if(!userCart){
    console.log(`CART NOT FOUND`);
    return
  }
  const currentUserCartId = userCart?.cartId
  return currentUserCartId
}

//SPECIFIC ORDER ID
export const getSpecificOrderId = async(currentUserId:string)=>{
    const currentUserCart = await Cart.findOne({
        where:{
          userId: currentUserId
        }
      })
    
      const currentUserCartId = currentUserCart?.dataValues.cartId
    
      const specifiedOrder = await Order.findOne({
        where:{
          userId: currentUserId,
          cartId: currentUserCartId,
        }
      })
      const specifiedOrderId = specifiedOrder?.dataValues.orderId
      return specifiedOrderId
}

//SPECIFIC SALE ID
export const getSpecificSaleId = async(currentUserId:string)=>{
    const currentUserCart = await Cart.findOne({
        where:{
          userId: currentUserId
        }
      })
    
      const currentUserCartId = currentUserCart?.dataValues.cartId
    
      const specifiedOrder = await Order.findOne({
        where:{
          userId: currentUserId,
          cartId: currentUserCartId,
        }
      })
      const specifiedOrderId = specifiedOrder?.dataValues.orderId
    
      const specifiedSale = await Sale.findOne({
        where:{
            userId:currentUserId,
            orderId: specifiedOrderId
        }
    })
  
  const specifiedSaleId = specifiedSale?.dataValues.saleId
  return specifiedSaleId
}

//SPECIFIC DELIVERY DETAILS ID
export const getSpecificDeliveryId = async(currentUserId:string)=>{
    const currentUserCart = await Cart.findOne({
        where:{
          userId: currentUserId
        }
      })
    
      const currentUserCartId = currentUserCart?.dataValues.cartId
    
      const specifiedOrder = await Order.findOne({
        where:{
          userId: currentUserId,
          cartId: currentUserCartId,
        }
      })
      const specifiedOrderId = specifiedOrder?.dataValues.orderId
    
      const specifiedSale = await Sale.findOne({
        where:{
            userId:currentUserId,
            orderId: specifiedOrderId
        }
    })
  
  const specifiedSaleId = specifiedSale?.dataValues.saleId
  
  const specifiedDeliveryDetails = await DeliveryDetail.findOne({
      where:{
          userId: currentUserId,
          orderId: specifiedOrderId,
          saleId: specifiedSaleId
      }
  })

  const specifiedDeliveryDetailsId = specifiedDeliveryDetails?.dataValues.deliveryId
  return specifiedDeliveryDetailsId
}


export const getUserIdFromToken = async(req:Request, res:Response)=>{
    //Using JWT to get the user
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
      const response ={
        userId: userId
      }
    return userId
}
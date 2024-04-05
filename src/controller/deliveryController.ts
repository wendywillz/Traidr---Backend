import { Request, Response } from 'express';

import Order from '../model/order';
import OrderItem from '../model/orderItem';
import User from '../model/user';
import Cart from '../model/cart';
import CartItem from '../model/cartItem';
import Product from '../model/product';
import ShopModel from '../model/shop';
import Sale from '../model/sale';
import DeliveryDetail from '../model/deliveryDetail';

export const createDeliveryDetails = async(req:Request, res:Response)=>{
    const currentUserId = req.params.userId
    console.log(currentUserId);
    const{recipientName, recipientPhoneNumber, deliveryAddress, deliveryInstructions} = req.body

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

const existingDeliveryDetails = await DeliveryDetail.findOne({
    where:{
        userId: currentUserId,
        orderId: specifiedOrderId,
        saleId: specifiedSaleId
    }
})

if (existingDeliveryDetails){
    res.json({message: `Delivery Details already exists`})
    console.log(`Delivery details already exists`);
    return
}
const newDeliveryDetails = await DeliveryDetail.create({
    userId: currentUserId,
    orderId: specifiedOrderId,
    saleId: specifiedSaleId,
    recipientName: recipientName,
    recipientPhoneNumber: recipientPhoneNumber,
    deliveryAddress: deliveryAddress,
    deliveryInstructions: deliveryInstructions, 
    deliveryStatus: "pending"
})

if(newDeliveryDetails){
    res.json({success: `DeliveryDetails created`})
}




    console.log(`Delivery created`);
}


export const updateDelivery = ()=>{
    console.log(`Delivery updated`);
}


export const deletedDelivery = ()=>{
    console.log(`Delivery Deleted`);
}
import { Request, Response } from 'express';

import Order from '../model/order';
import OrderItem from '../model/orderItem';
import Cart from '../model/cart';
import Sale from '../model/sale';
import DeliveryDetail from '../model/deliveryDetail';
import { getUserIdFromToken } from '../utils/getModelId';

export const createDeliveryDetails = async(req:Request, res:Response)=>{
  const currentUserId = await getUserIdFromToken(req, res)
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


export const cancelDeliverySaleAndOrder = async(req:Request, res:Response)=>{
  const currentUserId = await getUserIdFromToken(req, res) 

    const currentUserCart = await Cart.findOne({
      where:{
        userId: currentUserId
      }
    })
    
    if(!currentUserCart){
      res.json({message: `User cart does not exist`})
      console.log(`User cart does not exist`);
      return
    }
    const currentUserCartId = currentUserCart?.dataValues.cartId
  
    const specifiedOrder = await Order.findOne({
      where:{
        userId: currentUserId,
        cartId: currentUserCartId,
      }
    })
    if(!specifiedOrder){
      res.json({message: `Order does not exist`})
      console.log(`Order does not exist`);
      return
    }
    const specifiedOrderId = specifiedOrder?.dataValues.orderId

    const specifiedSale = await Sale.findOne({
        where:{
            userId:currentUserId,
            orderId: specifiedOrderId
        }
    })

    if(!specifiedSale){
        res.json({message: `Sale does not exist`})
        console.log(`Sale does not exist`);
        return
    }
    const specifiedSaleId = specifiedSale.dataValues.saleId

    const specifiedDeliveryDetails = await DeliveryDetail.findOne({
      where:{
        userId:currentUserId,
        orderId: specifiedOrderId,
        saleId: specifiedSaleId,

      }})
    if(!specifiedDeliveryDetails){
      res.json({message: `Delivery details not found`})
      console.log(`Delivery details not found`);
      return
    }
    await specifiedDeliveryDetails.destroy()
    await specifiedSale.destroy()
    await OrderItem.destroy({
      where:{
        userId:currentUserId,
        orderId: specifiedOrderId
      }
    })
    await specifiedOrder.destroy()
    res.json({success: `Delivery, Sale, Order Items and Order all cancelled.`})
  console.log(`Delivery, Sale, Order Items and Order all cancelled.`);
}



export const updateDelivery = ()=>{
    console.log(`Delivery updated`);
}


export const deleteDelivery = ()=>{
    console.log(`Delivery Deleted`);
}
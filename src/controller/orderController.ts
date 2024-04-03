import { Request, Response } from 'express';

import Order from '../model/order';
import OrderItem from '../model/orderItem';
import User from '../model/user';
import Cart from '../model/cart';
import CartItem from '../model/cartItem';
import Product from '../model/product';
 
 
 
 const createNewOrder = async(currentUserId: string, currentUserCartId:string|undefined)=>{
  
  const newOrder = await Order.create({
    userId: currentUserId,
    cartId: currentUserCartId
  })
  return newOrder
 }


 export const addOrderItems = async(req:Request, res:Response)=>{

  const {currentUserId} = req.body
  const userCart = await Cart.findOne({where:{userId:currentUserId}})
  if(!userCart){
    res.json({message: `Cart Does not exist`})
  }
  const currentUserCartId = userCart?.cartId
  if(!currentUserCartId){
    res.json({message: `Cannot find cart with that id`})
  }

const currentCartItems = await CartItem.findAll({
  where:{
    cartId: currentUserCartId,
    userId:currentUserId
  }
})



  const exisitingOrder = await Order.findOne({
    where:{
      userId:currentUserId,
      cartId: currentUserCartId
    }
  })
  if(exisitingOrder){
    res.json({message:`Order Already exists`})
    return
  }


  //creating a new order if it doesn't already exist
const newUserOrder = await createNewOrder(currentUserId, currentUserCartId)

const newOrderId = newUserOrder.dataValues.orderId

for(let item of currentCartItems){
  await OrderItem.create({
    orderId: newOrderId,
    userId:currentUserId,
    productId:item.dataValues.productId,
    productQuantity:item.dataValues.productQuantity
  })
}


res.json({message: `new Order Created`})


 }
 
export const getOrderItems = async(req: Request, res:Response)=>{
  const userId = req.params.userId
  const userOrder = await Order.findOne({where:{userId:userId}})
      if(!userOrder){
          res.json({message: `Order Does not exist`})
       }
       const orderId = userOrder?.dataValues?.orderId

 const userOrderItems = await OrderItem.findAll({
  where:{
    userId: userId,
    orderId: orderId
  }})
  


}


 export const deleteOrder = async(req:Request, res:Response)=>{
  const currentUserId = req.body
  const specificOrder = await Order.findOne({
    where:{
      userId: currentUserId
    }
  })

  if(!specificOrder){
    res.json({message:`Order not found`})
  }

  await specificOrder?.destroy()
 }
 

 
 
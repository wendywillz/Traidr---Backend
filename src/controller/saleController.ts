import { Request, Response } from 'express';

import Order from '../model/order';
import OrderItem from '../model/orderItem';
import User from '../model/user';
import Cart from '../model/cart';
import CartItem from '../model/cartItem';
import Product from '../model/product';
import ShopModel from '../model/shop';
import Sale from '../model/sale';


export const createSale = async(req:Request, res:Response)=>{
    const {currentUserId, saleTotal} = req.body

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

const newSale = await Sale.create({
    userId: currentUserId,
    orderId: specifiedOrderId,
    saleTotal: saleTotal,
    saleStatus: 'pending'
})
res.json({message: `Sale Created`})
    console.log(`Sale created`);
}


export const getSpcifiedSale = async(req:Request, res:Response)=>{
    console.log(`Specified Sale`);
}


export const deleteSale = async(req:Request, res:Response)=>{
    const {currentUserId, saleTotal} = req.body

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

    if(!specifiedSale){
        res.json({message: `Sale does not exist`})
    }

    await specifiedSale?.destroy()
    res.json({message: `Sale Deleted`})

    console.log(`Sale deleted`);
}

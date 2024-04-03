import { Request, Response } from 'express';

import Order from '../model/order';
import OrderItem from '../model/orderItem';
import User from '../model/user';
import Cart from '../model/cart';
import CartItem from '../model/cartItem';
import Product from '../model/product';
import ShopModel from '../model/shop';
 
 
 
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

  let orderProducts:Product[] = []
  for(let item of userOrderItems){
    let orderProduct= await Product.findByPk(item.dataValues.productId)
    if(!orderProduct){continue}
    orderProducts.push(orderProduct)
 }

 interface OrderProductDetail{
  productId: string;
  productTitle: string;
  productImage: string;
  productPrice: number;
  productQuantity: number;
  productTotal: number;
  sourceShop: string;
}
let orderProductDetail:OrderProductDetail = {
   productId: '',
   productTitle: '',
   productImage: '',
   productPrice: 0,
   productQuantity: 0,
   productTotal:0,
   sourceShop: ''
}
let orderProductDetails:OrderProductDetail[]=[]

for (let orderProduct of orderProducts){
  let correspondingCartItem = await CartItem.findOne({where:{productId:orderProduct.dataValues.productId}});
  let correspondingShop = await ShopModel.findByPk(orderProduct.dataValues.shopId)
  
  orderProductDetail = {
      productId: orderProduct.dataValues.productId,
      productTitle: orderProduct.dataValues.productTitle,
      productImage: orderProduct.dataValues.productImages[0],
      productPrice: orderProduct.dataValues.productPrice,
      productQuantity: correspondingCartItem?.dataValues?.productQuantity, 
      productTotal: 0,
      sourceShop: correspondingShop?.dataValues.shopName

  }
  orderProductDetails.push(orderProductDetail)
}
for (orderProductDetail of orderProductDetails){
  orderProductDetail.productTotal = orderProductDetail.productPrice * orderProductDetail.productQuantity
}

res.json({orderProductDetails})



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
 

 
 
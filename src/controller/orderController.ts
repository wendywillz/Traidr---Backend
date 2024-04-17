import { Request, Response } from 'express';

import Order from '../model/order';
import OrderItem from '../model/orderItem';
import Cart from '../model/cart';
import CartItem from '../model/cartItem';
import Product from '../model/product';
import ShopModel from '../model/shop';
import { getUserIdFromToken } from '../utils/getModelId';
 
 
 
 const createNewOrder = async(currentUserId: string, currentUserCartId:string|undefined)=>{
  
  const newOrder = await Order.create({
    userId: currentUserId,
    cartId: currentUserCartId
  })
  return newOrder
 }


 export const addOrderItems = async(req:Request, res:Response)=>{

  const currentUserId = await getUserIdFromToken(req, res)
  const userCart = await Cart.findOne({where:{userId:currentUserId}})
  if(!userCart){
    res.json({error: `Cart Does not exist`})
  }
  const currentUserCartId = userCart?.cartId
  if(!currentUserCartId){
    res.json({error: `Cannot find cart with that id`})
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

for(const item of currentCartItems){
  await OrderItem.create({
    orderId: newOrderId,
    userId:currentUserId,
    productId:item.dataValues.productId,
    productQuantity:item.dataValues.productQuantity,
    shopId: item.dataValues.shopId
  })
}


res.json({success: `new Order Created`})


 }
 
export const getOrderItems = async(req: Request, res:Response)=>{
  const currentUserId = await getUserIdFromToken(req, res)

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

 const userOrderItems = await OrderItem.findAll({
  where:{
    userId: currentUserId,
    orderId: specifiedOrderId, 
  }})

  const orderProducts:Product[] = []
  for(const item of userOrderItems){
    const orderProduct= await Product.findByPk(item.dataValues.productId)
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
const orderProductDetails:OrderProductDetail[]=[]

for (const orderProduct of orderProducts){
  const correspondingCartItem = await CartItem.findOne({where:{productId:orderProduct.dataValues.productId}});
  const correspondingShop = await ShopModel.findByPk(orderProduct.dataValues.shopId)
  
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
//updating the total price of each product in the order
for (orderProductDetail of orderProductDetails){
  orderProductDetail.productTotal = orderProductDetail.productPrice * orderProductDetail.productQuantity
}

res.json({orderProductDetails})



}


 export const cancelOrder = async(req:Request, res:Response)=>{
  const currentUserId = await getUserIdFromToken(req, res)

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

  if(!specifiedOrder){
    res.json({message:`Order not found`})
  }
  const specifiedOrderId = specifiedOrder?.dataValues.orderId

  console.log(`THE ORDER ID IS:`, specifiedOrderId);
  await OrderItem.destroy({
    where:{
      userId: currentUserId,
      orderId: specifiedOrderId,
    }})
    
    console.log(`All Order Items from order ${specifiedOrderId} have been deleted`);
  
    await specifiedOrder?.destroy()
    res.json({success: `Order and order items have been deleted`})
    console.log(`Order and order items have been deleted`);
 }
 



 
 
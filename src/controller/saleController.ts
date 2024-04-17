import { Request, Response } from 'express';

import Order from '../model/order';
import OrderItem from '../model/orderItem';
import Cart from '../model/cart';

import Product from '../model/product';
import ShopModel from '../model/shop';
import Sale from '../model/sale';
import DeliveryDetail from '../model/deliveryDetail';
import { getUserIdFromToken } from '../utils/getModelId';
import { Op } from 'sequelize';
import CartItem from '../model/cartItem';


export const createSale = async(req:Request, res:Response)=>{
  const currentUserId:string = await getUserIdFromToken(req, res)  
  const {saleTotal} = req.body

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
if(specifiedSale){
    res.json({message: `Sale already exists`})
    console.log(`Sale already exists`);
    return
}

await Sale.create({
    userId: currentUserId,
    orderId: specifiedOrderId,
    saleTotal: saleTotal,
    saleStatus: 'pending'
})
res.json({message: `Sale Created`})
    console.log(`Sale created`);
}


export const getSaleReceipt = async(req:Request, res:Response)=>{
  const currentUserId = await getUserIdFromToken(req, res)
  const fiveMinsAgo = new Date(Date.now() - (5 * 60* 1000))
  

    const specifiedSale = await Sale.findOne({
      where:{
        userId: currentUserId,
        saleStatus: 'completed',
        createdAt:{
          [Op.gte]: fiveMinsAgo
        }
        
      }
    })
    if(!specifiedSale){
      res.json({message: `specifed sale does unavialable`})
      console.log(`specified sale not available`);
      return
    }
    const specifiedSaleId = specifiedSale.dataValues.saleId
    const specifiedOrderId = specifiedSale?.dataValues.orderId

    const specifiedDeliveryDetails = await DeliveryDetail.findOne({where:{
        userId: currentUserId,
        orderId: specifiedOrderId,
        saleId: specifiedSaleId,
}})

    if(!specifiedDeliveryDetails){
      res.json({message: `no delivery details`})
      return
    }

    const userOrderedItems = await OrderItem.findAll({
      where:{
        userId: currentUserId,
        orderId: specifiedOrderId, 
      }})

      
      const orderedProducts:Product[] = []

  for(const item of userOrderedItems){
    const orderedProduct= await Product.findByPk(item.dataValues.productId)
    if(!orderedProduct){continue}
    orderedProducts.push(orderedProduct)
 }


 interface OrderedProductDetail{
  productId: string;
  productTitle: string;
  productImage: string;
  productPrice: number;
  productQuantity: number;
  productTotal: number;
  sourceShop: string;
}
let orderedProductDetail:OrderedProductDetail = {
   productId: '',
   productTitle: '',
   productImage: '',
   productPrice: 0,
   productQuantity: 0,
   productTotal:0,
   sourceShop: ''
}
const orderedProductDetails:OrderedProductDetail[]=[]



 for (const orderedProduct of orderedProducts){
  const correspondingOrderItem = await OrderItem.findOne({
    where:{
        userId: currentUserId,
        orderId: specifiedOrderId,
        productId: orderedProduct.dataValues.productId
    }})
  const correspondingShop = await ShopModel.findByPk(orderedProduct.dataValues.shopId)
  orderedProductDetail = {
    productId: orderedProduct.dataValues.productId,
    productTitle: orderedProduct.dataValues.productTitle,
    productImage: orderedProduct.dataValues.productImages[0],
    productPrice: orderedProduct.dataValues.productPrice,
    productQuantity: correspondingOrderItem?.dataValues?.productQuantity, 
    productTotal: 0,
    sourceShop: correspondingShop?.dataValues.shopName
}
  orderedProductDetails.push(orderedProductDetail)
 }

 //updating the quantity
 for (orderedProductDetail of orderedProductDetails){
  orderedProductDetail.productTotal = orderedProductDetail.productPrice * orderedProductDetail.productQuantity
}





interface ResponseData{
  saleId: string;
  saleTotal: number;
  saleDate: string;
  orderedProducts: OrderedProductDetail[];
  recipientName: string;
  recipientPhoneNumber: number;
  deliveryAddress: string;
  deliveryInstructions: string;
}

const responseData: ResponseData ={
  saleId: specifiedSale.id,
  saleTotal: specifiedSale.saleTotal,
  saleDate: specifiedSale.dataValues.createdAt.toDateString(),
  orderedProducts: orderedProductDetails,
  recipientName: specifiedDeliveryDetails.recipientName,
  recipientPhoneNumber: specifiedDeliveryDetails.recipientPhoneNumber,
  deliveryAddress: specifiedDeliveryDetails.deliveryAddress,
  deliveryInstructions: specifiedDeliveryDetails.deliveryInstructions
}

res.json({responseData})

    console.log(`Specified Sale returned`);
}


export const getSaleSummaryById = async (req:Request, res:Response)=>{
  const currentUserId = await getUserIdFromToken(req, res)
 
 const specifiedSaleId = req.params.saleId

 const specifiedSale = await Sale.findByPk(specifiedSaleId)
 if(!specifiedSale){
   res.json({message: `specifed sale does unavialable`})
   console.log(`specified sale not available`);
   return
 }
 const specifiedOrderId = specifiedSale?.dataValues.orderId

 const specifiedDeliveryDetails = await DeliveryDetail.findOne({where:{
     userId: currentUserId,
     orderId: specifiedOrderId,
     saleId: specifiedSaleId,
}})

 if(!specifiedDeliveryDetails){
   res.json({message: `no delivery details`})
   return
 }

 const userOrderedItems = await OrderItem.findAll({
   where:{
     userId: currentUserId,
     orderId: specifiedOrderId, 
   }})

   
   const orderedProducts:Product[] = []

for(const item of userOrderedItems){
 const orderedProduct= await Product.findByPk(item.dataValues.productId)
 if(!orderedProduct){continue}
 orderedProducts.push(orderedProduct)
}


interface OrderedProductDetail{
productId: string;
productTitle: string;
productImage: string;
productPrice: number;
productQuantity: number;
productTotal: number;
sourceShop: string;
}
let orderedProductDetail:OrderedProductDetail = {
productId: '',
productTitle: '',
productImage: '',
productPrice: 0,
productQuantity: 0,
productTotal:0,
sourceShop: ''
}
const orderedProductDetails:OrderedProductDetail[]=[]


for (const orderedProduct of orderedProducts){
const correspondingOrderItem = await OrderItem.findOne({
 where:{
     userId: currentUserId,
     orderId: specifiedOrderId,
     productId: orderedProduct.dataValues.productId
 }})
const correspondingShop = await ShopModel.findByPk(orderedProduct.dataValues.shopId)
orderedProductDetail = {
 productId: orderedProduct.dataValues.productId,
 productTitle: orderedProduct.dataValues.productTitle,
 productImage: orderedProduct.dataValues.productImages[0],
 productPrice: orderedProduct.dataValues.productPrice,
 productQuantity: correspondingOrderItem?.dataValues?.productQuantity, 
 productTotal: 0,
 sourceShop: correspondingShop?.dataValues.shopName
}
orderedProductDetails.push(orderedProductDetail)
}

//updating the quantity
for (orderedProductDetail of orderedProductDetails){
orderedProductDetail.productTotal = orderedProductDetail.productPrice * orderedProductDetail.productQuantity
}

interface ResponseData{
saleId: string;
saleTotal: number;
saleDate: string;
orderedProducts: OrderedProductDetail[];
recipientName: string;
recipientPhoneNumber: number;
deliveryAddress: string;
deliveryInstructions: string;
}

const responseData: ResponseData ={
saleId: specifiedSale.id,
saleTotal: specifiedSale.saleTotal,
saleDate: specifiedSale.dataValues.createdAt.toDateString(),
orderedProducts: orderedProductDetails,
recipientName: specifiedDeliveryDetails.recipientName,
recipientPhoneNumber: specifiedDeliveryDetails.recipientPhoneNumber,
deliveryAddress: specifiedDeliveryDetails.deliveryAddress,
deliveryInstructions: specifiedDeliveryDetails.deliveryInstructions
}

res.json({responseData})



 console.log(`Specified Sale Summary returned`);
}


export const getAllOrderHistories = async(req:Request, res:Response)=>{
 const currentUserId:string = await getUserIdFromToken(req, res)
 const allPreviousOrders = await Sale.findAll({
   where:{
     userId: currentUserId,
     saleStatus : 'completed'
   }})

 if(!allPreviousOrders) {
   res.json({message: `no previous orders found`})
   console.log(`No previous orders found`);
   return
 }

 const previousOrders = allPreviousOrders.sort((a, b)=>{return b.dataValues.updatedAt - a.dataValues.updatedAt})
 
 res.json({previousOrders})
 console.log(`All previous orders sent`);
}



export const completeSaleAndClearCart = async(req:Request, res:Response)=>{
  //Your goal here is to update the saleStatus field in the sale table from pending to completed
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
    
   specifiedSale.update({
    saleStatus: 'completed'
   })

   specifiedOrder.update({
    cartId:null
   })
    await CartItem.destroy({
      where:{
        userId:currentUserId,
        cartId: currentUserCartId
        
      }
    })
    await currentUserCart.destroy()
    res.json({success: `Sale completed and cart Items and cart deleted`})
  console.log(`Sale completed and cart cleared`);
}


export const cancelSaleAndOrder = async(req:Request, res:Response)=>{
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



//Deleting Sales and them orderItems and then Order
     await Sale.destroy({
        where:{
            userId:currentUserId,
            orderId: specifiedOrderId
        }
    })


    console.log(`Sale deleted`);

    await OrderItem.destroy({
        where:{
          userId: currentUserId,
          orderId: specifiedOrderId,
        }})

    console.log(`Sale and order items deleted`);

    await specifiedOrder?.destroy()
    res.json({message: `Sale, orderItems and Order all deleted`})
    console.log(`Sale, order items and order deleted `);
}


export const deleteSale = async(req:Request, res:Response)=>{
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
    const specifiedSale = await Sale.findOne({
        where:{
            userId:currentUserId,
            orderId: specifiedOrderId
        }
    })

    if(!specifiedSale){
        res.json({message: `Sale does not exist`})
        return
    }

    await specifiedSale?.destroy()
    res.json({message: `Sale Deleted`})

    console.log(`Sale deleted`);
}

export const getSaleTotal = async(req:Request, res: Response)=>{
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
    const specifiedSale = await Sale.findOne({
        where:{
            userId:currentUserId,
            orderId: specifiedOrderId
        }
    })

    const orderTotal = specifiedSale?.saleTotal

    const responseData = {
      saleTotal: orderTotal
    }

    res.json({responseData})
}

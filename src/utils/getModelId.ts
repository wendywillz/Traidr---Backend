import Cart from "../model/cart"
import Order from "../model/order"
import User from "../model/user"
import Sale from "../model/sale"
import DeliveryDetail from "../model/deliveryDetail"


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
import { Request, Response } from 'express';

import Order from '../model/order';
import OrderItem from '../model/orderItem';
import User from '../model/user';
import Cart from '../model/cart';
import CartItem from '../model/cartItem';
import Product from '../model/product';
import ShopModel from '../model/shop';


export const createSale = async(req:Request, res:Response)=>{
    const {currentUserId} = req.body

    const userOrder = await Order.findOne({
        where:{
            userId: currentUserId
        }
    })



    console.log(`Sale created`);
}



export const getSpcifiedSale = async(req:Request, res:Response)=>{
    console.log(`Specified Sale`);
}


export const deleteSale = async(req:Request, res:Response)=>{
    console.log(`Sale deleted`);
}

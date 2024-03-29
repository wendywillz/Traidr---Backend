import { Request, Response } from 'express';
import ShopModel from '../model/shop';
import User from '../model/user';
//import Order from '../model/order'
 
 
 
 
// Define interface for an order
interface Order {
  id: number;
  userId: string;
  shopId: string;
}
// Sample data representing orders completed by vendors
const orders: Order[] = [
  { id: 1, userId: 'Vendor A', shopId: '123', },
  { id: 2, userId: 'Vendor B', shopId: '124', },
  { id: 3, userId: 'Vendor A', shopId: '125' },
  // Add more orders as needed
];
export const completedOrdersByUser = async (req: Request, res: Response): Promise<void> => {
    try {
      // Group orders by user and filter completed orders
    const completedOrdersByUser: { [user: string]: Order[] } = {};
      orders.forEach(order => {
        if (order.userId) {
          if (!completedOrdersByUser[order.userId]) {
            completedOrdersByUser[order.userId] = [];
          }
          completedOrdersByUser[order.userId].push(order);
        }
      });
      res.json(completedOrdersByUser);
      
      const user = await User.findOne({ where: { userId } });
    if (!user) {
       res.status(404).json({ error: 'User not found' });
    }
    const { shopId } = req.params;
    const shop = await ShopModel.findOne({ where: { shopId } });
    res.json({ shop });
    } catch (error) {
        console.error('Error fetching completed orders by user:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    };
    
 
 
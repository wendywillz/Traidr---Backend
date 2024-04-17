import { Op } from "sequelize";
import User from "../model/user";
import ShopModel from '../model/shop';
import { Request, Response } from 'express';
import UserActivity from "../model/userActivity";
import Sale from "../model/sale";
import jwt from 'jsonwebtoken';
import LastActive from "../model/lastActive";
import OrderItem from "../model/orderItem";
import Product from "../model/product";
//import { all } from "axios";

const secret = process.env.secret!
export const getAllUsersGender = async (req: Request, res: Response): Promise<void> =>{
    const maleTotal = await User.count({where:{gender:`male`}})
    const femaleTotal = await User.count({where:{gender:`female`}})
    
    res.json({
        totalMaleCount: maleTotal,
        totalFemaleCount: femaleTotal
    })
}

export const getAverageUsageTimeForAllUser = async (req: Request, res: Response) => { 
 try {
    function getStartAndEndOfWeek(date: Date) {
 const day = date.getDay();
 const startOfWeek = new Date(date);
 startOfWeek.setDate(date.getDate() - day);
 const endOfWeek = new Date(date);
 endOfWeek.setDate(date.getDate() + (6 - day));
 return { startOfWeek, endOfWeek };
    }

    const currentDate = new Date();
    const { startOfWeek, endOfWeek } = getStartAndEndOfWeek(currentDate);
    const userActivities = await UserActivity.findAll({
 where: {
    date: {
      [Op.between]: [startOfWeek.toISOString().split('T')[0], endOfWeek.toISOString().split('T')[0]]
    }
 }
});

const dailyUsage: Record<string, number> = {};
userActivities.forEach(activity => {
 const date = new Date(activity.date).toLocaleDateString('en-US', { weekday: 'long' });
 if (!dailyUsage[date]) {
    dailyUsage[date] = 0;
 }
 dailyUsage[date] += activity.activeDuration;
});

// Calculate average usage time
const averageDailyUsage: Record<string, number> = {};
Object.keys(dailyUsage).forEach(day => {
 const totalUsers = userActivities.length;
 averageDailyUsage[day] = dailyUsage[day] / totalUsers;
});

// Sort the days of the week
const sortedDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const sortedAverageDailyUsage: Record<string, number> = {};
sortedDays.forEach(day => {
 if (averageDailyUsage[day]) {
    sortedAverageDailyUsage[day] = averageDailyUsage[day];
 }
 else {
      sortedAverageDailyUsage[day] = 0;
   }
    
});
res.json({ sortedAverageDailyUsage });

 } catch (error) {
    res.json({ error: 'An error occurred while fetching the data.' });
 }
}

export const calculateAverageUsageTimeForAllUser = async (req: Request, res: Response) => { 
  const { userId, activeDuration } = req.body;
  try {
    const todayDate = Date.now()

    const getDate = new Date(todayDate).toLocaleDateString()
    
   const findExistingDuration = await UserActivity.findOne({where:{userId, date:getDate}})
    if (findExistingDuration) { 
      const updateActivity = await UserActivity.update({
        activeDuration: parseInt(activeDuration) + findExistingDuration.activeDuration
      }, {where: {userId, date:getDate}})
      if (!updateActivity) {
        res.json({ error: 'An error occurred while updating the active period.' });
      }
      res.json({ success: 'active period updated successfully' });
    }
    else {
      const createActivity = await UserActivity.create({
        userId,
        date: getDate,
        activeDuration: parseInt(activeDuration)
      })
     if (!createActivity) {
       res.json({ error: 'An error occurred while creating the active period.' }); 
     }
     res.json({ success: 'active period created successfully' });
    }
   
  } catch (error) {
    res.json({ internalServerError: 'internal sever error' });
 }
}

export async function checkAndVerifyAdminToken(req: Request, res: Response): Promise<void> {
  try {
    
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
    
      res.json({ noTokenError: 'Unauthorized - Token not provided' })
    } else {
        
      const decoded = jwt.verify(token, secret) as { userEmail: string }
      const user = await User.findOne({where:{email:decoded.userEmail, isAdmin:true}})
        if (!user) {
            res.json({ unauthorized: "unauthorized" })
            return 
        }
      console.log(" user", user.dataValues)
      const userDetail = {
        userId: user?.dataValues.userId,
        name: user?.dataValues.name,
        email: user?.dataValues.email,
        isAdmin: user?.dataValues.isAdmin,
        isSeller: user?.dataValues.isSeller,
        isVerified: user?.dataValues.isVerified,
        gender: user?.dataValues.gender,
        age: user?.dataValues.age,
        address: user?.dataValues.address,
        phoneNumber: user?.dataValues.phoneNumber,
        shopName: user?.dataValues.shopName,
        dateOfBirth: user?.dataValues.dateOfBirth,
        profilePic: user?.dataValues.profilePic 
      }
       res.json({ userDetail }) 
      

      
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error instanceof jwt.TokenExpiredError) {
        res.json({ error: 'Unauthorized - Token has expired' });
      } else if (error instanceof jwt.JsonWebTokenError) {
        res.json({ error: 'Unauthorized - Token verification failed' });
      } else {
        res.json({ error: 'Internal server error' });
      }
  }
}

export const updateLastActiveAt = async (req: Request, res: Response) => {
 try {
     const { userId } = req.body;
     
     const checkIfUserHasRecord = await LastActive.findOne({ where: { userId } })
     if (checkIfUserHasRecord) {
        await LastActive.update({
            lastActiveAt: new Date()
     }, { where: { userId } })
   
         res.json({ success: 'Last active time updated successfully' });
         return
        
     }
     const createRecord = await LastActive.create({
             userId,
             lastActiveAt: new Date()
         })
         if (createRecord) {
             res.json({ success: "record created successfully" })
         }
   
 } catch (error) {
    res.json({internalServerError: 'internalServerError'})
 }
};

export const getDailyActiveUser = async (req: Request, res: Response) => {
    try {
   function getStartAndEndOfWeek(date: Date) {
 const day = date.getDay();
 const startOfWeek = new Date(date);
 startOfWeek.setDate(date.getDate() - day);
 const endOfWeek = new Date(date);
 endOfWeek.setDate(date.getDate() + (6 - day));
 return { startOfWeek, endOfWeek };
    }
const currentDate = new Date();
const { startOfWeek, endOfWeek } = getStartAndEndOfWeek(currentDate);
const userActivities = await LastActive.findAll({
 where: {
    lastActiveAt: {
      [Op.between]: [startOfWeek.toISOString().split('T')[0], endOfWeek.toISOString().split('T')[0]]
    }
 }
});
   const dailyActiveUsers:Record<string, number> = {};

userActivities.forEach(activity => {
 const date = new Date(activity.lastActiveAt).toLocaleDateString('en-US', { weekday: 'long' });
 if (!dailyActiveUsers[date]) {
    dailyActiveUsers[date] = 1; 
 } else {
    dailyActiveUsers[date]++; 
 }
});
// Sort the days of the week
const sortedDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const sortedDailyActiveUser: Record<string, number> = {};
sortedDays.forEach(day => {
 if (dailyActiveUsers[day]) {
    sortedDailyActiveUser[day] = dailyActiveUsers[day];
 }
 else {
      sortedDailyActiveUser[day] = 0;
   }
    
});
res.json({ sortedDailyActiveUser });
      
  } catch (error) {

    res.status(500).json({ error: 'An error occurred while fetching data.' });
 }
}


export const getMonthlyActiveUser = async (req: Request, res: Response) => {
    try {
        function getStartAndEndOfMonth(date: Date) {
            const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
            const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            return { startOfMonth, endOfMonth };
        }

        const currentDate = new Date();
        const { startOfMonth, endOfMonth } = getStartAndEndOfMonth(currentDate);
        const userActivities = await LastActive.findAll({
            where: {
                lastActiveAt: {
                    [Op.between]: [startOfMonth.toISOString().split('T')[0], endOfMonth.toISOString().split('T')[0]]
                }
            }
        });

        const monthlyActiveUsers: Record<string, number> = {};

        userActivities.forEach(activity => {
            const date = new Date(activity.lastActiveAt).toLocaleDateString('en-US', { month: 'long' });
            if (!monthlyActiveUsers[date]) {
                monthlyActiveUsers[date] = 1;
            } else {
                monthlyActiveUsers[date]++;
            }
        });

        // Define the order of months
        const sortedMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        // Sort the monthlyActiveUsers object based on the sortedMonths array
        const sortedMonthlyActiveUsers: Record<string, number> = {};
        sortedMonths.forEach(month => {
            if (monthlyActiveUsers[month]) {
                sortedMonthlyActiveUsers[month] = monthlyActiveUsers[month];
            } else {
                sortedMonthlyActiveUsers[month] = 0; // Include months with no activity
            }
        });

        res.json({ sortedMonthlyActiveUsers });

    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching data.' });
    }
}


export const getUserDemographicsByAge = async (req: Request, res: Response): Promise<void> => {
  try {
    // Define age ranges
    const ageRanges = [
      { min: 0, max: 17 },
      { min: 18, max: 24 },
      { min: 25, max: 33 },
      { min: 34, max: 44 },
      { min: 45, max: Number.MAX_SAFE_INTEGER } // Set a very large number as maximum for 45 & above
    ];

    // Fetch users from the database
    const users = await User.findAll();

    // Initialize demographics report with zero counts for each age range
    const demographicsReport = ageRanges.map(range => ({
      ageRange: `${range.min}-${range.max === Number.MAX_SAFE_INTEGER ? 'above' : range.max}`,
      count: 0
    }));

    // Count users in each age range
    users.forEach(user => {
      const age = parseInt(user.getDataValue('age')); // Adjust here
      if (!isNaN(age)) {
        const calculatedAge = Math.trunc((Date.now() - age) / 31557600000); // Adjust here
        for (const range of ageRanges) {
          if (calculatedAge >= range.min && calculatedAge <= range.max) {
            const index = ageRanges.indexOf(range);
            demographicsReport[index].count++;
            break; // No need to check further ranges
          }
        }
      }
    });

    res.json({ demographicsReport });
  } catch (error) {
    console.error('Error fetching user demographics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



export const getAdminDashboardSummary = async(req: Request, res: Response):Promise<void>=>{
  
  const allSales = await Sale.findAll() //{attributes:[`saleTotal`]}
  const allOrderItems = await OrderItem.findAll()
  const totalCompletedOrders =  await Sale.count()
  const totalSellers = await User.count({where:{isSeller: true}})
  const totalSalesIncome = allSales.reduce(
    (acc, curr)=> acc + curr.saleTotal,
    0
  )
  const totalItemsSold = allOrderItems.reduce((acc, curr)=> acc + curr.productQuantity,0)
  

  const adminDataSummary = {
    totalOrders: totalCompletedOrders,
    totalTenants:totalSellers,
    totalRevenue: totalSalesIncome,
    totalProductSold: totalItemsSold
  }
  res.json({adminDataSummary})

}


export const getProductRevenue = async(req:Request, res:Response):Promise<void>=>{
const allSales = await Sale.findAll({where:{saleStatus: 'completed'}})
if(!allSales){
  res.json({message: `No Completed Sales Found`})
  return
}

const allPurchasedItems = await OrderItem.findAll()
if(!allPurchasedItems){
  res.json({message: `No Completed orders Found`})
  return
}

interface ProductSalesDetails{
  productId: string;
  totalQuantitySold: number
}
let
 productSalesDetail:ProductSalesDetails = {
  productId: allPurchasedItems[0].productId,
  totalQuantitySold:allPurchasedItems[0].productQuantity,
}

const productSalesDetails: ProductSalesDetails[] = []
for(const item of allPurchasedItems){
  const existingItem = productSalesDetails.find((currentItem)=>{return currentItem.productId == item.productId})

  if(!existingItem){
     productSalesDetail ={
      productId: item.productId,
      totalQuantitySold: item.productQuantity
    }
    productSalesDetails.push(productSalesDetail)
  } else{
    existingItem.totalQuantitySold +=item.productQuantity
    }
  }

interface ProductNameSales{
  productName: string|undefined;
  totalQuantitySold: number;
  totalAmountMade:number;
}

let productNameSale:ProductNameSales ={
  productName: "",
  totalQuantitySold:0,
  totalAmountMade: 0
}
const productNameSales:ProductNameSales[] = []

for(const product of productSalesDetails){
   const correspondingProduct =  await Product.findByPk(product.productId)
   if(!correspondingProduct){
    res.json({message: `correspoinding product not found`})
    return
   }
  const correspondingProductName = correspondingProduct?.productTitle
  const amountMade = correspondingProduct?.productPrice * product.totalQuantitySold

  productNameSale = {
    productName: correspondingProductName,
    totalQuantitySold: product.totalQuantitySold,
    totalAmountMade: amountMade
  }

  productNameSales.push(productNameSale)
}

const sortedProductNameSales = productNameSales.sort((a, b)=>{ return b.totalAmountMade - a.totalAmountMade})

res.json({sortedProductNameSales})



}

export const getTenantRevenue = async(req: Request, res: Response):Promise<void>=>{
const allSales = await Sale.findAll({where:{saleStatus: 'completed'}})
if(!allSales){
  res.json({message: `No Completed Sales Found`})
  return
}

const allPurchasedItems = await OrderItem.findAll()
if(!allPurchasedItems){
  res.json({message: `No Completed orders Found`})
  return
}

interface ProductSalesDetails{
  productId: string;
  shopId:string;
  totalQuantitySold: number
}
let
 productSalesDetail:ProductSalesDetails = {
  productId: allPurchasedItems[0].productId,
  shopId: allPurchasedItems[0].shopId,
  totalQuantitySold:allPurchasedItems[0].productQuantity,
}

const productSalesDetails: ProductSalesDetails[] = []
for(const item of allPurchasedItems){
  const existingItem = productSalesDetails.find((currentItem)=>{return currentItem.productId == item.productId})

  if(!existingItem){
     productSalesDetail ={
      productId: item.productId,
      shopId: item.shopId,
      totalQuantitySold: item.productQuantity
    }
    productSalesDetails.push(productSalesDetail)
  } else{
    existingItem.totalQuantitySold +=item.productQuantity
    }
  }

interface ProductNameSales{
  productName: string|undefined;
  shopName:string|undefined
  totalQuantitySold: number;
  totalAmountMade:number;
}

let productNameSale:ProductNameSales ={
  productName: "",
  shopName:"",
  totalQuantitySold:0,
  totalAmountMade: 0
}
const productNameSales:ProductNameSales[] = []

for(const product of productSalesDetails){
   const correspondingProduct =  await Product.findByPk(product.productId)
   const correspondingShop = await ShopModel.findByPk(product.shopId)
   if(!correspondingProduct || !correspondingShop){
    res.json({message: `correspoinding product and shop not found`})
    return
   }
  const correspondingProductName = correspondingProduct?.productTitle
  const correspondingShopName = correspondingShop?.shopName
  
  const amountMade = correspondingProduct?.productPrice * product.totalQuantitySold

  productNameSale = {
    productName: correspondingProductName,
    shopName: correspondingShopName,
    totalQuantitySold: product.totalQuantitySold,
    totalAmountMade: amountMade
  }

  productNameSales.push(productNameSale)
}


const sortedDetails = productNameSales.sort((a,b)=>{ return b.totalAmountMade - a.totalAmountMade})

interface TenantSalesDetails{
  tenantName: string|undefined
  totalItemsSold: number;
  totalRevenue: number;
}

let tenantSalesDetails:TenantSalesDetails = {
  tenantName: sortedDetails[0].shopName,
  totalItemsSold: sortedDetails[0].totalQuantitySold,
  totalRevenue: sortedDetails[0].totalAmountMade
}
const allTenantSalesDetails:TenantSalesDetails[] = []


for(const details of sortedDetails){
  const existingDetails = allTenantSalesDetails.find((currentdetails)=>{return currentdetails.tenantName == details.shopName})

  if(!existingDetails){
     tenantSalesDetails ={
      tenantName: details.shopName,
      totalItemsSold: details.totalQuantitySold,
      totalRevenue: details.totalAmountMade
    }
    allTenantSalesDetails.push(tenantSalesDetails)
  } else{
    existingDetails.totalItemsSold += details.totalQuantitySold
    existingDetails.totalRevenue += details.totalAmountMade
    }
  }


  res.json({allTenantSalesDetails})

}



/////////////////////////////////////////////////////////////////////////////////////////
export const getTenantDetails = async(req: Request, res: Response)=>{
  
  const tenantDetails = await User.findAll({
     where: { isSeller: true },
      attributes: ['userId', 'name', 'gender', 'age', 'shopName', 'updatedAt'], // Specify the fields you want from the 
    })
   
    const tenantsShopDetails = []
   
    for (const tenant of tenantDetails){
     const tenantShop = await ShopModel.findOne({where:{shopOwner: tenant.dataValues.userId}})
     if(!tenantShop) continue

     const tenantShopDetail = {
       userId: tenant.userId,
       name: tenant.name,
       gender:tenant.gender,
       age: tenant.age,
       shopName:tenantShop.shopName,
       shopCreatedAt: new Date(tenantShop.dataValues.createdAt).toDateString()
     }
     tenantsShopDetails.push(tenantShopDetail)
     
    }
    res.json({tenantsShopDetails})


}








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
      const { userId } =  req.body
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
    
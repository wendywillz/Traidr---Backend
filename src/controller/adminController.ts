import { Op } from "sequelize";
import User from "../model/user";
import { Request, Response } from 'express';
import UserActivity from "../model/userActivity";
import jwt from 'jsonwebtoken';

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
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const dailyUsage:Record<string, any> = {};

userActivities.forEach(activity => {
 const date = new Date(activity.date).toLocaleDateString('en-US', { weekday: 'long' });
 if (!dailyUsage[date]) {
    dailyUsage[date] = 0;
 }
 dailyUsage[date] += activity.activeDuration;
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const averageDailyUsage:Record<string, any>  = {};
Object.keys(dailyUsage).forEach(day => {
 const totalUsers = userActivities.length;
 averageDailyUsage[day] = dailyUsage[day] / totalUsers;
});

console.log(averageDailyUsage);
res.json({ averageDailyUsage });

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
    console.log("error", error)
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
      const checkIfIsAdmin = await User.findOne({where:{email:decoded.userEmail, isAdmin:true}})
        if (!checkIfIsAdmin) {
            console.log("not admin")
            res.json({ unauthorized: "unauthorized" })
            return 
        }
        console.log("admin")
       res.json({ success: 'Authorized' }) 
      

      
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      res.json({ tokenExpiredError: 'Unauthorized - Token has expired' })
    } else {
      res.json({ verificationError: 'Unauthorized - Token verification failed' })
    }
  }
}

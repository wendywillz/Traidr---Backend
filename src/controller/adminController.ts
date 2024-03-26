import User from "../model/user";
import { Request, Response } from 'express';

export const getAllUsersGender = async (req: Request, res: Response): Promise<void> =>{
    const maleTotal = await User.count({where:{gender:`male`}})
    const femaleTotal = await User.count({where:{gender:`female`}})
    
    res.json({
        totalMaleCount: maleTotal,
        totalFemaleCount: femaleTotal
    })
}
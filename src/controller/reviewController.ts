import { Request, Response } from 'express';
import Review from '../model/review';
import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import User from '../model/user';

config();
const secret: string = process.env.secret as string;

export const addReview = async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]
        if (!token) {
            console.log("no token")
            res.json({ noTokenError: 'Unauthorized - Token not provided' })
        } else {
            const decoded = jwt.verify(token, secret) as { userEmail: string }
            const user = await User.findOne({
                where: { email: decoded.userEmail }
            })
           
console.log("user", user?.dataValues)
            // req.User = { UserId: User?.dataValues.UserId }
    
            const { productId } = req.params
            const { reviewRating, reviewText} = req.body;

            if (reviewRating && (reviewRating < 1 || reviewRating > 5)) {
                return res.json({
                    errorCreating: 'Invalid review rating'
                });
            }
        
            const reviewCreated = await Review.create({
                reviewRating,
                reviewText,
                reviewerId: user?.dataValues.userId,
                reviewerName: user?.dataValues.name,
                productId,
                date: new Date().toLocaleDateString()
            });
            console.log('Review created:', reviewCreated);
            res.json({
                reviewCreated: 'Review submitted successfully',
            });
        } 
    } catch (error) {
        console.log('Error creating review:', error);
        res.json({
            errorMessage: 'Internal server error'
        });
    }
}


export const fetchReviewsByProductId = async (req: Request, res: Response): Promise<void> => {
    try {
        const productId = req.params.productId; // Assuming the product ID is passed as a URL parameter
        const reviews = await Review.findAll({
            where: {
                productId: productId
            }
        });

        if (reviews.length === 0) {
            res.status(404).json({ message: 'No reviews found for this product.' });
        } else {
            console.log("reviews", reviews)
            res.json({ reviews });
        }
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};





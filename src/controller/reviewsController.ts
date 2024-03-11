import Review from "../model/reviews";
import { Request, Response } from "express";

export const customersReviews = async (req: Request, res: Response) => {
    try {
        const { reviewRating, reviewContent, name, shopName, date } = req.body;

        if (reviewRating && (reviewRating < 1 || reviewRating > 5)) {
            return res.status(400).json({
                error: 'Invalid review rating'
            });
        }
        
        const review = await Review.create({
            reviewRating,
            reviewContent,
            name,
            shopName,
            date
        });

        res.status(201).json({
            message: 'Review created successfully',
            review: review
        });
        
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({
            errorMessage: 'Internal server error'
        });
    }
}

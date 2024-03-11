import { Request, Response } from 'express';
import Review from '../model/review';

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
            res.json({ reviews });
        }
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};





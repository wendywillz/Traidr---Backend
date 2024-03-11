import { Request, Response } from 'express';
import Review  from '../model/review';

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





import express from "express";
import { fetchReviewsByProductId} from "../controller/reviewController";
const router = express.Router();

router.post("/review-product", fetchReviewsByProductId );

export default router;
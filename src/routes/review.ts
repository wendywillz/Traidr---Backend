import express from "express";
import { fetchReviewsByProductId, addReview} from "../controller/reviewController";
const router = express.Router();

router.get("/get-product-review/:productId", fetchReviewsByProductId );
router.post("/add-review/:productId", addReview);
export default router;
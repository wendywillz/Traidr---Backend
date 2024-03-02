import express from 'express';
import { uploadProduct } from '../controller/productController';
 
const router = express.Router();
 
router.post('/products', uploadProduct);
 
export default router;
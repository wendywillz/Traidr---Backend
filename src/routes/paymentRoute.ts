import express from 'express';
import { savePayment } from '../controller/paymentController';

const router = express.Router();

// Define the route to save payment details
router.post('/save-payment', savePayment);

export default router;
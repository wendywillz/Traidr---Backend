
import { Request, Response } from 'express';
import Payment from '../model/payment';

export const savePayment = async (req: Request, res: Response) => {
  const paymentDetails: Payment = req.body;

  try {
    // Validate the payment details
    const newPayment = await Payment.create({
      paymentMethod: paymentDetails.paymentMethod,
      businessName: paymentDetails.businessName,
      businessDescription: paymentDetails.businessDescription,
      streetAddress: paymentDetails.streetAddress,
      city: paymentDetails.city,
      zipCode: paymentDetails.zipCode,
      state: paymentDetails.state,
      country: paymentDetails.country,
    });

    // Log the saved payment details
    console.log('Payment Details Saved:', newPayment.toJSON());

    res.status(200).json({ message: 'Payment details saved successfully' });
  } catch (error) {
    console.error('Error saving payment details:', error);
    res.status(500).json({ message: 'Error saving payment details' });
  }
};







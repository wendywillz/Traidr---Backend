import { Request, Response } from 'express';
import Customer from '../model/user';
import speakeasy from 'speakeasy';
import { transporter } from '../utils/emailSender';


export const customerOtp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;
        const customer = await Customer.findOne({ where: { email } });

        if (!customer) {
            res.status(400).json({
                error: 'Customer not found. Please sign up.'
            });
            return;
        }

        // Generate OTP secret and save it to the customer record
        const otpSecret = speakeasy.generateSecret({ length: 20 }).base32;
        customer.otpSecret = otpSecret;
        await customer.save();

        const otpToken = speakeasy.totp({
            secret: otpSecret,
            encoding: 'base32',
        });

        const mailOptions = {
            from: {
              name: 'Traïdr Decagon',
              address: 'traidr.decagon@gmail.com'
            },
            to: email,
            subject: 'Traïdr - Account Verification',
            text: otpToken
        };
      
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'OTP sent successfully. Check your email.' });

    } catch (error) {
        console.log('Error creating customer:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const verifyCustomerOtp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, otp } = req.query;
        const existingCustomer = await Customer.findOne({ where: { email } });

        if (!existingCustomer) {
            res.status(400).json({
                error: 'Customer not found. Please sign up.'
            });
            return;
        }

        // Verify the customer's OTP token
        const verified = speakeasy.totp.verify({
            secret: existingCustomer.otpSecret,
            encoding: 'base32',
            token: otp as string,
        });

        if (verified) {
            existingCustomer.isVerified = true;
            await existingCustomer.save();
            res.status(200).json({ message: 'Customer verified successfully.' });
        } else {
            res.status(400).json({ error: 'Invalid OTP. Please try again.' });
        }
    } catch (error) {
        console.error('Error verifying customer:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

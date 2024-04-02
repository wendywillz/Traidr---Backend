import {Request, Response} from "express";
import User from "../model/user";
import speakeasy from 'speakeasy';
import { transporter } from '../utils/emailSender';

export const sendCustomerOtp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;

        const customer = await User.findOne({ where: { email } });

        if (!customer) {
            res.status(400).json({
                error: 'Customer not found. Please sign up.'
            });
            return;
        }
        
        const otpSecret = speakeasy.generateSecret({ length: 20 }).base32;

        customer.otpSecret = otpSecret;
        const otpToken = speakeasy.totp({
            secret: otpSecret,
            encoding: 'base32',
        });
        customer.otpExpirationTime = new Date(Date.now() + 5 * 60 * 1000);

        await customer.update({
            otpSecret: customer.otpSecret,
            otpToken: otpToken,
            otpExpirationTime: customer.otpExpirationTime
        });

        const mailOptions = {
            from: {
                name: 'Traïdr Decagon',
                address: 'traidr.decagon@gmail.com'
            },
            to: email,
            subject: 'Traïdr - Account Verification',
            text: `Dear customer,\n\n Kindly find your OTP below: \n\n ${otpToken}. \n\n Thank you for choosing Traïdr.`,
        };
      
      await transporter.sendMail(mailOptions);
      
      res.status(200).json({ message: 'OTP sent successfully. Check your email.' });
      
    }catch (error) {
    console.log('Error during User signup:', error)
    res.json({
        Errormessage: 'Internal server error'
    })
    }
}

export const verifyCustomerOtp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body
        
       const existingCustomer =  await User.findOne({ where: { email } });

        
        if (!existingCustomer) {
            res.json({
                userNotFoundError: 'Customer not found. Please sign up.'
            });
            return;
        }
        else {
           const now = new Date()
      if (now > existingCustomer.otpExpirationTime) {
          res.json({ expiredOtpError: 'OTP has expired' })
          return
      }

      await existingCustomer.update({ isVerified: true, otp: null, otpExpiration: null, otpSecret: null })
        res.json({otpVerificationSuccessful: "otp verifired successfully"})     
        }
          
      
    }catch (error) {
    console.log('Error during User signup:', error)
    res.json({
        Errormessage: 'Internal server error'
    })
    }
}
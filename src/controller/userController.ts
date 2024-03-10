import { Request, Response } from "express";
import { hashPassword } from '../utils/password';
import { googleSignIn } from '../utils/googleAuth';
import { exchangeCodeForTokens } from '../utils/exchangeCodeForTokens';
import User from "../model/user";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import { transporter } from '../utils/emailSender';
import Payment from '../model/payment';
import { config } from 'dotenv';
import { token } from "morgan";

config();
const secret: string = process.env.secret as string;

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {

    const { name, email, password, hearAboutUs } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.json({ 
        emailExistError: 'Email already already in use, try another email' 
    });
    }
    else {
        //hash the password
      const hashedPassword = await hashPassword(password);

      //create a new user
    const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        hearAboutUs
    });
    

    if (!newUser) {
      console.log("unable to create user")
        res.json({
          unableToCreateUser: 'Invalid details, account cannot be created'
        })
      }
    else {
      const customer = await User.findOne({ where: { email } });

      if (!customer) {
          res.status(400).json({
              error: 'Customer not found. Please sign up.'
          });
          return;
      }
      else {
      const otpSecret = speakeasy.generateSecret({ length: 20 }).base32;

      customer.otpSecret = otpSecret;
      const otpToken = speakeasy.totp({
        secret: otpSecret,
        encoding: 'base32',
      });
      customer.otpExpirationTime = new Date(Date.now() + 5 * 60 * 1000);

      await customer.update({
        otpSecret: customer.otpSecret,
        otp: otpToken,
        otpExpirationTime: customer.otpExpirationTime
      });

      const mailOptions = {
          from: {
            name: 'Traïdr Decagon',
            address: 'traidr.decagon@gmail.com'
          },
          to: email,
          subject: 'Traïdr - Account Verification',
          text: `Dear customer,\n\n Kindly find your OTP below: \n\n ${otpToken} \n\n Thank you for choosing Traïdr.`,
      };
      
      await transporter.sendMail(mailOptions);
      console.log("user created",token)
      res.json({ otpSentSuccessfully: email });
      } 
      }
    }
  }catch (error) {
  console.log('Error during User signup:', error)
  res.json({
    internalServerError: 'Internal server error'
  })
}
}


export const createGoogleUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { googleToken } = req.body as { googleToken: string };
    
            // Authenticate with Google and retrieve user information
            const userData = await googleSignIn(googleToken);
    
            const existingUser = await User.findOne({ where: { email: userData.email } });
            if (existingUser) {
                    res.json({ 
                    userExistError: 'User already exists' 
                });
                return;
            }
    
            // Create a new user with Google Sign-In data
            await User.create({
                username: userData.username,
                email: userData.email,
                googleSignIn: true, // Marking this user as signed in with Google
            });
    
            res.json({
                googleSignInSuccessful: 'Google Sign-In user created successfully',        
            });
        } catch (error) {
            console.error('Error creating Google Sign-In user:', error);
            res.json({ internalServerError: 'Server error' });
        }
    };


// Controller function for handling Google OAuth callback
export const handleGoogleCallback = async (req: Request, res: Response) => {
    try {
        const code  = req.query.code as string; // Get the authorization code from the query parameters

        if (!code) {
          throw new Error('Authorization code is missing');
      }
        // Exchange the authorization code for access tokens
        const { id_token } = await exchangeCodeForTokens(code);

        console.log('ID Token:', id_token);

        await googleSignIn(id_token);
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Error handling Google callback:', error);
        res.json({ error: 'Internal server error' });
    }
};


export const loginUser = async (req: Request, res: Response): Promise<void> => {
 try {
   const { email, password } = req.body;
  const existingUser = await User.findOne({ where: { email } })


  if (!existingUser) {
    res.json({
      userNotFoundError: 'User not found'
    })
  } else {
    const isPasswordValid = await bcrypt.compare(password, existingUser.dataValues.password)

    if (!isPasswordValid) {
      res.json({
        inValidPassword: 'Invalid password'
      })
    } else {

      const token = jwt.sign({ userEmail: existingUser.dataValues.email }, secret, { expiresIn: '1h' })
      
      res.json({
        successfulLogin: token
      })
    }
  }
 } catch (error) {
   console.log("error Login", error)
  res.json({internalServerError: "internal server error"})
 }
}

export async function checkAndVerifyUserToken(req: Request, res: Response): Promise<void> {
  try {
    // const token = req.cookies.token
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      console.log("no token")
      res.json({ noTokenError: 'Unauthorized - Token not provided' })
    } else {
      const decoded = jwt.verify(token, secret) as { userEmail: string }
      const user = await User.findOne({
        where: { email: decoded.userEmail }
      })
      res.json({ userDetail: user })

      // req.User = { UserId: User?.dataValues.UserId }
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log("error VErify", error)
    if (error.name === 'TokenExpiredError') {
      res.json({ tokenExpiredError: 'Unauthorized - Token has expired' })
    } else {
      res.json({ verificationError: 'Unauthorized - Token verification failed' })
    }
  }
}

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
    res.json({ message: 'Error saving payment details' });
  }
};

export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.json({ noTokenError: 'Unauthorized - Token not provided' });
    }
    else {
      const decoded = jwt.verify(token, secret) as { userEmail: string };
      console.log("decoded", decoded)

      const { currentPassword, newPassword } = req.body;
      const user = await User.findOne({ where: { email: decoded.userEmail } });

      if (!user) {
        res.json({ userNotFound: 'User not found. Please sign up' });
        return;
      }

      const passwordMatch = await bcrypt.compare(currentPassword, user.password);

      if (!passwordMatch) {
        res.json({ invaidPasswordError: 'Current password is incorrect' });
        return;
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);
      await user.update({ password: hashedPassword });
      res.json({ passwordChangedSuccessfully: 'Password changed successfully' });
       
    }
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ interalServerError: 'Failed to send OTP' });
  }
}
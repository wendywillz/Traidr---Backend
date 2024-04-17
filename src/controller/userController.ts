/* eslint-disable @typescript-eslint/no-explicit-any */
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
import Shop from "../model/shop";
import { getUserIdFromToken } from "../utils/getModelId";

config();

const BACKEND_URL = process.env.BACKEND_URL;
const secret: string = process.env.secret as string;

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {

    const { name, email, password, hearAboutUs, dateOfBirth, gender, isAdmin } = req.body;
const insertIsAdmin = isAdmin ? true : false;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.json({ 
        emailExistError: 'Email already already in use, try another email' 
    });
    }
    else {
        //hash the password
      const hashedPassword = await hashPassword(password);
      const calculatedAge = Math.trunc((Date.now() - Date.parse(dateOfBirth))/31557600000)
      //create a new user
    const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
      hearAboutUs,
        dateOfBirth,
        age:calculatedAge,
      gender,
        isAdmin: insertIsAdmin
    });
    

    if (!newUser) {
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
      res.json({ otpSentSuccessfully: email });
      } 
      }
    }
  } catch (error) {
    console.log("error", error)
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

        await googleSignIn(id_token);
        res.redirect('/dashboard');
    } catch (error) {
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
const successfulLogin = {
      token,
        userId: existingUser?.dataValues.userId,
        name: existingUser?.dataValues.name,
        email: existingUser?.dataValues.email,
        isAdmin: existingUser?.dataValues.isAdmin,
        isSeller: existingUser?.dataValues.isSeller,
        isVerified: existingUser?.dataValues.isVerified
        } 
        res.json({
        successfulLogin
      })
      
    }
  }
 } catch (error) {
   res.json({internalServerError: "internal server error"})
 }
}

export async function checkAndVerifyUserToken(req: Request, res: Response): Promise<void> {
  try {
    // const token = req.cookies.token
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
    
      res.json({ noTokenError: 'Unauthorized - Token not provided' })
    } else {
      const decoded = jwt.verify(token, secret) as { userEmail: string }
      const user = await User.findOne({
        where: { email: decoded.userEmail }
      })
      const userDetail = {
        userId: user?.dataValues.userId,
        name: user?.dataValues.name,
        email: user?.dataValues.email,
        isAdmin: user?.dataValues.isAdmin,
        isSeller: user?.dataValues.isSeller,
        isVerified: user?.dataValues.isVerified,
        gender: user?.dataValues.gender,
        age: user?.dataValues.age,
        address: user?.dataValues.address,
        phoneNumber: user?.dataValues.phoneNumber,
        shopName: user?.dataValues.shopName,
        dateOfBirth: user?.dataValues.dateOfBirth,
        profilePic: user?.dataValues.profilePic
      }
      console.log("shopName", userDetail.shopName)
      res.json({ userDetail })

      
    }

  } catch (error: any) {
    if (error instanceof jwt.TokenExpiredError) {
        res.json({ error: 'Unauthorized - Token has expired' });
      } else if (error instanceof jwt.JsonWebTokenError) {
        res.json({ error: 'Unauthorized - Token verification failed' });
      } else {
        res.json({ error: 'Internal server error' });
      }
   
  }
}

export const savePayment = async (req: Request, res: Response) => {
  const paymentDetails: Payment = req.body;

  try {
    // Validate the payment details
    await Payment.create({
      paymentMethod: paymentDetails.paymentMethod,
      businessName: paymentDetails.businessName,
      businessDescription: paymentDetails.businessDescription,
      streetAddress: paymentDetails.streetAddress,
      city: paymentDetails.city,
      zipCode: paymentDetails.zipCode,
      state: paymentDetails.state,
      country: paymentDetails.country,
    });

 

    res.status(200).json({ message: 'Payment details saved successfully' });
  } catch (error) {
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
    res.status(500).json({ interalServerError: 'Failed to send OTP' });
  }
}

export const getUserShopId = async (req: Request, res: Response) => { 
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.json({ noTokenError: 'Unauthorized - Token not provided' });
    }
    else {
      const decoded = jwt.verify(token, secret) as { userEmail: string };
      const user = await User.findOne({ where: { email: decoded.userEmail } });
      const shopDetails = await Shop.findOne({ where: { shopOwner: user?.userId } });  
      res.json({ shopId: shopDetails?.dataValues.shopId });
    }
  } catch (error) {
    res.json({ message: 'Error getting user shop ID' });
  }
}

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = await getUserIdFromToken(req, res);
  if (!userId) {
    res.json({ error: 'User not found' });
    return;
  }
  const { firstName, lastName, phoneNumber, gender, address, shopName, profilePic } = req.body
  
  const photoPath = req?.file ? `${BACKEND_URL}/uploads/profilePics/${req.file?.filename}`: profilePic;
      
  // if (req.file) {
  //   const profilePic = (req.file as unknown as { [fieldname: string]: Express.Multer.File; }).profilePicture;
      
  //   if (profilePic) {
  //     const sanitizedTitle = (firstName + " " + lastName).replace(/[^a-z0-9]/gi, '_').toLowerCase();
  //     const newFilename = `${sanitizedTitle}_${Date.now()}${path.extname(profilePic.filename)}`; // Example filename construction
  //     const renamedPhotoPath = path.join(__dirname, "../../public/uploads/profilePics", newFilename);
  //     const photoUndefinedPath = path.join(__dirname, "../../public/uploads/profilePics", profilePic.filename);
  //     fs.renameSync(photoUndefinedPath, renamedPhotoPath);
  //     photoPath = `${BACKEND_URL}/uploads/profilePics/${newFilename}`;
  //     console.log("photoPath", photoPath)
  //   }
  // }
  const user = await User.findOne({ where: { userId } });
  const updatedUser = await user?.update({
    name: `${firstName} ${lastName}`,
    phoneNumber: phoneNumber ? phoneNumber : "",
    gender: gender,
    address: address ? address : "",
    shopName: shopName,
    profilePic: photoPath,
  })
    if (updatedUser) {
      res.json({ user })
      return
  }
  
  } catch (error) {
  console.log("error", error)
  res.json({ error: 'Error updating user' })
}
}


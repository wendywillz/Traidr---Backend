import { Request, Response } from "express";
import { hashPassword } from '../utils/password';
import { googleSignIn } from '../utils/googleAuth';
import User from "../model/user";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { error } from "console";


const secret: string = (process.env.secret ?? '')

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
        const { name, email, password, phoneNumber } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
         res.json({ 
            signupSuccessful: 'Email is already in use, try another email' 
        });
            return
        }

        else {
            //hash the password
         const hashedPassword = await hashPassword(password);

         //create a new user
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            phoneNumber,
        });

        if (!newUser) {
            res.json({
              unableToCreateUSer: 'Invalid details, account cannot be created'
            })
          }
        else {
           res.json({
            signupSuccessful: 'Signup successful'
          })
         }
       }
        } catch (error) {
          console.log('Error during User signup:', error)
          res.json({
            Errormessage: 'Internal server error'
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
                    res.status(400).json({ 
                    status: 'failed',
                    message: 'User already exists' 
                });
            }
    
            // Create a new user with Google Sign-In data
            const newUser = new User({
                username: userData.username,
                email: userData.email,
                googleSignIn: true, // Marking this user as signed in with Google
            });
            await newUser.save();
    
            res.status(201).json({
                status: 'success',
                message: 'Google Sign-In user created successfully',
                user: {
                    name: newUser.name,
                    email: newUser.email
                }
            });
        } catch (error) {
            console.error('Error creating Google Sign-In user:', error);
            res.status(500).json({ error: 'Server error' });
        }
    };

export const loginUser = async (req: Request, res: Response): Promise<void> => { 
    const { email, password } = req.body;
    const existingUser = await User.findOne({ where: { email } })


if (!existingUser) {
    res.status(404).json({
      userNotFoundError: 'User not found'
    })
  } else {
    const isPasswordValid = await bcrypt.compare(password, existingUser.dataValues.password)

    if (!isPasswordValid) {
      res.status(401).json({
        inValidPassword: 'Invalid password'
      })
    } else {
      const token = jwt.sign({ loginkey: existingUser.dataValues.email }, secret, { expiresIn: '1h' })

      res.cookie('token', token, { httpOnly: true, secure: false })

      res.json({
        successfulLogin: 'Login successful'
      })
    }
  }
try {
    // Code that may throw an error
} catch (error: unknown) {
    // Error handling logic
}
  console.error('Error during customer login:', error )

  res.status(500).json({
    internalServerError: `Error: ${ error }`
  })
}

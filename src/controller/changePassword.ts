import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import Customer  from '../model/user';
// import { transporter } from '../utils/emailSender';

// Endpoint to change password 
export const changePassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, currentPassword, newPassword } = req.body;
        const user = await Customer.findOne({ where: { email } });

        if (!user) {
            res.json({ userNotFound: 'User not found. Please sign up' });
            return;
        }

        const passwordMatch = await bcrypt.compare(currentPassword, user.password);

        if (!passwordMatch) {
            res.json({ invaidPassword: 'Current password is incorrect' });
            return;
        }

         const hashedPassword = await bcrypt.hash(newPassword, 12);
         await user.update({ password: hashedPassword });
         res.json({ message: 'Password changed successfully' });
       
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({interalServerError: 'Failed to send OTP' });
    }
};
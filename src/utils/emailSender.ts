import nodemailer from 'nodemailer';
  
export const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'traïderdecagon@gmail.com',
        pass: 'password',
      },
    });
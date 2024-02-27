import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import DB from './database/database.config';
import dotenv from 'dotenv';
import changePassword from './routes/changePassword'
import otpRoute from './routes/otpRoute'
import paymentRoute from './routes/paymentRoute';


dotenv.config();

import indexRouter from './routes/index';
import usersRouter from './routes/users';


DB.sync()
.then(() => {
   console.log("Database has been connected")
}).catch((error) => {
   console.log("Error synching the database")
   throw error;
})

const app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../", 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/users-otp', otpRoute);

app.use('/changePassword', changePassword);
app.use('/savePayment', paymentRoute);


export default app;

import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import dotenv from 'dotenv';
import otpRoute from './routes/otpRoute'
import cors from 'cors'
import indexRouter from './routes/index';
import usersRouter from './routes/users';
import checkAndVerifyUserToken from './routes/verifyToken'
import shopRouter from './routes/shopRoutes'
import notificationRouter from './routes/notificationRoutes'
import productRouter from './routes/productRoutes'
import reviewRouter from './routes/review'
import completedordersRouter from './routes/orderRoute'
import adminRouter from './routes/adminRoutes'
import cartRouter from './routes/cartRoutes'
import orderRouter from './routes/orderRoute'
import saleRouter from './routes/saleRoutes'
import deliveryRouter from './routes/deliveryRoutes'
import wishListRouter from './routes/wishListRoutes'
import DB from './database/database.config';
dotenv.config();

DB.sync()
.then(() => {
   console.log("Database has been connected")
}).catch((error) => {
   console.log("Error syncing the database")
   throw error;
})
const FRONTEND_URL = process.env.FRONTEND_URL
const app = express(); 

app.use(cors({
   origin: FRONTEND_URL,
   credentials: true
}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../", 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/verify-token', checkAndVerifyUserToken);
app.use('/users-otp', otpRoute);
app.use('/shop', shopRouter);
app.use('/notification', notificationRouter )
app.use('/products', productRouter);
app.use('/reviews', reviewRouter);
app.use('/completedorders', completedordersRouter);
app.use('/admin', adminRouter)
app.use('/cart', cartRouter)
app.use('/order', orderRouter)
app.use('/sale', saleRouter)
app.use('/delivery', deliveryRouter)
app.use('/wishlist', wishListRouter)



export default app;

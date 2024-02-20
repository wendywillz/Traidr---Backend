import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import sequelize from './database/database.config';

import indexRouter from './routes/index';
import usersRouter from './routes/users';

sequelize.sync()
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

export default app;

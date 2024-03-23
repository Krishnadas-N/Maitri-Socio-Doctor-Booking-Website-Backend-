
import express, { Application } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRouter } from './adapters/framework/express/routes/userRoutes';
import errorHandler from '../utils/ReponseHandler';
const passport = require('passport');
dotenv.config();
mongoose.connect(process.env.MONGODB_URL as string)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error(error));


const app: Application = express();
const port = process.env.PORT || 8000;
app.use(cors());
app.disable("x-powered-by"); 
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());  


app.use('/api/users', userRouter);

app.use(errorHandler)



app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
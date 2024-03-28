
import express, { Application, NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from "cors";
import cookieParser from "cookie-parser";
import { sendErrorResponse } from '../utils/ReponseHandler';
import userRouter from './presentation1/routers/userRouter';
import morgan from 'morgan';
import { CustomError } from '../utils/CustomError';
import otpRouter from './presentation1/routers/otpRouter';
import specRouter from './presentation1/routers/specRouter';
import doctorRouter from './presentation1/routers/doctorRouter';

// const passport = require('passport');
dotenv.config();
mongoose.connect(process.env.MONGODB_URL as string)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error(error));


const app: Application = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.disable("x-powered-by"); 
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());  
app.use(morgan('combined'))

app.use('/api/users', userRouter);
app.use('/api/otp',otpRouter);
app.use('/api/spec',specRouter);
app.use('/api/doctors',doctorRouter)


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log("Error Handler Comes In");
  if (err instanceof CustomError) {
    console.log("Custom Error:");
    console.error(err);
   return  sendErrorResponse(res, err.message, err.status);
  } else {
    console.error("Unhandled error:", err);
    return sendErrorResponse(res, err.message||"Internal Server Error", 500);
  }
});




app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});

import express, { Application, NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from "cors";
import cookieParser from "cookie-parser";
import { sendErrorResponse } from './utils/reponseHandler'; 
import userRouter from './presentation/routers/userRouter';
import morgan from 'morgan';
import { CustomError } from './utils/customError'; 
import otpRouter from './presentation/routers/otpRouter';
import specRouter from './presentation/routers/specRouter';
import doctorRouter from './presentation/routers/doctorRouter';
import postRouter from './presentation/routers/postRouter';
import passport from 'passport';
import { adminRouter } from './presentation/routers/adminRouter';
import configurePassport from './config/passport'; 
import { roleRouter } from './presentation/routers/rolePermissionRouter';
import { Websocket } from './presentation/webSocket/webSocket';
import http from 'http';
import { initializeSocketConnection } from './presentation/webSocket/socketService';
import chatRouter from './presentation/routers/chatRouter';
import admin from "firebase-admin";
import axios from 'axios';
// import "../config/passport";
// const passport = require('passport');
dotenv.config();
mongoose.connect(process.env.MONGODB_URL as string)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error(error));

const app: Application = express();
const serviceAccountJson = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!);
if (!serviceAccountJson) {
  throw new Error('FIREBASE_SERVICE_ACCOUNT environment variable is not set');
}
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountJson),
});

const server = http.createServer(app); 
const io = Websocket.getInstance(server);
const port = process.env.PORT || 3000;
app.use(cors());
app.disable("x-powered-by"); 
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());  
app.use(passport.initialize()); 
app.use(morgan('combined'))

configurePassport(passport);



app.use('/api/users', userRouter);
app.use('/api/otp',otpRouter);
app.use('/api/spec',specRouter);
app.use('/api/doctors',doctorRouter);
app.use('/api/posts',postRouter);
app.use('/api/admin',adminRouter);
app.use('/api/role',roleRouter);
app.use('/api/chat',chatRouter)
app.get('/keep-alive', (_req: Request, res: Response) => {
    res.status(200).send('Server is alive!');
});
/* For Keep Alive: By continuously pinging the server, it remains active, preventing it from spinning down. */
const url = `https://maitri-socio-doctor-booking-website.onrender.com/keep-alive`; 
const interval = 30000; // Interval in milliseconds (30 seconds)

function reloadWebsite() {
  axios.get(url)
    .then(response => {
      console.log(`Reloaded at ${new Date().toISOString()}: Status Code ${response.status}`);
    })
    .catch(error => {
      console.error(`Error reloading at ${new Date().toISOString()}:`, error.message);
    });
}


setInterval(reloadWebsite, interval);
initializeSocketConnection(io)




app.use((err: Error, req: Request, res: Response,next:NextFunction) => {
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




server.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});

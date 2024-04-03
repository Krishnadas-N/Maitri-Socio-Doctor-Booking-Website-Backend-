
import {Request, NextFunction ,Response} from "express";
import { CustomError } from "../../utils/CustomError";
import { verifyToken } from "../../utils/tokenizeData-Helper";
import { JwtPayload } from "jsonwebtoken";
export interface CustomRequest extends Request {
  userId: string | JwtPayload;
 }

export const verifyUserMiddleware = (req: Request, res: Response, next: NextFunction) => {
        try {
          console.log("Log from jwt middleware")
          if (!req.headers.authorization) {
            throw new CustomError('Authorization header is missing',403); // Use a custom error if desired
          }
          
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = verifyToken(token);
        console.log(decodedToken);
        req.user = decodedToken._id;
        
        next();
        } catch (error) {
          console.error('Error verifying user:', error);
          next(error)
    }
};
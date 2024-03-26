
import {Request, NextFunction ,Response} from "express";
import { userUseCase } from "../domain1/interfaces/use-cases/UserService/User-usecase";
import { CustomError } from "../../utils/CustomError";
import { User } from "../domain1/entities/User";


export const verifyUserMiddleware = (userUseCase: userUseCase) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.params.userId; 
             console.log(userId,"User Id from User Profile");
            const user: User = await userUseCase.profile(userId);

            if (user.isVerified) {
              return next();
            } else {
               throw new CustomError('User Crenditals is not Verified',403)
            }
        } catch (error) {
          console.error('Error verifying user:', error);
          next(error)
        }
    };
};
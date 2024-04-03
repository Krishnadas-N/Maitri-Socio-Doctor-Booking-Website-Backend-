import { NextFunction, Request, Response } from "express";
import { CustomError } from "../../../utils/CustomError";
import { sendSuccessResponse } from "../../../utils/ReponseHandler";
import { UserLogin } from "../../domain/interfaces/use-cases/authentication/user-login";
import { UserSignup } from "../../domain/interfaces/use-cases/authentication/user-sigup";
import { userUseCase } from "../../domain/interfaces/use-cases/UserService/User-usecase";

export function signupController(userSignup: UserSignup) {
    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            console.log("Log from Controllers (1)");
            const token = await userSignup.execute(req.body);
            return sendSuccessResponse(res, {token}, "User created successful");
        } catch (err) {
            console.log("Error passing yyy")
            next(err);
        }
    };
}

export function loginController(userLogin: UserLogin) {
    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            const token = await userLogin.execute(email, password);
            if (!token) {
                throw new CustomError("Email or Password is incorrect", 401);
            }
            return sendSuccessResponse(res, token, "Login successful");
        } catch (err) {
            
            next(err);
        }
    };
}

export class UserController{
    constructor(private userUseCase:userUseCase) {
    }
    async getUserProfile(req: Request, res: Response, next: NextFunction){
        try{
         const userId = req.params.userId;
         const userProfile = await this.userUseCase.profile(userId);
         return  sendSuccessResponse(res, userProfile,"user profile fetched successfully");
        }catch(error){
            next(error)
        }
    }

    async forgotPassword(req: Request, res: Response, next: NextFunction){
        try{
            const {email} = req.body;
           const message=await this.userUseCase.forgotPassword(email);
           return sendSuccessResponse(res,message,'Message sent Successfully');
        }catch(error){
            next(error)
        }
    }

    async  resetPassword(req:Request,res:Response,next:NextFunction){
       try{
        const passwordToken = req.params.token
          const {newPassword}=req.body;
          await this.userUseCase.setResetPassword(passwordToken,newPassword);
          return sendSuccessResponse(res,"Password Reset Successfully","Password has been changed")
       }catch(error){
        next(error)
       }
   }
}

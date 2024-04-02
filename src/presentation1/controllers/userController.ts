import { NextFunction, Request, Response } from "express";
import { CustomError } from "../../../utils/CustomError";
import { sendSuccessResponse } from "../../../utils/ReponseHandler";
import { UserLogin } from "../../domain1/interfaces/use-cases/authentication/user-login";
import { UserSignup } from "../../domain1/interfaces/use-cases/authentication/user-sigup";
import { userUseCase } from "../../domain1/interfaces/use-cases/UserService/User-usecase";

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
            const user = await userLogin.execute(email, password);
            if (!user) {
                throw new CustomError("Email or Password is incorrect", 401);
            }
            return sendSuccessResponse(res, user, "Login successful");
        } catch (err) {
            
            next(err);
        }
    };
}

export class UserController{
    constructor(private userUseCase:userUseCase) {
    }
    getUserProfile = async(req: Request, res: Response, next: NextFunction)=>{
        try{
         const userId = req.params.userId;
         const userProfile = await this.userUseCase.profile(userId);
         return  sendSuccessResponse(res, userProfile,"user profile fetched successfully");
        }catch(error){
            next(error)
        }
    }
}
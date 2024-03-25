import { NextFunction, Request, Response } from "express";
import { CustomError } from "../../../utils/CustomError";
import { sendSuccessResponse } from "../../../utils/ReponseHandler";
import { UserLogin } from "../../domain1/interfaces/use-cases/authentication/user-login";
import { UserSignup } from "../../domain1/interfaces/use-cases/authentication/user-sigup";

export function signupController(userSignup: UserSignup) {
    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            console.log("Log from Controllers (1)");
            const newUser = await userSignup.execute(req.body);
            return sendSuccessResponse(res, newUser, "User created successful");
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

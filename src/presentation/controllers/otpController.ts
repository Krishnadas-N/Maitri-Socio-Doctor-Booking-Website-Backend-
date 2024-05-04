import { Request, Response ,NextFunction} from 'express';
import { CustomError } from '../../utils/customError'; 
import { sendSuccessResponse } from '../../utils/reponseHandler'; 
import { IOtpUsecase } from '../../domain/interfaces/use-cases/otpIUsecase'; 


export class VerifyOtpMiddleware {
    constructor(private otpService: IOtpUsecase) {}

    async handle(req: Request, res: Response, next: NextFunction) {
        try {
            console.log("Log from Controllers Verify otp");
            const data = await this.otpService.verifyOTP(req.body.otp,req.body.section);
            if (!data) {
                throw new CustomError("Otp is incorrect or time Expired", 409);
            }
            return sendSuccessResponse(res, data, "User created successful");
        } catch (err) {
            console.log("Error passing yyy")
            next(err);
        }
    }
}

export class ResendOtpMiddleware {
    constructor(private otpService: IOtpUsecase) {}

    async handle(req: Request, res: Response, next: NextFunction) {
        try {
        console.log("Log from Controllers of Resend otp ",req.body.authToken);
        await this.otpService.resendOtp(req.body.authToken);
        return sendSuccessResponse(res, {}, "User created successful");
    } catch (err) {
        console.log("Error passing yyy")
        next(err);
    }
    }
}
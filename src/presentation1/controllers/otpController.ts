import { Request, Response ,NextFunction} from 'express';
import { CustomError } from "../../../utils/CustomError";
import { sendSuccessResponse } from "../../../utils/ReponseHandler";
import { OTPService } from '../../domain1/interfaces/use-cases/OTP-SERVICE/OTPService';


export class VerifyOtpMiddleware {
    constructor(private otpService: OTPService) {}

    async handle(req: Request, res: Response, next: NextFunction) {
        try {
            console.log("Log from Controllers Verify otp");
            const isVerified = await this.otpService.verifyOTP(req.body.email, req.body.otp);
            if (!isVerified) {
                throw new CustomError("Otp is incorrect or time Expired", 409);
            }
            return sendSuccessResponse(res, isVerified, "User created successful");
        } catch (err) {
            console.log("Error passing yyy")
            next(err);
        }
    }
}

export class ResendOtpMiddleware {
    constructor(private otpService: OTPService) {}

    async handle(req: Request, res: Response, next: NextFunction) {
        try {
        console.log("Log from Controllers of Resend otp ",req.body.email);
        this.otpService.resendOtp(req.body.email);
        return sendSuccessResponse(res, {}, "User created successful");
    } catch (err) {
        console.log("Error passing yyy")
        next(err);
    }
    }
}
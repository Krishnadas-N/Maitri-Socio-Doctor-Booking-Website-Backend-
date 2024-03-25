import { Request, Response ,NextFunction} from 'express';
import { CustomError } from "../../../utils/CustomError";
import { sendSuccessResponse } from "../../../utils/ReponseHandler";
import { OTPService } from '../../domain1/interfaces/use-cases/OTP-SERVICE/OTPService';


export function findOtp(otpService: OTPService) {
    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            console.log("Log from Controllers (1)");
            const isVerified = await otpService.verifyOTP(req.body.email,req.body.otp);
            if(!isVerified){
                throw new CustomError("Otp is incorrect or time Expired",409);
            }
            return sendSuccessResponse(res, isVerified, "User created successful");
        } catch (err) {
            console.log("Error passing yyy")
            next(err);
        }
    };
}

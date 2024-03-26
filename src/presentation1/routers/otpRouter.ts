

import { MongoDbOtpDataSource } from "../../data1/data-sources/mongodb/mongodb-otp-dataSource";
import { OTPRepsositoryImpl } from "../../domain1/repositories/otp-repository";
import { UserAuthenticationRepoImpl } from "../../domain1/repositories/user-repository";
import { OTPServiceImpl } from "../../domain1/use-cases/OTP-useCase/OTPServiceImpl";
import { userLogin } from "../../domain1/use-cases/authentication/user-login";
import { userSignup } from "../../domain1/use-cases/authentication/user-signup";
import { Router } from "express";
import { ResendOtpMiddleware, VerifyOtpMiddleware } from "../controllers/otpController";
export const otpRouter = Router();

const otpRepositoryImpl =  new OTPRepsositoryImpl(new MongoDbOtpDataSource())
const otpService = new OTPServiceImpl(otpRepositoryImpl);

const verifyOtpMiddleware = new VerifyOtpMiddleware(otpService);
const resendOtpMiddleware = new ResendOtpMiddleware(otpService);

otpRouter.post('/verify', verifyOtpMiddleware.handle.bind(verifyOtpMiddleware));
otpRouter.post('/resend', resendOtpMiddleware.handle.bind(resendOtpMiddleware));


export default otpRouter;
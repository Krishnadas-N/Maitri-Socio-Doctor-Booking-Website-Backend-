

import { MongoDbOtpDataSource } from "../../data1/data-sources/mongodb/mongodb-otp-dataSource";
import { OTPRepsositoryImpl } from "../../domain1/repositories/otp-repository";
import { OTPServiceImpl } from "../../domain1/use-cases/OTP-useCase/OTPServiceImpl";
import { Router } from "express";
import { ResendOtpMiddleware, VerifyOtpMiddleware } from "../controllers/otpController";
import { UserAuthenticationRepoImpl } from "../../domain1/repositories/user-repository";
import { MongoDbUserDataSource } from "../../data1/data-sources/mongodb/mongodb-user-dataSource";
import { IDoctorRepositoryImpl } from "../../domain1/repositories/doctor-repository";
import { MongoDbDoctorDataSourceImpl } from "../../data1/data-sources/mongodb/mongodb-doctor-dataSource";
export const otpRouter = Router();


const doctorDataSource = new MongoDbDoctorDataSourceImpl();
const doctorRepo = new IDoctorRepositoryImpl(doctorDataSource);
const userRepositoryImpl = new UserAuthenticationRepoImpl(new MongoDbUserDataSource())
const otpRepositoryImpl =  new OTPRepsositoryImpl(new MongoDbOtpDataSource())
const otpService = new OTPServiceImpl(otpRepositoryImpl,userRepositoryImpl,doctorRepo);

const verifyOtpMiddleware = new VerifyOtpMiddleware(otpService);
const resendOtpMiddleware = new ResendOtpMiddleware(otpService);

otpRouter.post('/verify', verifyOtpMiddleware.handle.bind(verifyOtpMiddleware));
otpRouter.post('/resend', resendOtpMiddleware.handle.bind(resendOtpMiddleware));



export default otpRouter;
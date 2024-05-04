

import { MongoDbOtpDataSource } from "../../data/data-sources/mongodb/mongodbOtpDataSource";
import { OTPRepsositoryImpl } from "../../domain/repositories/otpRepository";
import { OTPServiceImpl } from "../../domain/use-cases/otpUsecase";
import { Router } from "express";
import { ResendOtpMiddleware, VerifyOtpMiddleware } from "../controllers/otpController";
import { UserRepository } from "../../domain/repositories/userRepository";
import { MongoDbUserDataSource } from "../../data/data-sources/mongodb/mongodbUserDataSource";
import { IDoctorRepositoryImpl } from "../../domain/repositories/doctorRepository";
import { MongoDbDoctorDataSourceImpl } from "../../data/data-sources/mongodb/mongodbDoctorDataSource";
export const otpRouter = Router();


const doctorDataSource = new MongoDbDoctorDataSourceImpl();
const doctorRepository = new IDoctorRepositoryImpl(doctorDataSource);
const userRepository = new UserRepository(new MongoDbUserDataSource())
const otpRepository =  new OTPRepsositoryImpl(new MongoDbOtpDataSource())
const otpService = new OTPServiceImpl(otpRepository,userRepository,doctorRepository);

const verifyOtpMiddleware = new VerifyOtpMiddleware(otpService);
const resendOtpMiddleware = new ResendOtpMiddleware(otpService);

otpRouter.post('/verify', verifyOtpMiddleware.handle.bind(verifyOtpMiddleware));
otpRouter.post('/resend', resendOtpMiddleware.handle.bind(resendOtpMiddleware));



export default otpRouter;
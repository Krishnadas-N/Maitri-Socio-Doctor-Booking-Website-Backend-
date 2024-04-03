

import { Router } from "express";
import { MongoDbDoctorDataSourceImpl } from "../../data/data-sources/mongodb/mongodb-doctor-dataSource";
import { IDoctorRepositoryImpl } from "../../domain/repositories/doctor-repository";
import { DoctorAuthUseCaseImpl } from "../../domain/use-cases/Doctor/doctor-authentication-usecase";
import { MongoDbOtpDataSource } from "../../data/data-sources/mongodb/mongodb-otp-dataSource";
import { OTPRepsositoryImpl } from "../../domain/repositories/otp-repository";
import { forgotPassword, login, registerAdditionalInfo, registerBasicInfo, registerProfessionalInfo, resetPassword } from "../controllers/doctorController";
import { upload, uploadToCloudinary } from "../../../config/uploadMiddleWare";
import { verifyUserMiddleware } from "../../middlewares/authentication";
export const doctorRouter = Router();

const doctorDataSource = new MongoDbDoctorDataSourceImpl();
const doctorRepo = new IDoctorRepositoryImpl(doctorDataSource);
const otpRepositoryImpl =  new OTPRepsositoryImpl(new MongoDbOtpDataSource())
const doctorAuthService = new DoctorAuthUseCaseImpl(doctorRepo,otpRepositoryImpl);

doctorRouter.post('/register/basic-info',registerBasicInfo(doctorAuthService));

doctorRouter.post('/login',login(doctorAuthService));

doctorRouter.post('/complete-professional-info',verifyUserMiddleware,upload.array('certifications',5),uploadToCloudinary, registerProfessionalInfo(doctorAuthService));
doctorRouter.post('/complete-additional-info',verifyUserMiddleware, registerAdditionalInfo(doctorAuthService));

doctorRouter.post('/forgot-password', forgotPassword(doctorAuthService));
doctorRouter.post('/reset-password/:token', resetPassword(doctorAuthService));

export default doctorRouter;
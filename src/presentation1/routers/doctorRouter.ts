

import { Router } from "express";
import { MongoDbDoctorDataSourceImpl } from "../../data1/data-sources/mongodb/mongodb-doctor-dataSource";
import { IDoctorRepositoryImpl } from "../../domain1/repositories/doctor-repository";
import { DoctorAuthUseCaseImpl } from "../../domain1/use-cases/Doctor/doctor-authentication-usecase";
import { MongoDbOtpDataSource } from "../../data1/data-sources/mongodb/mongodb-otp-dataSource";
import { OTPRepsositoryImpl } from "../../domain1/repositories/otp-repository";
import { login, registerAdditionalInfo, registerBasicInfo, registerProfessionalInfo } from "../controllers/doctorController";
import { upload, uploadToCloudinary } from "../../../config/uploadMiddleWare";
import { verifyUserMiddleware } from "../../middlewares/authentication";
export const doctorRouter = Router();

const doctorDataSource = new MongoDbDoctorDataSourceImpl();
const doctorRepo = new IDoctorRepositoryImpl(doctorDataSource);
const otpRepositoryImpl =  new OTPRepsositoryImpl(new MongoDbOtpDataSource())
const doctorAuthService = new DoctorAuthUseCaseImpl(doctorRepo,otpRepositoryImpl);

doctorRouter.post('/register/basic-info',registerBasicInfo(doctorAuthService));

doctorRouter.post('/login',login(doctorAuthService));

doctorRouter.post('/complete-professional-info',verifyUserMiddleware,upload.array('certifications'),uploadToCloudinary, registerProfessionalInfo(doctorAuthService));
doctorRouter.post('/complete-additional-info',verifyUserMiddleware, registerAdditionalInfo(doctorAuthService))


export default doctorRouter;
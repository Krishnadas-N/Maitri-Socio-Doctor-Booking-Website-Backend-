

import { Router } from "express";
import { MongoDbDoctorDataSourceImpl } from "../../data1/data-sources/mongodb/mongodb-doctor-dataSource";
import { IDoctorRepositoryImpl } from "../../domain1/repositories/doctor-repository";
import { DoctorAuthUseCaseImpl } from "../../domain1/use-cases/Doctor/doctor-authentication-usecase";
import { MongoDbOtpDataSource } from "../../data1/data-sources/mongodb/mongodb-otp-dataSource";
import { OTPRepsositoryImpl } from "../../domain1/repositories/otp-repository";
import { registerAdditionalInfo, registerBasicInfo, registerProfessionalInfo } from "../controllers/doctorController";
export const doctorRouter = Router();


const doctorDataSource = new MongoDbDoctorDataSourceImpl();
const doctorRepo = new IDoctorRepositoryImpl(doctorDataSource);
const otpRepositoryImpl =  new OTPRepsositoryImpl(new MongoDbOtpDataSource())
const doctorAuthService = new DoctorAuthUseCaseImpl(doctorRepo,otpRepositoryImpl);

doctorRouter.post('/register/basic-info',registerBasicInfo(doctorAuthService));
doctorRouter.post('/register/professional-info', registerProfessionalInfo(doctorAuthService));
doctorRouter.post('/register/additional-info', registerAdditionalInfo(doctorAuthService))



export default doctorRouter;
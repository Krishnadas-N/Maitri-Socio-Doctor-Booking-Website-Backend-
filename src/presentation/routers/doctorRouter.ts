

import { Router } from "express";
import { MongoDbDoctorDataSourceImpl } from "../../data/data-sources/mongodb/mongodb-doctor-dataSource";
import { IDoctorRepositoryImpl } from "../../domain/repositories/doctor-repository";
import { DoctorAuthUseCaseImpl } from "../../domain/use-cases/Doctor/doctor-authentication-usecase";
import { MongoDbOtpDataSource } from "../../data/data-sources/mongodb/mongodb-otp-dataSource";
import { OTPRepsositoryImpl } from "../../domain/repositories/otp-repository";
import { VerifyProfile, chnageStatus, forgotPassword, getCurrentDoctor, getDoctorById, getDoctors, login, registerAdditionalInfo, registerBasicInfo, registerProfessionalInfo, resetPassword, saveSelectedSlots, updateDoctorProfilePic } from "../controllers/doctorController";
import { upload, uploadToCloudinary } from "../../../config/uploadMiddleWare";
import { DoctorUseCaseImpl } from "../../domain/use-cases/Doctor/doctor-serviceImpl";
import { authMiddleWare } from "./authRouterSetup";
import { checkRolesAndPermissions } from "../../middlewares/roleBasedAuthMiddleware";
import { ConsultaionModel } from "../../data/data-sources/mongodb/mongodb-Consultation-dataSource";
import { ConsultationRepoImpl } from "../../domain/repositories/consultation-repoImpl";
import { ConsultationUseCaseImpl } from "../../domain/use-cases/Consultaiton/consultation-usecaseImpl";
import { ConsultationController } from "../controllers/consultationController";
export const doctorRouter = Router();

const doctorDataSource = new MongoDbDoctorDataSourceImpl();
const doctorRepo = new IDoctorRepositoryImpl(doctorDataSource);
const otpRepositoryImpl =  new OTPRepsositoryImpl(new MongoDbOtpDataSource())
const doctorAuthService = new DoctorAuthUseCaseImpl(doctorRepo,otpRepositoryImpl);
const doctorServices = new DoctorUseCaseImpl(doctorRepo);


const ConsultaionDataSource = new ConsultaionModel();
const consultationRepo = new ConsultationRepoImpl(ConsultaionDataSource);
const consultationUsecase = new ConsultationUseCaseImpl(consultationRepo);
const consultationController = new ConsultationController(consultationUsecase);


doctorRouter.post('/register/basic-info',registerBasicInfo(doctorAuthService));

doctorRouter.post('/login',login(doctorAuthService));

doctorRouter.post('/complete-professional-info',authMiddleWare.isAuthenticated.bind(authMiddleWare),upload.array('certifications',5),uploadToCloudinary, registerProfessionalInfo(doctorAuthService));
doctorRouter.post('/complete-additional-info',authMiddleWare.isAuthenticated.bind(authMiddleWare), registerAdditionalInfo(doctorAuthService));

doctorRouter.post('/forgot-password', forgotPassword(doctorAuthService));
doctorRouter.post('/reset-password/:token', resetPassword(doctorAuthService));

doctorRouter.get('/get-doctor/:doctorId',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions([ 'Admin','User'], 'READ'),getDoctorById(doctorServices))

doctorRouter.patch('/verify-profile/:doctorId',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions([ 'Admin'], 'WRITE'),VerifyProfile(doctorAuthService));

doctorRouter.get('/get-doctors',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['User','Admin',"Doctor"], 'READ'),getDoctors(doctorServices));

doctorRouter.put('/change-status/:doctorId',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions([ 'Admin'], 'WRITE'),chnageStatus(doctorServices));

doctorRouter.get('/get-currentDocotor',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions([ 'Doctor'], 'READ'),getCurrentDoctor(doctorServices))

doctorRouter.patch('/change-profile-pic',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions([ 'Doctor'], 'READ'),upload.single('profilePic'),uploadToCloudinary,updateDoctorProfilePic(doctorServices))

doctorRouter.post('/save-slots',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['Doctor'], 'WRITE'),saveSelectedSlots(doctorServices));


doctorRouter.get('/get-doctor-appoinments',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['Doctor'], 'READ'),consultationController.getDoctorAppoinments.bind(consultationController));

doctorRouter.put('/change-appoinmentStatus/:appointmentId',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['Doctor'], 'READ'),consultationController.changeAppoinmentStatusByDoctor.bind(consultationController))

// doctorRouter.get('/get-booked-slots',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['Doctor'], 'READ'),getBookedSlots(doctorServices));



export default doctorRouter;
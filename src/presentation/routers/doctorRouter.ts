

import { Router } from "express";
import { MongoDbDoctorDataSourceImpl } from "../../data/data-sources/mongodb/mongodbDoctorDataSource";
import { IDoctorRepositoryImpl } from "../../domain/repositories/doctorRepository";
import { MongoDbOtpDataSource } from "../../data/data-sources/mongodb/mongodbOtpDataSource";
import { OTPRepsositoryImpl } from "../../domain/repositories/otpRepository";
import { VerifyProfile, addReviewAndRatingOfDoctors, followOrUnfollowDoctors, forgotPassword, getCurrentDoctor, getDoctorById, getDoctorDashBoardDetails, getDoctorReviews, getDoctors, getSimilarProfilesOfDoctors, login, registerAdditionalInfo, registerBasicInfo, registerProfessionalInfo, resetPassword, saveSelectedSlots, updateDoctorProfilePic } from "../controllers/doctorController";
import { upload, uploadToCloudinary } from "../../config/uploadMiddleWare";
import { DoctorUseCaseImpl } from "../../domain/use-cases/doctorUsecase";
import { authMiddleWare } from "./authRouterSetup";
import { checkRolesAndPermissions } from "../../middlewares/roleBasedAuthMiddleware";
import { ConsultaionModel } from "../../data/data-sources/mongodb/mongodbConsultationDataSource";
import { ConsultationRepoImpl } from "../../domain/repositories/consultationRepository";
import { ConsultationUseCaseImpl } from "../../domain/use-cases/consultationUsecase";
import { ConsultationController } from "../controllers/consultationController";
import { WalletDataSource } from "../../data/data-sources/mongodb/mongodbWalletDataSource";
import { NotificationDataSource } from "../../data/data-sources/mongodb/mongodbNotificationDataSource";
import { NotificationRepository } from "../../domain/repositories/notificationRepository";
import { NotificationUsecase } from "../../domain/use-cases/notifyUsecase";
import { NotificationController } from "../controllers/notificationController";
import { WalletRepository } from "../../domain/repositories/walletRepository";
import { walletUseCase } from "../../domain/use-cases/walletUsecase";
import { WalletController } from "../controllers/walletController";
export const doctorRouter = Router();

const doctorDataSource = new MongoDbDoctorDataSourceImpl();
const doctorRepo = new IDoctorRepositoryImpl(doctorDataSource);
const otpRepositoryImpl =  new OTPRepsositoryImpl(new MongoDbOtpDataSource())
const doctorServices = new DoctorUseCaseImpl(doctorRepo,otpRepositoryImpl);

const notificationDataSource = new NotificationDataSource();
const notificationRepository = new NotificationRepository(notificationDataSource);
const notificationUsecase = new NotificationUsecase(notificationRepository);
const notifcationController = new NotificationController(notificationUsecase);

const ConsultaionDataSource = new ConsultaionModel(new WalletDataSource());
const consultationRepo = new ConsultationRepoImpl(ConsultaionDataSource);
const consultationUsecase = new ConsultationUseCaseImpl(consultationRepo,notificationRepository);
const consultationController = new ConsultationController(consultationUsecase);

const walletRepo = new WalletRepository(new WalletDataSource());
const walletUsecase = new walletUseCase(walletRepo);
const walletController = new WalletController(walletUsecase);


doctorRouter.post('/register/basic-info',registerBasicInfo(doctorServices));

doctorRouter.post('/login',login(doctorServices));

doctorRouter.post('/complete-professional-info',authMiddleWare.isAuthenticated.bind(authMiddleWare),upload.array('certifications',5),uploadToCloudinary, registerProfessionalInfo(doctorServices));
doctorRouter.post('/complete-additional-info',authMiddleWare.isAuthenticated.bind(authMiddleWare), registerAdditionalInfo(doctorServices));

doctorRouter.post('/forgot-password', forgotPassword(doctorServices));
doctorRouter.post('/reset-password/:token', resetPassword(doctorServices));

doctorRouter.get('/get-doctor/:doctorId',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions([ 'Admin','User'], 'READ'),getDoctorById(doctorServices))

doctorRouter.patch('/verify-profile/:doctorId',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions([ 'Admin'], 'WRITE'),VerifyProfile(doctorServices));

doctorRouter.get('/get-doctors',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['User','Admin',"Doctor"], 'READ'),getDoctors(doctorServices));

doctorRouter.get('/get-currentDoctor',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions([ 'Doctor'], 'READ'),getCurrentDoctor(doctorServices))

doctorRouter.patch('/change-profile-pic',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions([ 'Doctor'], 'READ'),upload.single('profilePic'),uploadToCloudinary,updateDoctorProfilePic(doctorServices))

doctorRouter.post('/save-slots',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['Doctor'], 'WRITE'),saveSelectedSlots(doctorServices));


doctorRouter.get('/get-doctor-appoinments',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['Doctor'], 'READ'),consultationController.getDoctorAppoinments.bind(consultationController));

doctorRouter.put('/change-appoinmentStatus/:appointmentId',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['Doctor'], 'READ'),consultationController.changeAppoinmentStatusByDoctor.bind(consultationController))

// doctorRouter.get('/get-booked-slots',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['Doctor'], 'READ'),getBookedSlots(doctorServices));

doctorRouter.get('/get-notification',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['Doctor'], 'READ'),notifcationController.getNotificationOfUser.bind(notifcationController))


doctorRouter.get('/get-similar-profiles/:specializationId',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['Doctor','User'], 'READ'),getSimilarProfilesOfDoctors(doctorServices))

doctorRouter.get('/toggle-follow/:doctorId',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['Doctor','User'], 'READ'),followOrUnfollowDoctors(doctorServices))


doctorRouter.post('/add-review-rating/:appoinmentId',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['User'], 'READ'),addReviewAndRatingOfDoctors(doctorServices))

doctorRouter.post('/add-prescritption/:appoinmentId',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['Doctor'], 'READ'),upload.single('prescription'),uploadToCloudinary,consultationController.savePrescriptionOfPatients.bind(consultationController))

doctorRouter.put('/change-cancel-request-status/:appointmentId',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['Doctor'], 'READ'),consultationController.ChangeStatusOfappoinmentCancellationRequest.bind(consultationController))

doctorRouter.get('/get-wallet',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['Doctor'], 'READ'),walletController.getUserWallet.bind(walletController))

doctorRouter.get('/get-transaction-graphdetails',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['Doctor'], 'READ'),walletController.getTransactionGraphDetails.bind(walletController))

doctorRouter.get('/get-doctor-dashboarddetails',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['Doctor'], 'READ'),getDoctorDashBoardDetails(doctorServices))

doctorRouter.get('/get-reviews-doctor/:doctorId',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['User'], 'READ'),getDoctorReviews(doctorServices))


export default doctorRouter;
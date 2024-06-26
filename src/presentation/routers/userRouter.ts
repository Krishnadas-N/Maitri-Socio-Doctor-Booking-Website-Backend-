

import { MongoDbOtpDataSource } from "../../data/data-sources/mongodb/mongodbOtpDataSource" 
import { MongoDbUserDataSource } from "../../data/data-sources/mongodb/mongodbUserDataSource" 
import { OTPRepsositoryImpl } from "../../domain/repositories/otpRepository" 
import { UserRepository } from "../../domain/repositories/userRepository" 
import { UserUseCase } from "../../domain/use-cases/userUsecase" 
import { SignupValidateUser,loginValidateUser } from "../../middlewares/requestValidation" 
import {  UserController } from "../controllers/userController" 
import { Router } from "express";
import { authMiddleWare } from "./authRouterSetup" 
import { checkRolesAndPermissions } from "../../middlewares/roleBasedAuthMiddleware"
import { InterestedDoctorsRepoImpl } from "../../domain/repositories/interestedDoctorsRepository" 
import { InterestedDoctorsDataSource } from "../../data/data-sources/mongodb/mongodbInterestedDataSource" 
import { InterestedDoctors } from "../../domain/use-cases/InterestedDoctorsUsecase" 
import { addToInterest, getInterests, removeInterest  } from "../controllers/doctorInterestsController" 
import { upload, uploadToCloudinary } from "../../config/uploadMiddleWare" 
import { ConsultaionModel } from "../../data/data-sources/mongodb/mongodbConsultationDataSource" 
import { ConsultationRepoImpl } from "../../domain/repositories/consultationRepository" 
import { ConsultationUseCaseImpl } from "../../domain/use-cases/consultationUsecase" 
import { ConsultationController } from "../controllers/consultationController" 
import { WalletDataSource } from "../../data/data-sources/mongodb/mongodbWalletDataSource"
import { WalletRepository } from "../../domain/repositories/walletRepository" 
import { walletUseCase } from "../../domain/use-cases/walletUsecase" 
import { WalletController } from "../controllers/walletController" 
import { NotificationDataSource } from "../../data/data-sources/mongodb/mongodbNotificationDataSource"
import { NotificationUsecase } from "../../domain/use-cases/notifyUsecase"
import { NotificationRepository } from "../../domain/repositories/notificationRepository"
import { NotificationController } from "../controllers/notificationController"
export const userRouter = Router();

const userRepositoryImpl = new UserRepository(new MongoDbUserDataSource())
const otpRepsositoryImpl = new OTPRepsositoryImpl(new MongoDbOtpDataSource()) 
const userService = new UserUseCase(userRepositoryImpl,otpRepsositoryImpl);
const userController = new UserController(userService);

const interestsDoctorsDataSource =  new InterestedDoctorsDataSource()
const IntersetedDoctorsRepo = new InterestedDoctorsRepoImpl(interestsDoctorsDataSource);
const InterestedDoctorsUseCase = new InterestedDoctors(IntersetedDoctorsRepo);

const notificationDataSource = new NotificationDataSource();
const notificationRepository = new NotificationRepository(notificationDataSource);
const notificationUsecase = new NotificationUsecase(notificationRepository);
const notifcationController = new NotificationController(notificationUsecase);


const consultaionDataSource = new ConsultaionModel(new WalletDataSource());
const consultationRepo = new ConsultationRepoImpl(consultaionDataSource);
const consultationUsecase = new ConsultationUseCaseImpl(consultationRepo,notificationRepository);
const consultationController = new ConsultationController(consultationUsecase);

const walletRepo = new WalletRepository(new WalletDataSource());
const walletUsecase = new walletUseCase(walletRepo);
const walletController = new WalletController(walletUsecase);

userRouter.post('/login',userController.loginUser.bind(userController));


userRouter.post('/social-login',userController.socialLogin.bind(userController));




userRouter.post('/register',SignupValidateUser,userController.signupUser.bind(userController));

userRouter.get('/profile',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['User'], 'READ'),userController.getUserProfile.bind(userController));

userRouter.post('/forgot-password', userController.forgotPassword.bind(userController)); 

userRouter.post('/reset-password/:token', userController.resetPassword.bind(userController)); 

userRouter.patch('/change-status/:userId',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions([ 'Admin'], 'READ'),userController.BlockOrUnBlokUser.bind(userController));

userRouter.get('/get-byId/:userId',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['User','Doctor', 'Admin'], 'READ'),userController.getUserById.bind(userController));

userRouter.put('/edit-profile',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['User'], 'READ'),userController.editUserProfile.bind(userController));

userRouter.post('/addToInterest/:doctorId',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['User'], 'READ'),addToInterest(InterestedDoctorsUseCase));

userRouter.delete('/removeInterest/:doctorId',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['User'], 'READ'),removeInterest(InterestedDoctorsUseCase));

userRouter.get('/get-doctor-interests',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['User'], 'READ'),getInterests(InterestedDoctorsUseCase))

userRouter.patch('/change-profilePic',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['User'], 'READ'),upload.single('profilePic'),uploadToCloudinary,userController.ChangeUserProfile.bind(userController))

userRouter.get('/change-password',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['User'], 'READ'),userController.changePassword.bind(userController));

userRouter.post('/make-appointment/:doctorId',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['User'], 'READ'),consultationController.makeAnAppoinment.bind(consultationController))

userRouter.get('/get-appoinment/:appoinmentId',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['User'], 'READ'),consultationController.getAppoinmentDetails.bind(consultationController));

userRouter.post('/make-payment/:appoinmentId',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['User'], 'READ'),consultationController.createPayment.bind(consultationController));

userRouter.post('/verify-payment/:appointmentId',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['User'], 'READ'),consultationController.verifyWebhook.bind(consultationController));

userRouter.get('/get-appoinments',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['User'], 'READ'),consultationController.getUserAppoinments.bind(consultationController));


userRouter.put('/cancel-appoinment/:appointmentId',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['User'], 'READ'),consultationController.userRequestToCancelAppoinment.bind(consultationController));

userRouter.get('/get-booked-slots/:doctorId',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['User'], 'READ'),consultationController.getDoctorAvailableSlots.bind(consultationController));

userRouter.get('/get-doctors',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['User'], 'READ'),consultationController.getDoctors.bind(consultationController))

userRouter.get('/get-wallet',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['User'], 'READ'),walletController.getUserWallet.bind(walletController))

userRouter.post('/medical-records',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['User'], 'READ'),upload.single('file'),uploadToCloudinary,userController.addUserMedicalRecord.bind(userController));

userRouter.get('/medical-records',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['User'], 'READ'),userController.getUserMedicalRecords.bind(userController));

userRouter.get('/refresh-token',userController.getUserTokenByRefreshing.bind(userController))


userRouter.get('/get-notifications',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['User'], 'READ'),notifcationController.getNotificationOfUser.bind(notifcationController))


userRouter.delete('/delete-medical-record/:recordId',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['User'], 'READ'),userController.deleteMedicalRecord.bind(userController))


userRouter.get('/get-userPrescriptions',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['User'], 'READ'),consultationController.getPrescriptionsOfUser.bind(consultationController))

userRouter.post('/submit-survey',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['User'], 'READ'),userController.surveyAnalizing.bind(userController))


userRouter.get('/get-wallet-balance',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['User'], 'READ'),walletController.getWalletBalanceOfUser.bind(walletController))

userRouter.get('/get-category-doctors',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['User'], 'READ'),userController.getDoctorsByCategories.bind(userController));

export default userRouter;
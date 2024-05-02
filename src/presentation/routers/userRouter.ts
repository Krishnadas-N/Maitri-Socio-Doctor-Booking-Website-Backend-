

import { MongoDbOtpDataSource } from "../../data/data-sources/mongodb/mongodb-otp-dataSource";
import { MongoDbUserDataSource } from "../../data/data-sources/mongodb/mongodb-user-dataSource";
import { OTPRepsositoryImpl } from "../../domain/repositories/otp-repository";
import { UserAuthenticationRepoImpl } from "../../domain/repositories/user-repository";
import { UserUseCaseImpl } from "../../domain/use-cases/User-UsecaseImpl/userServiceImpl";
import { userLogin } from "../../domain/use-cases/authentication/user-login";
import { userSignup } from "../../domain/use-cases/authentication/user-signup";
import { SignupValidateUser, loginValidateUser } from "../../middlewares/requestValidation";
import { signupController,loginController, UserController } from "../controllers/userController";
import { Router } from "express";
import { authMiddleWare } from "./authRouterSetup";
import { checkRolesAndPermissions } from "../../middlewares/roleBasedAuthMiddleware";
import { InterestedDoctorsRepoImpl } from "../../domain/repositories/interestedDoctorsRepoImpl";
import { InterestedDoctorsDataSource } from "../../data/data-sources/mongodb/mongodb-interestedDoctors-datasource";
import { InterestedDoctors } from "../../domain/use-cases/User-UsecaseImpl/InterestedDoctorsServiceimpl";
import { addToInterest, getInterests, removeInterest } from "../controllers/DoctorInterestsController";
import { upload, uploadToCloudinary } from "../../../config/uploadMiddleWare";
import { ConsultaionModel } from "../../data/data-sources/mongodb/mongodb-Consultation-dataSource";
import { ConsultationRepoImpl } from "../../domain/repositories/consultation-repoImpl";
import { ConsultationUseCaseImpl } from "../../domain/use-cases/Consultaiton/consultation-usecaseImpl";
import { ConsultationController } from "../controllers/consultationController";
export const userRouter = Router();


const userRepositoryImpl = new UserAuthenticationRepoImpl(new MongoDbUserDataSource())
const otpRepsositoryImpl = new OTPRepsositoryImpl(new MongoDbOtpDataSource()) 
const loginUseCase = new userLogin(userRepositoryImpl);
const signupUseCase  = new userSignup(userRepositoryImpl,otpRepsositoryImpl);
const userService = new UserUseCaseImpl(userRepositoryImpl);
const userController = new UserController(userService);

const interestsDoctorsDataSource =  new InterestedDoctorsDataSource()
const IntersetedDoctorsRepo = new InterestedDoctorsRepoImpl(interestsDoctorsDataSource);
const InterestedDoctorsUseCase = new InterestedDoctors(IntersetedDoctorsRepo);

const ConsultaionDataSource = new ConsultaionModel();
const consultationRepo = new ConsultationRepoImpl(ConsultaionDataSource);
const consultationUsecase = new ConsultationUseCaseImpl(consultationRepo);
const consultationController = new ConsultationController(consultationUsecase);

userRouter.post('/login',loginValidateUser,loginController(loginUseCase));

userRouter.post('/register',SignupValidateUser,signupController(signupUseCase));

userRouter.get('/profile',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['User'], 'READ'),userController.getUserProfile.bind(userController));

userRouter.post('/forgot-password', userController.forgotPassword.bind(userController)); 

userRouter.post('/reset-password/:token', userController.resetPassword.bind(userController)); 

userRouter.get('/get-Users',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions([ 'Admin','User'], 'READ'),userController.getAllUsers.bind(userController))

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


userRouter.put('/change-appoinment-status/:appointmentId',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['User'], 'READ'),consultationController.getUserAppoinments.bind(consultationController));

userRouter.get('/get-booked-slots/:doctorId',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['User'], 'READ'),consultationController.getDoctorAvailableSlots.bind(consultationController));

userRouter.get('/get-doctors',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['User'], 'READ'),consultationController.getDoctors.bind(consultationController))

export default userRouter;
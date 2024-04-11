

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
export const userRouter = Router();


const userRepositoryImpl = new UserAuthenticationRepoImpl(new MongoDbUserDataSource())
const otpRepsositoryImpl = new OTPRepsositoryImpl(new MongoDbOtpDataSource()) 
const loginUseCase = new userLogin(userRepositoryImpl);
const signupUseCase  = new userSignup(userRepositoryImpl,otpRepsositoryImpl);
const userService = new UserUseCaseImpl(userRepositoryImpl);
const userController = new UserController(userService)

userRouter.post('/login',loginValidateUser,loginController(loginUseCase));

userRouter.post('/register',SignupValidateUser,signupController(signupUseCase));

userRouter.get('/profile/:userId',authMiddleWare.isAuthenticated,userController.getUserProfile);

userRouter.post('/forgot-password', userController.forgotPassword.bind(userController)); 

userRouter.post('/reset-password/:token', userController.resetPassword.bind(userController)); 

userRouter.get('/get-Users',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions([ 'Admin','User'], 'READ'),userController.getAllUsers.bind(userController))

userRouter.patch('/change-status/:userId',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions([ 'Admin'], 'READ'),userController.BlockOrUnBlokUser.bind(userController));

userRouter.get('/get-byId/:userId',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['User','Doctor', 'Admin'], 'READ'),userController.getUserById.bind(userController));

export default userRouter;
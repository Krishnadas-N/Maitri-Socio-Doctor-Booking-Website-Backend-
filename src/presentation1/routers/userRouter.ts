

import { MongoDbOtpDataSource } from "../../data1/data-sources/mongodb/mongodb-otp-dataSource";
import { MongoDbUserDataSource } from "../../data1/data-sources/mongodb/mongodb-user-dataSource";
import { OTPRepsositoryImpl } from "../../domain1/repositories/otp-repository";
import { UserAuthenticationRepoImpl } from "../../domain1/repositories/user-repository";
import { UserUseCaseImpl } from "../../domain1/use-cases/User-UsecaseImpl/userServiceImpl";
import { userLogin } from "../../domain1/use-cases/authentication/user-login";
import { userSignup } from "../../domain1/use-cases/authentication/user-signup";
import { verifyUserMiddleware } from "../../middlewares/authentication";
import { SignupValidateUser, loginValidateUser } from "../../middlewares/requestValidation";
import { signupController,loginController, UserController } from "../controllers/userController";
import { Router } from "express";
export const userRouter = Router();


const userRepositoryImpl = new UserAuthenticationRepoImpl(new MongoDbUserDataSource())
const otpRepsositoryImpl = new OTPRepsositoryImpl(new MongoDbOtpDataSource()) 
const loginUseCase = new userLogin(userRepositoryImpl);
const signupUseCase  = new userSignup(userRepositoryImpl,otpRepsositoryImpl);
const userService = new UserUseCaseImpl(userRepositoryImpl);
const userController = new UserController(userService)

userRouter.post('/login',loginValidateUser,loginController(loginUseCase));

userRouter.post('/register',SignupValidateUser,signupController(signupUseCase));

userRouter.get('/profile/:userId',verifyUserMiddleware(userService),userController.getUserProfile);


export default userRouter;
import { Router } from "express";
import { UserController } from "../controllers/user-controller";
import { InMemoryUserRepository } from "../../../database/mongoose/user-repository";
import { UserAuthentication } from "../../../../core/use-cases/UserAuthentication-Use-case";
import { SignupValidateUser, loginValidateUser } from "../../../../middlewares/requestValidation";

export const userRouter = Router();


const userRepository = new  InMemoryUserRepository();
const authenticationService = new UserAuthentication(userRepository);
const controller = new UserController(authenticationService);



userRouter.post('/register',SignupValidateUser,controller.login);

userRouter.post('/login',loginValidateUser,controller.login) ;
import { Router } from "express";
import { AdminDataSource } from "../../data/data-sources/mongodb/mongodbAdminDataSource"; 
import { AdminRepository } from "../../domain/repositories/adminRepository"; 
import { AdminUsecase } from "../../domain/use-cases/adminUsecase";
import { AdminController } from "../controllers/adminController";
import { authMiddleWare } from "./authRouterSetup";
import { checkRolesAndPermissions } from "../../middlewares/roleBasedAuthMiddleware";

export const adminRouter = Router();

const adminDataSource = new AdminDataSource();
const adminRepository = new AdminRepository(adminDataSource);
const adminUsecase = new AdminUsecase(adminRepository);
const adminController = new AdminController(adminUsecase);

adminRouter.post('/register',adminController.createAdmin.bind(adminController));

adminRouter.post('/login',adminController.adminLogin.bind(adminController))

adminRouter.get('/get-by-email',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['Admin'], 'READ'),adminController.getAdminByEmail.bind(adminController));

adminRouter.get('/',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['Admin'], 'READ'),adminController.getAdminById.bind(adminController));

adminRouter.get('/get-by-username',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['Admin'], 'READ'),adminController.getAdminByUsername.bind(adminController))
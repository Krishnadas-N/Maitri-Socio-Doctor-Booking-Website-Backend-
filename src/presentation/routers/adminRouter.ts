import { Router } from "express";
import { AdminDataSource } from "../../data/data-sources/mongodb/mongodb-admin-dataSource";
import { AdminRepoImpl } from "../../domain/repositories/admin-repoImpl";
import { AdminUsecaseImpl } from "../../domain/use-cases/Admin/admin-usecaseImpl";
import { AdminController } from "../controllers/adminController";
import { authMiddleWare } from "./authRouterSetup";
import { checkRolesAndPermissions } from "../../middlewares/roleBasedAuthMiddleware";

export const adminRouter = Router();

const adminDataSource = new AdminDataSource();
const adminRepository = new AdminRepoImpl(adminDataSource);
const adminUsecase = new AdminUsecaseImpl(adminRepository);
const adminController = new AdminController(adminUsecase);

adminRouter.post('/register',adminController.createAdmin.bind(adminController));

adminRouter.post('/login',adminController.adminLogin.bind(adminController))

adminRouter.get('/get-by-email',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['Admin'], 'READ'),adminController.getAdminByEmail.bind(adminController));

adminRouter.get('/',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['Admin'], 'READ'),adminController.getAdminById.bind(adminController));

adminRouter.get('/get-by-username',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['Admin'], 'READ'),adminController.getAdminByUsername.bind(adminController))
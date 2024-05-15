"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
const express_1 = require("express");
const mongodbAdminDataSource_1 = require("../../data/data-sources/mongodb/mongodbAdminDataSource");
const adminRepository_1 = require("../../domain/repositories/adminRepository");
const adminUsecase_1 = require("../../domain/use-cases/adminUsecase");
const adminController_1 = require("../controllers/adminController");
const authRouterSetup_1 = require("./authRouterSetup");
const roleBasedAuthMiddleware_1 = require("../../middlewares/roleBasedAuthMiddleware");
exports.adminRouter = (0, express_1.Router)();
const adminDataSource = new mongodbAdminDataSource_1.AdminDataSource();
const adminRepository = new adminRepository_1.AdminRepository(adminDataSource);
const adminUsecase = new adminUsecase_1.AdminUsecase(adminRepository);
const adminController = new adminController_1.AdminController(adminUsecase);
exports.adminRouter.post('/register', adminController.createAdmin.bind(adminController));
exports.adminRouter.post('/login', adminController.adminLogin.bind(adminController));
exports.adminRouter.get('/get-by-email', authRouterSetup_1.authMiddleWare.isAuthenticated.bind(authRouterSetup_1.authMiddleWare), (0, roleBasedAuthMiddleware_1.checkRolesAndPermissions)(['Admin'], 'READ'), adminController.getAdminByEmail.bind(adminController));
exports.adminRouter.get('/', authRouterSetup_1.authMiddleWare.isAuthenticated.bind(authRouterSetup_1.authMiddleWare), (0, roleBasedAuthMiddleware_1.checkRolesAndPermissions)(['Admin'], 'READ'), adminController.getAdminById.bind(adminController));
exports.adminRouter.get('/get-by-username', authRouterSetup_1.authMiddleWare.isAuthenticated.bind(authRouterSetup_1.authMiddleWare), (0, roleBasedAuthMiddleware_1.checkRolesAndPermissions)(['Admin'], 'READ'), adminController.getAdminByUsername.bind(adminController));
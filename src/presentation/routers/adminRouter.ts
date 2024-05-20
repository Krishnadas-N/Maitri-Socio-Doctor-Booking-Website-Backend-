import { Router } from "express";
import { AdminDataSource } from "../../data/data-sources/mongodb/mongodbAdminDataSource"; 
import { AdminRepository } from "../../domain/repositories/adminRepository"; 
import { AdminUsecase } from "../../domain/use-cases/adminUsecase";
import { AdminController } from "../controllers/adminController";
import { authMiddleWare } from "./authRouterSetup";
import { checkRolesAndPermissions } from "../../middlewares/roleBasedAuthMiddleware";
import { NotificationDataSource } from "../../data/data-sources/mongodb/mongodbNotificationDataSource"
import { NotificationUsecase } from "../../domain/use-cases/notifyUsecase"
import { NotificationRepository } from "../../domain/repositories/notificationRepository"
import { NotificationController } from "../controllers/notificationController"
export const adminRouter = Router();


const notificationDataSource = new NotificationDataSource();
const notificationRepository = new NotificationRepository(notificationDataSource);
const notificationUsecase = new NotificationUsecase(notificationRepository);
const notifcationController = new NotificationController(notificationUsecase);

const adminDataSource = new AdminDataSource();
const adminRepository = new AdminRepository(adminDataSource);
const adminUsecase = new AdminUsecase(adminRepository);
const adminController = new AdminController(adminUsecase);

adminRouter.post('/register',adminController.createAdmin.bind(adminController));

adminRouter.post('/login',adminController.adminLogin.bind(adminController))

adminRouter.get('/get-by-email',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['Admin'], 'READ'),adminController.getAdminByEmail.bind(adminController));

adminRouter.get('/',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['Admin'], 'READ'),adminController.getAdminById.bind(adminController));

adminRouter.get('/get-by-username',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['Admin'], 'READ'),adminController.getAdminByUsername.bind(adminController))

adminRouter.get('/get-doctors',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['Admin'], 'READ'),adminController.getDoctors.bind(adminController))

adminRouter.put('/change-status/:doctorId',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions([ 'Admin'], 'WRITE'),adminController.changeStatus.bind(adminController));


adminRouter.get('/get-Users',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions([ 'Admin'], 'READ'),adminController.getAllUsers.bind(adminController))


adminRouter.patch('/change-status/:userId',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions([ 'Admin'], 'READ'),adminController.BlockOrUnBlokUser.bind(adminController));

adminRouter.get('/get-specialized-doctors/:specId',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions([ 'Admin',], 'READ'),adminController.getDoctorsBySpecialization.bind(adminController))

adminRouter.get('/get-admin-dashboard',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions([ 'Admin',], 'READ'),adminController.getAdminDashboardDetails.bind(adminController))

adminRouter.get('/dashboard-users-doctors-summary',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions([ 'Admin',], 'READ'),adminController.getAdminDashboardUserDoctorDetails.bind(adminController))


adminRouter.get('/get-appointment-details',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions([ 'Admin',], 'READ'),adminController.getAppoinmentListDetails.bind(adminController))

adminRouter.get('/get-admin-wallet',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['Admin'], 'READ'),adminController.getAdminWallet.bind(adminController))

adminRouter.get('/get-transaction-graphdetails',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['Admin'], 'READ'),adminController.getAdminTransactionGraphDetails.bind(adminController))


adminRouter.get('/get-appointment/:appointmentId',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['Admin'], 'READ'),adminController.getAppointmentDetailsByAdmin.bind(adminController))

adminRouter.get('/get-reviews',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['Admin'], 'READ'),adminController.getReviewDetailsByAdmin.bind(adminController))


adminRouter.delete('/delete-review/:revId',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['Admin'], 'READ'),adminController.deleteRevewByAdmin.bind(adminController))

adminRouter.get('/get-notifications',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions(['Admin'], 'READ'),notifcationController.getNotificationOfUser.bind(notifcationController))

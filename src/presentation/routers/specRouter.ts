

import { Router } from "express";
import { DoctorServiceImpl } from "../../domain/use-cases/Specialization/specializationServiceImpl";
import { IDoctorSpecializtionRepoImpl } from "../../domain/repositories/specialization-repository";
import { MongoDbDoctorSpecializtionDataSource } from "../../data/data-sources/mongodb/mongodb-specialization-dataSource";
import { SpecializationController } from "../controllers/specializationController";
import { checkRolesAndPermissions } from "../../middlewares/roleBasedAuthMiddleware";
import { authMiddleWare } from "./authRouterSetup";
const specRouter = Router();


const doctorSpecDataSource = new MongoDbDoctorSpecializtionDataSource();
const doctorSpecRepo = new IDoctorSpecializtionRepoImpl(doctorSpecDataSource);
const doctorSpecService = new DoctorServiceImpl(doctorSpecRepo);
const specializationsController = new SpecializationController(doctorSpecService);

specRouter.post('/',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions([ 'Admin'], 'WRITE'),specializationsController.addSpec.bind(specializationsController));
specRouter.get('/',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions([ 'Admin','Doctor'], 'READ'),specializationsController.getAllSpec.bind(specializationsController))
specRouter.get('/:id',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions([ 'Admin'], 'READ'), specializationsController.findASpec.bind(specializationsController));

specRouter.put('/updateSpec/:id',authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions([ 'Admin'], 'WRITE'),specializationsController.updateSpec.bind(specializationsController));
specRouter.patch('/change-status/:id', authMiddleWare.isAuthenticated.bind(authMiddleWare),checkRolesAndPermissions([ 'Admin'], 'WRITE'),specializationsController.blockSpec.bind(specializationsController));




export default specRouter;
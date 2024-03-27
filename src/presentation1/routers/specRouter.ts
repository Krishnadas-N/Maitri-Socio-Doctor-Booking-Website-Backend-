

import { Router } from "express";
import { DoctorServiceImpl } from "../../domain1/use-cases/Specialization/specializationServiceImpl";
import { IDoctorSpecializtionRepoImpl } from "../../domain1/repositories/specialization-repository";
import { MongoDbDoctorSpecializtionDataSource } from "../../data1/data-sources/mongodb/mongodb-specialization-dataSource";
import { SpecializationController } from "../controllers/specializationController";
export const specRouter = Router();


const doctorSpecDataSource = new MongoDbDoctorSpecializtionDataSource();
const doctorSpecRepo = new IDoctorSpecializtionRepoImpl(doctorSpecDataSource);
const doctorSpecService = new DoctorServiceImpl(doctorSpecRepo);
const specializationsController = new SpecializationController(doctorSpecService);

specRouter.post('/',specializationsController.addSpec.bind(specializationsController));
specRouter.get('/',specializationsController.getAllSpec.bind(specializationsController))
specRouter.get('/:id', specializationsController.findASpec.bind(specializationsController));

specRouter.put('/updateSpec/:id',specializationsController.updateSpec.bind(specializationsController));
specRouter.patch('/:id', specializationsController.blockSpec.bind(specializationsController));




export default specRouter;
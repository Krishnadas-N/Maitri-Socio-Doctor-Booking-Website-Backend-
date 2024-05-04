import { Router } from "express";
import { DoctorServiceImpl } from "../../domain/use-cases/specializationUsecase";
import { IDoctorSpecializtionRepoImpl } from "../../domain/repositories/specializationRepository";
import { MongoDbDoctorSpecializtionDataSource } from "../../data/data-sources/mongodb/mongodbSpecializationDataSources";
import { SpecializationController } from "../controllers/specializationController";
import { checkRolesAndPermissions } from "../../middlewares/roleBasedAuthMiddleware";
import { authMiddleWare } from "./authRouterSetup";
const specRouter = Router();

const doctorSpecDataSource = new MongoDbDoctorSpecializtionDataSource();
const doctorSpecRepo = new IDoctorSpecializtionRepoImpl(doctorSpecDataSource);
const doctorSpecService = new DoctorServiceImpl(doctorSpecRepo);
const specializationsController = new SpecializationController(
  doctorSpecService
);

specRouter.post(
  "/",
  authMiddleWare.isAuthenticated.bind(authMiddleWare),
  checkRolesAndPermissions(["Admin"], "WRITE"),
  specializationsController.addSpec.bind(specializationsController)
);
specRouter.get(
  "/",
  authMiddleWare.isAuthenticated.bind(authMiddleWare),
  checkRolesAndPermissions(["Admin", "Doctor","User"], "READ"),
  specializationsController.getAllSpec.bind(specializationsController)
);
specRouter.get(
  "/:id",
  authMiddleWare.isAuthenticated.bind(authMiddleWare),
  checkRolesAndPermissions(["Admin"], "READ"),
  specializationsController.findASpec.bind(specializationsController)
);

specRouter.put(
  "/updateSpec/:id",
  authMiddleWare.isAuthenticated.bind(authMiddleWare),
  checkRolesAndPermissions(["Admin"], "WRITE"),
  specializationsController.updateSpec.bind(specializationsController)
);
specRouter.patch(
  "/change-status/:id",
  authMiddleWare.isAuthenticated.bind(authMiddleWare),
  checkRolesAndPermissions(["Admin"], "WRITE"),
  specializationsController.blockSpec.bind(specializationsController)
);

export default specRouter;

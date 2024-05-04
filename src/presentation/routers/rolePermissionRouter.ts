import { Router } from "express";
import { RoleModelImpl } from "../../data/data-sources/mongodb/mongodbRolePermissionDataSource";
import { RoleRepository } from "../../domain/repositories/rolePermissionRepository";
import { RoleUseCase } from "../../domain/use-cases/roleUsecase";
import { RoleController } from "../controllers/roleController";
export const roleRouter = Router();


const roleDataSource = new RoleModelImpl();
const roleRepository = new RoleRepository(roleDataSource)
const roleUseCase = new RoleUseCase(roleRepository);
const roleController = new RoleController(roleUseCase);

roleRouter.post('/', roleController.createRole.bind(roleController));
roleRouter.delete('/:id', roleController.deleteRole.bind(roleController));
roleRouter.get('/', roleController.getAllRoles.bind(roleController));
roleRouter.get('/roles/:id', roleController.getRoleDetails.bind(roleController));
roleRouter.put('/roles/:id', roleController.updateRoleDetails.bind(roleController));
roleRouter.post('/users/:userId/roles', roleController.assignRolesToUser.bind(roleController));
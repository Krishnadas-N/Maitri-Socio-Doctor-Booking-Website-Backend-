import { Request, Response,NextFunction } from 'express';
import { IRolePermissionUseCase } from '../../domain/interfaces/use-cases/rolePermissionIUsecase'; 
import { CustomError } from '../../utils/customError'; 
import { sendSuccessResponse } from '../../utils/reponseHandler'; 

export class RoleController {
    constructor(private roleUseCase: IRolePermissionUseCase) {}

    async createRole(req: Request, res: Response,next:NextFunction): Promise<void> {
        try {
            const roleData = req.body;
            const newRole = await this.roleUseCase.createNewRole(roleData);
            sendSuccessResponse(res,newRole, "new Role created Successfully!" );
        } catch (error) {
            next(error);
        }
    }

    async deleteRole(req: Request, res: Response,next:NextFunction): Promise<void> {
        try {
            const roleId = req.params.id;
            const deletedRole = await this.roleUseCase.removeRole(roleId);
            if(!deletedRole){
                throw new CustomError("Role not found",404)
            }
            sendSuccessResponse(res,deletedRole, "Deleted Successfully!" );
        } catch (error) {
            next(error);
        }
    }

    async getAllRoles(req: Request, res: Response,next:NextFunction): Promise<void> {
        try {
            const roles = await this.roleUseCase.getAllRoles();
            sendSuccessResponse(res,roles, " Roles Retrieved  Successfully!" );
        } catch (error) {
            next(error);
        }
    }

    async getRoleDetails(req: Request, res: Response,next:NextFunction): Promise<void> {
        try {
            const roleId = req.params.id;
            const role = await this.roleUseCase.getRoleDetails(roleId);
            if (!role) {
                throw new CustomError("Role not found",404)
            }
            sendSuccessResponse(res,role, " Role Retrieved  Successfully!" );
        } catch (error) {
            next(error);
        }
    }

    async updateRoleDetails(req: Request, res: Response,next:NextFunction): Promise<void> {
        try {
            const roleId = req.params.id;
            const updatedData = req.body;
            const updatedRole = await this.roleUseCase.updateRoleDetails(roleId, updatedData);
            if (!updatedRole) {
                throw new CustomError("Role not found",404)
            } 
            sendSuccessResponse(res,updatedRole,"Updated Successfully!");
        } catch (error) {
            next(error);
        }
    }

    async assignRolesToUser(req: Request, res: Response,next:NextFunction): Promise<void> {
        try {
            const userId = req.params.userId;
            const roleIds = req.body.roleIds;
            await this.roleUseCase.assignRolesToUser(userId, roleIds);
            const message = `Roles Assigned to User with id ${userId} successfully!`;
            sendSuccessResponse(res,{message}, message);
        } catch (error) {
            next(error);
        }
    }
}

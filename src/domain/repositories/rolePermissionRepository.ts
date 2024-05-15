
import { IRole } from "../entities/Role";
import { IRoleRepository } from "../interfaces/repositoryInterfaces/rolePermissionIRepository"; 
import { RolePermissionModelIDataSource } from "../../data/interfaces/data-sources/rolePermissionIDataSource";
import { CustomError } from "../../utils/customError"; 

export class RoleRepository implements IRoleRepository {
    constructor(private roleModel: RolePermissionModelIDataSource) {}

    async createRole(roleData: Partial<IRole>): Promise<IRole> {
        try {
            console.log("Role Data From Database", roleData);
            const newRole = await this.roleModel.createRole(roleData);
            return newRole;
        } catch (error:unknown) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                const castedError = error as Error
          console.error('Unexpected error:', error);
          throw new CustomError(castedError.message || 'Internal server error',500);
            }
        }
    }

    async deleteRole(roleId: string): Promise<IRole | null> {
        try {
            const deletedRole = await this.roleModel.deleteRole(roleId);
            return deletedRole;
        } catch (error:unknown) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                const castedError = error as Error
          console.error('Unexpected error:', error);
          throw new CustomError(castedError.message || 'Internal server error',500);
            }
        }
    }

    async getAllRoles(): Promise<IRole[]> {
        try {
            const roles = await this.roleModel.getAllRoles();
            return roles;
        }catch (error:unknown) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                const castedError = error as Error
          console.error('Unexpected error:', error);
          throw new CustomError(castedError.message || 'Internal server error',500);
            }
        }
    }

    async getRoleById(roleId: string): Promise<IRole | null> {
        try {
            const role = await this.roleModel.getRoleById(roleId);
            return role;
        }catch (error:unknown) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                const castedError = error as Error
          console.error('Unexpected error:', error);
          throw new CustomError(castedError.message || 'Internal server error',500);
            }
        }
    }

    async updateRole(roleId: string, updatedData: Partial<IRole>): Promise<IRole | null> {
        try {
            const updatedRole = await this.roleModel.updateRole(roleId,updatedData);
            return updatedRole;
        } catch (error:unknown) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                const castedError = error as Error
          console.error('Unexpected error:', error);
          throw new CustomError(castedError.message || 'Internal server error',500);
            }
        }
    }

    async assignRolesToUser(userId: string, roleIds: string[]): Promise<void> {
        try {
           await this.roleModel.assignRolesToUser(userId,roleIds);
        }catch (error:unknown) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                const castedError = error as Error
          console.error('Unexpected error:', error);
          throw new CustomError(castedError.message || 'Internal server error',500);
            }
        }
    }
}

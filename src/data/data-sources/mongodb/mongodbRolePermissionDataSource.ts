import { CustomError } from "../../../utils/customError"; 
import { IRole } from "../../../domain/entities/Role";
import { RolePermissionModelIDataSource } from "../../interfaces/data-sources/rolePermissionIDataSource";
import {roleModel} from "./models/roleModel";
import { userModel } from "./models/userModel";


export class RoleModelImpl implements RolePermissionModelIDataSource{
    constructor(){}
    async createRole(roleData: Partial<IRole>): Promise<IRole> {
        try {
            console.log("Role Data From Database",roleData);
            const newRole = await roleModel.create(roleData);
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
            const deletedRole = await roleModel.findByIdAndDelete(roleId);
            return deletedRole;
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
    async getAllRoles(): Promise<IRole[]> {
        try {
            const roles = await roleModel.find({});
            return roles;
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
    async getRoleById(roleId: string): Promise<IRole | null> {
        try {
            const role = await roleModel.findById(roleId);
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
            const updatedRole = await roleModel.findByIdAndUpdate(roleId, updatedData, { new: true });
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
            // Update user document with new role IDs
            await userModel.findByIdAndUpdate(userId, { $set: { roles: roleIds } });
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
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
        } catch (error:any) {
            console.error("Error creating role:", error);
            throw new CustomError(error.message||"Failed to create role",500);
        }
    }
    async deleteRole(roleId: string): Promise<IRole | null> {
        try {
            const deletedRole = await roleModel.findByIdAndDelete(roleId);
            return deletedRole;
        } catch (error:any) {
            console.error("Error deleting role:", error);
            throw new CustomError(error.message||"Failed to delete role",500);
        }
    }
    async getAllRoles(): Promise<IRole[]> {
        try {
            const roles = await roleModel.find({});
            return roles;
        } catch (error:any) {
            console.error("Error fetching roles:", error);
            throw new CustomError(error.message||"Failed to fetch roles",500);
        }
    }
    async getRoleById(roleId: string): Promise<IRole | null> {
        try {
            const role = await roleModel.findById(roleId);
            return role;
        } catch (error:any) {
            console.error("Error fetching role by ID:", error);
            throw new CustomError(error.message||"Failed to fetch role b,500y ID",500);
        }
    }
    async updateRole(roleId: string, updatedData: Partial<IRole>): Promise<IRole | null> {
        try {
            const updatedRole = await roleModel.findByIdAndUpdate(roleId, updatedData, { new: true });
            return updatedRole;
        } catch (error:any) {
            console.error("Error updating role:", error);
            throw new CustomError(error.message||"Failed to update role",500);
        }

    }
    async assignRolesToUser(userId: string, roleIds: string[]): Promise<void> {
        try {
            // Update user document with new role IDs
            await userModel.findByIdAndUpdate(userId, { $set: { roles: roleIds } });
          } catch (error:any) {
            console.error("Error updating role:", error);
            throw new CustomError(error.message||"Failed to update role",500);
        }

    }
}
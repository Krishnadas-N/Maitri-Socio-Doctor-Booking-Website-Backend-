import { CustomError } from "../../../../utils/CustomError";
import { IRole } from "../../../domain/entities/Role";
import { IRoleModel } from "../../interfaces/data-sources/permissionRole-data-source";
import RoleModel from "./models/role-model";
import { UserModel } from "./models/user-model";
export class RoleModelImpl implements IRoleModel{
    constructor(){}
    async createRole(roleData: Partial<IRole>): Promise<IRole> {
        try {
            console.log("Role Data From Database",roleData);
            const newRole = await RoleModel.create(roleData);
            return newRole;
        } catch (error:any) {
            console.error("Error creating role:", error);
            throw new CustomError(error.message||"Failed to create role",500);
        }
    }
    async deleteRole(roleId: string): Promise<IRole | null> {
        try {
            const deletedRole = await RoleModel.findByIdAndDelete(roleId);
            return deletedRole;
        } catch (error:any) {
            console.error("Error deleting role:", error);
            throw new CustomError(error.message||"Failed to delete role",500);
        }
    }
    async getAllRoles(): Promise<IRole[]> {
        try {
            const roles = await RoleModel.find({});
            return roles;
        } catch (error:any) {
            console.error("Error fetching roles:", error);
            throw new CustomError(error.message||"Failed to fetch roles",500);
        }
    }
    async getRoleById(roleId: string): Promise<IRole | null> {
        try {
            const role = await RoleModel.findById(roleId);
            return role;
        } catch (error:any) {
            console.error("Error fetching role by ID:", error);
            throw new CustomError(error.message||"Failed to fetch role b,500y ID",500);
        }
    }
    async updateRole(roleId: string, updatedData: Partial<IRole>): Promise<IRole | null> {
        try {
            const updatedRole = await RoleModel.findByIdAndUpdate(roleId, updatedData, { new: true });
            return updatedRole;
        } catch (error:any) {
            console.error("Error updating role:", error);
            throw new CustomError(error.message||"Failed to update role",500);
        }

    }
    async assignRolesToUser(userId: string, roleIds: string[]): Promise<void> {
        try {
            // Update user document with new role IDs
            await UserModel.findByIdAndUpdate(userId, { $set: { roles: roleIds } });
          } catch (error:any) {
            console.error("Error updating role:", error);
            throw new CustomError(error.message||"Failed to update role",500);
        }

    }
}
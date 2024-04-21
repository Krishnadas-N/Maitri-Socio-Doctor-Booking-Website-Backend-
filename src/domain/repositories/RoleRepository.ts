
import { IRole } from "../entities/Role";
import { IRoleRepository } from "../interfaces/repositories/IRoleRepository";
import { IRoleModel } from "../../data/interfaces/data-sources/permissionRole-data-source";
import { CustomError } from "../../../utils/CustomError";

export class RoleRepository implements IRoleRepository {
    constructor(private roleModel: IRoleModel) {}

    async createRole(roleData: Partial<IRole>): Promise<IRole> {
        try {
            console.log("Role Data From Database", roleData);
            const newRole = await this.roleModel.createRole(roleData);
            return newRole;
        } catch (error:any) {
            console.error("Error creating role:", error);
            throw new CustomError(error.message || "Failed to create role", 500);
        }
    }

    async deleteRole(roleId: string): Promise<IRole | null> {
        try {
            const deletedRole = await this.roleModel.deleteRole(roleId);
            return deletedRole;
        } catch (error:any) {
            console.error("Error deleting role:", error);
            throw new CustomError(error.message || "Failed to delete role", 500);
        }
    }

    async getAllRoles(): Promise<IRole[]> {
        try {
            const roles = await this.roleModel.getAllRoles();
            return roles;
        } catch (error:any) {
            console.error("Error fetching roles:", error);
            throw new CustomError(error.message || "Failed to fetch roles", 500);
        }
    }

    async getRoleById(roleId: string): Promise<IRole | null> {
        try {
            const role = await this.roleModel.getRoleById(roleId);
            return role;
        } catch (error:any) {
            console.error("Error fetching role by ID:", error);
            throw new CustomError(error.message || "Failed to fetch role by ID", 500);
        }
    }

    async updateRole(roleId: string, updatedData: Partial<IRole>): Promise<IRole | null> {
        try {
            const updatedRole = await this.roleModel.updateRole(roleId,updatedData);
            return updatedRole;
        } catch (error:any) {
            console.error("Error updating role:", error);
            throw new CustomError(error.message || "Failed to update role", 500);
        }
    }

    async assignRolesToUser(userId: string, roleIds: string[]): Promise<void> {
        try {
           await this.roleModel.assignRolesToUser(userId,roleIds);
        } catch (error:any) {
            console.error("Error assigning roles to user:", error);
            throw new CustomError(error.message || "Failed to assign roles to user", 500);
        }
    }
}

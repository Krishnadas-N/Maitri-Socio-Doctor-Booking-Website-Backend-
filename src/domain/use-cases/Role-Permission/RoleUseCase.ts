import { CustomError } from "../../../../utils/CustomError";
import { IRole } from "../../entities/Role";
import { IRoleRepository } from "../../interfaces/repositories/IRoleRepository";
import { IRoleUseCase } from "../../interfaces/use-cases/Role-Service/IRoleUseCase";

export class RoleUseCase implements IRoleUseCase {
    constructor(private roleRepository: IRoleRepository) {}

    async createNewRole(roleData: Partial<IRole>): Promise<IRole> {
        try {
            return await this.roleRepository.createRole(roleData);
        } catch (error) {
            console.error("Error creating new role:", error);
            throw new CustomError("Failed to create new role", 500);
        }
    }

    async removeRole(roleId: string): Promise<IRole | null> {
        try {
            return await this.roleRepository.deleteRole(roleId);
        } catch (error) {
            console.error("Error removing role:", error);
            throw new CustomError("Failed to remove role", 500);
        }
    }

    async getAllRoles(): Promise<IRole[]> {
        try {
            return await this.roleRepository.getAllRoles();
        } catch (error) {
            console.error("Error fetching all roles:", error);
            throw new CustomError("Failed to fetch all roles", 500);
        }
    }

    async getRoleDetails(roleId: string): Promise<IRole | null> {
        try {
            return await this.roleRepository.getRoleById(roleId);
        } catch (error) {
            console.error("Error fetching role details:", error);
            throw new CustomError("Failed to fetch role details", 500);
        }
    }

    async updateRoleDetails(roleId: string, updatedData: Partial<IRole>): Promise<IRole | null> {
        try {
            return await this.roleRepository.updateRole(roleId, updatedData);
        } catch (error) {
            console.error("Error updating role details:", error);
            throw new CustomError("Failed to update role details", 500);
        }
    }

    async assignRolesToUser(userId: string, roleIds: string[]): Promise<void> {
        try {
            await this.roleRepository.assignRolesToUser(userId, roleIds);
        } catch (error) {
            console.error("Error assigning roles to user:", error);
            throw new CustomError("Failed to assign roles to user", 500);
        }
    }
}
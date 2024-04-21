import { IRole } from "../../../entities/Role";

export interface IRoleUseCase{
    createNewRole(roleData: Partial<IRole>): Promise<IRole>;
    removeRole(roleId: string): Promise<IRole | null>;
    getAllRoles(): Promise<IRole[]>;
    getRoleDetails(roleId: string): Promise<IRole | null>;
    updateRoleDetails(roleId: string, updatedData: Partial<IRole>): Promise<IRole | null>;
    assignRolesToUser(userId: string, roleIds: string[]): Promise<void>;
}
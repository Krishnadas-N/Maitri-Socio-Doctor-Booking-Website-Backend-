import { CustomError } from "../../../../utils/CustomError";
import { IRole } from "../../../domain/entities/Role";

export interface IRoleRepository {
    createRole(roleData: Partial<IRole>): Promise<IRole>;
    deleteRole(roleId: string): Promise<IRole | null>;
    getAllRoles(): Promise<IRole[]>;
    getRoleById(roleId: string): Promise<IRole | null>;
    updateRole(roleId: string, updatedData: Partial<IRole>): Promise<IRole | null>;
    assignRolesToUser(userId: string, roleIds: string[]): Promise<void>;
}

import {IRole} from '../../../domain/entities/Role'


export interface RolePermissionModelIDataSource{
    createRole(roleData: Partial<IRole>): Promise<IRole>;
    getAllRoles(): Promise<IRole[]>;
    getRoleById(roleId: string): Promise<IRole | null>;
    updateRole(roleId: string, updatedData: Partial<IRole>): Promise<IRole | null>;
    deleteRole(roleId: string): Promise<IRole | null>;
    assignRolesToUser(userId: string, roleIds: string[]): Promise<void>;
}
import { Admin } from "../../../domain/entities/Admin"; 
import {Role} from "../../../domain/entities/Role"; 

export interface adminModelIDataSource {      
     create(admin: Admin): Promise<void>; 
     findByUsername(username: string): Promise<Admin | null>;
     findByemail(email:string):Promise<Admin | null>;
     findById(id:string):Promise<Admin|null> ;  
//   getRoles(): Promise<Role[]>;
//   assignRole(adminId: string, roleId: string): Promise<void>;
//   unassignRole(adminId: string, roleId: string): Promise<void>;
//   getAssignedRoles(adminId: string): Promise<Role[]>;
//   getAdmins(page?: number, searchQuery?: string, itemsPerPage?: number): Promise<Admin[]>;
//   updateAdmin(adminId: string, updates: Partial<Admin>): Promise<Admin | null>;
//   deleteAdmin(adminId: string): Promise<void>;
}
import { Admin } from "../../entities/Admin";

export interface IAdminRepository{
    findByEmail(email: string): Promise<Admin | null>;
    findByUsername(username:string):Promise<Admin|null>;
    findById(id: string): Promise<Admin | null>;
    create(admin: Admin): Promise<void>;
//   update(admin: Admin): Promise<Admin>;
//   delete(id: string): Promise<void>;
}
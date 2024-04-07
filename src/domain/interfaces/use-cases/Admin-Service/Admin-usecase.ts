import Admin from "../../../entities/Admin";

export interface AdminUseCaseInterface {
    // getAdmins(): Promise<Admin[]>;
    getAdminById(id: string): Promise<Admin | null>;
    createAdmin(admin: Admin): Promise<void>;
    getAdminByEmail(email: string): Promise<Admin | null>;
    getAdminByUserName(userName: string): Promise<Admin | null>;
    adminLogin(email:string,password:string):Promise<{ admin: Admin; token: string }>;
    // updateAdmin(id: string, admin: Admin): Promise<Admin | null>;
    // deleteAdmin(id: string): Promise<void>;
  }
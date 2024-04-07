import { CustomError } from "../../../../utils/CustomError";
import { PasswordUtil } from "../../../../utils/PasswordUtils";
import { issueJWT } from "../../../../utils/passportUtils";
import Admin from "../../entities/Admin";
import { IAdminRepo } from "../../interfaces/repositories/Admin-Repository";
import { AdminUseCaseInterface } from "../../interfaces/use-cases/Admin-Service/Admin-usecase";


export class AdminUsecaseImpl implements AdminUseCaseInterface{
    constructor(private readonly repository: IAdminRepo) {}
    
    async createAdmin(admin: Admin): Promise<void> {
        try {
            await this.repository.create(admin);
        } catch (error:any) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                throw new CustomError(error.message || 'Failed to findByemail',500);
            }
        }
    }

    async adminLogin(email: string, password: string): Promise<{ admin: Admin; token: string; }> {
        try {
            if (!email || !password) {
                throw new CustomError('Email and password are required', 400);
            }
            const admin = await this.repository.findByEmail(email);
            console.log(admin,"log from usecase");
            if (!admin) {
                throw new CustomError('Admin not found', 404);
            }
            const passwordMatch = await PasswordUtil.ComparePasswords(password, admin.password);
            if (!passwordMatch) {
                throw new CustomError('Invalid email or password', 401);
            }
            
            if (admin && admin._id) {
                const tokenData = issueJWT({_id:admin._id.toString(),roles:admin.roles});
                console.log(tokenData);
                return { admin, token:tokenData.token };
              }else{
                throw new CustomError('Id is not found in Admin',404)
              }
            
        } catch (error:any) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                throw new CustomError(error.message || 'Failed to findByemail',500);
            }
        }
    }

    async getAdminByEmail(email: string): Promise<Admin | null> {
        try {
            const admin = await this.repository.findByEmail(email);
            return admin;
        } catch (error:any) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                throw new CustomError(error.message || 'Failed to findByemail',500);
            }
        }
    }

    async getAdminById(id: string): Promise<Admin | null> {
        try {
            const admin = await this.repository.findById(id);
            return admin;
        } catch (error:any) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                throw new CustomError(error.message || 'Failed to findByemail',500);
            }
        }
    }

    async getAdminByUserName(userName: string): Promise<Admin | null> {
        try {
            const admin = await this.repository.findByUsername(userName);
            return admin;
        } catch (error:any) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                throw new CustomError(error.message || 'Failed to findByemail',500);
            }
        }
    }
    // getAdmins(): Promise<Admin[]> {
        
    // }
}
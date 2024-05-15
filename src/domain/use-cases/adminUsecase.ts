import { CustomError } from "../../utils/customError" 
import { PasswordUtil } from "../../utils/passwordUtils"
import { issueJWT } from "../../utils/passportUtils" 
import { Admin } from "../entities/Admin" 
import { IAdminRepository } from "../interfaces/repositoryInterfaces/adminIRepository" 
import { IAdminUseCase } from "../interfaces/use-cases/adminIUsecase" 


export class AdminUsecase implements IAdminUseCase{
    constructor(private readonly repository: IAdminRepository) {}
    
    async createAdmin(admin: Admin): Promise<void> {
        try {
            await this.repository.create(admin);
        } catch (error:unknown) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                const castedError = error as Error
          console.error('Unexpected error:', error);
          throw new CustomError(castedError.message || 'Internal server error',500);
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
            const passwordMatch = await PasswordUtil.comparePasswords(password, admin.password);
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
            
        } catch (error:unknown) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                const castedError = error as Error
          console.error('Unexpected error:', error);
          throw new CustomError(castedError.message || 'Internal server error',500);
            }
        }
    }

    async getAdminByEmail(email: string): Promise<Admin | null> {
        try {
            const admin = await this.repository.findByEmail(email);
            return admin;
        } catch (error:unknown) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                const castedError = error as Error
          console.error('Unexpected error:', error);
          throw new CustomError(castedError.message || 'Internal server error',500);
            }
        }
    }

    async getAdminById(id: string): Promise<Admin | null> {
        try {
            const admin = await this.repository.findById(id);
            return admin;
        } catch (error:unknown) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                const castedError = error as Error
          console.error('Unexpected error:', error);
          throw new CustomError(castedError.message || 'Internal server error',500);
            }
        }
    }

    async getAdminByUserName(userName: string): Promise<Admin | null> {
        try {
            const admin = await this.repository.findByUsername(userName);
            return admin;
        } catch (error:unknown) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                const castedError = error as Error
          console.error('Unexpected error:', error);
          throw new CustomError(castedError.message || 'Internal server error',500);
            }
        }
    }
    // getAdmins(): Promise<Admin[]> {
        
    // }
}
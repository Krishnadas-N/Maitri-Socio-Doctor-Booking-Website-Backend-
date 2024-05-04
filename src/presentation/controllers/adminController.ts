import { Request, Response, NextFunction } from 'express';
import { IAdminUseCase } from '../../domain/interfaces/use-cases/adminIUsecase';
import { CustomError } from '../../utils/customError'; 
import { Admin } from '../../domain/entities/Admin'; 
import { sendSuccessResponse } from '../../utils/reponseHandler';

export class AdminController {
    constructor(private readonly adminUseCase: IAdminUseCase) {}

    async createAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { username, email, password, roles } = req.body;
            const admin = new Admin(username, password, email, roles);
            await this.adminUseCase.createAdmin(admin);
            return sendSuccessResponse(res,{},'Admin created successfully');
        } catch (error) {
            next(error);
        }
    }

    async adminLogin(req: Request, res: Response, next: NextFunction):Promise<void>{
        try {
            const { email, password } = req.body;
            const AdminData = await this.adminUseCase.adminLogin( email, password);
            return sendSuccessResponse(res,AdminData,'Admin created successfully');
        } catch (error) {
            next(error);
        }
    }

    async getAdminByEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email } = req.body;
            const admin = await this.adminUseCase.getAdminByEmail(email);
            if (!admin) {
               throw new CustomError( 'Admin not found' ,404);
            } 
            return sendSuccessResponse(res,admin,'Admin retrieved successfully');
            
        } catch (error) {
            next(error);
        }
    }
    async getAdminById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = req.params;
            const admin = await this.adminUseCase.getAdminById(id);
            if (!admin) {
                throw new CustomError( 'Admin not found' ,404);
            } else {
                return sendSuccessResponse(res,admin,'Admin retrieved successfully');
            }
        } catch (error) {
            next(error);
        }
    }

    async getAdminByUsername(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { username } = req.params;
            const admin = await this.adminUseCase.getAdminByUserName(username);
            if (!admin) {
                throw new CustomError( 'Admin not found' ,404);
            } else {
                return sendSuccessResponse(res,admin,'Admin retrieved successfully');
            }
        } catch (error) {
            next(error);
        }
    }
    // Implement other controller methods for getting admin by ID, username, etc.
}

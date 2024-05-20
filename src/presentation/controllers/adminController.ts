import { Request, Response, NextFunction } from 'express';
import { IAdminUseCase } from '../../domain/interfaces/use-cases/adminIUsecase';
import { CustomError } from '../../utils/customError'; 
import { Admin } from '../../domain/entities/Admin'; 
import { sendSuccessResponse } from '../../utils/reponseHandler';
import { assertHasUser } from '../../middlewares/requestValidationMiddleware';

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
    async getDoctors(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const pageSize = parseInt(req.query.pageSize as string) || 6;
            const searchQuery = req.query.search as string || '';
            if (page < 1 || pageSize < 1) {
                throw new CustomError('Page and pageSize must be positive integers', 400);
            }
            const result = await this.adminUseCase.listDoctors(page,searchQuery,pageSize)
            return sendSuccessResponse(res,result,'Admin retrieved successfully');
            
        } catch (error) {
            next(error);
        }
    }
    
        async changeStatus(req:Request,res:Response,next:NextFunction){
            try{
                const doctorId = req.params.doctorId;
                if(!doctorId){
                    throw new CustomError('Doctor Id is not Defined',403)
                }
                  const doctor =await this.adminUseCase.changeDoctorStatus(doctorId)
                  return sendSuccessResponse(res,doctor,"Doctor Fetched Success Fully")
               }catch(error){
                next(error)
               }
       
       }
       async getAllUsers(req: Request, res: Response,next:NextFunction){
        try {
            const page = parseInt(req.query.page as string) || 1;
            const pageSize = parseInt(req.query.pageSize as string) || 10;
            const searchQuery = req.query.searchQuery as string || '';
            const users = await this.adminUseCase.getAllUsers( searchQuery , page, pageSize );
            console.log("use data");
            return sendSuccessResponse(res, users, 'Message sent Successfully');
        } catch (error) {
            console.error('Error fetching users:', error);
            next(error); // Pass the error to your error handling middleware
        }
    }

    async BlockOrUnBlokUser(req: Request, res: Response,next:NextFunction){
        try {
            const  userId = req.params.userId;
            const user = await this.adminUseCase.BlockOrUnblockUser(userId);
            return sendSuccessResponse(res,user,'User status changed  Successfully');
        } catch (error) {
            console.error('Error fetching While Blocking User:', error);
           next(error)
        }
    }

    async getDoctorsBySpecialization(req: Request, res: Response,next:NextFunction){
        try {
            const {specId} = req.params
            const searchQuery = req.query.search as string || ''
            const doctors = await this.adminUseCase.getSpecializedDoctors(specId,searchQuery);
            return sendSuccessResponse(res,doctors,'doctors fetched  Successfully');
        } catch (error) {
            console.error('Error fetching While Blocking User:', error);
           next(error)
        }
    }
    
    async getAdminDashboardDetails(req: Request, res: Response,next:NextFunction){
        try {
            assertHasUser(req)
            const adminId = req.user.id as string
            const doctors = await this.adminUseCase.adminDashBoardDetails(adminId);
            return sendSuccessResponse(res,doctors,'Admin Dashboard Details fetched  Successfully');
        } catch (error) {
            console.error('Error fetching While Fetching admin Dashboard Details:', error);
           next(error)
        }
    }
    async getAdminDashboardUserDoctorDetails(req: Request, res: Response,next:NextFunction){
        try {
            assertHasUser(req)
            const doctors = await this.adminUseCase.adminDashboardPatientandDoctorDetails();
            return sendSuccessResponse(res,doctors,'Admin Dashboard Users and Doctors Details fetched  Successfully');
        } catch (error) {
            console.error('Error fetching While Fetching admin Dashboard Details:', error);
           next(error)
        }
    }
    
    async getAppoinmentListDetails(req: Request, res: Response,next:NextFunction){
        try {
            const page = parseInt(req.query.page as string) || 1;
            const pageSize = parseInt(req.query.pageSize as string) || 7;
            const searchQuery = req.query.searchQuery as string || '';
            assertHasUser(req)
            const doctors = await this.adminUseCase.getAppointmentsList(page,pageSize,searchQuery);
            return sendSuccessResponse(res,doctors,'Admin Appointement Data  Details fetched  Successfully');
        } catch (error) {
            console.error('Error fetching While Fetching Appointement Data Details:', error);
           next(error)
        }
    }

    async getAdminWallet(req: Request, res: Response,next:NextFunction){
        try {
            assertHasUser(req);
            const page = parseInt(req.query.page as string) || 1;
            const pageSize = parseInt(req.query.pageSize as string) || 6;
            const userId = req.user.id as string;
            const data = await this.adminUseCase.getAdminWallet(userId,page,pageSize );
            return  sendSuccessResponse(res, data,"Wallet reterived successFully");
        } catch (error) {
            console.error('Error fetching While Editing the  User:', error);
           next(error)
        }
    }

    async getAdminTransactionGraphDetails(req: Request, res: Response,next:NextFunction){
        try {
            assertHasUser(req);
            const adminId = req.user.id as string;
            const data = await this.adminUseCase.detailsOfAdmintransactionperWeek(adminId)
            return  sendSuccessResponse(res, data,"Wallet reterived successFully");
        } catch (error) {
            console.error('Error fetching While Editing the  User:', error);
           next(error)
        }
    }

    async getAppointmentDetailsByAdmin(req: Request, res: Response,next:NextFunction){
        try {
            assertHasUser(req);
            const {appointmentId} = req.params
            const data = await this.adminUseCase.getAppointmentDetails(appointmentId)
            return  sendSuccessResponse(res, data,"Wallet reterived successFully");
        } catch (error) {
            console.error('Error fetching While Editing the  User:', error);
           next(error)
        }
    }

    async getReviewDetailsByAdmin(req: Request, res: Response,next:NextFunction){
        try {
            assertHasUser(req);
            const page = parseInt(req.query.page as string) || 1;
            const pageSize = parseInt(req.query.pageSize as string) || 7;
            const searchQuery = req.query.searchQuery as string || '';
            const data = await this.adminUseCase.getReviewdetails(page,pageSize,searchQuery)
            return  sendSuccessResponse(res, data,"Reviews reterived successFully");
        } catch (error) {
            console.error('Error fetching While Editing the  User:', error);
           next(error)
        }
    }

    async deleteRevewByAdmin(req: Request, res: Response,next:NextFunction){
        try {
            assertHasUser(req);
            const{revId} = req.params;
            const data = await this.adminUseCase.deleteReview(revId)
            return  sendSuccessResponse(res, data,"Reviews Deleted successFully");
        } catch (error) {
            console.error('Error fetching While Editing the  User:', error);
           next(error)
        }
    }
    // Implement other controller methods for getting admin by ID, username, etc.
}

import { CustomError } from "../../utils/customError" 
import { PasswordUtil } from "../../utils/passwordUtils"
import { issueJWT } from "../../utils/passportUtils" 
import { Admin } from "../entities/Admin" 
import { IAdminRepository } from "../interfaces/repositoryInterfaces/adminIRepository" 
import { IAdminUseCase } from "../interfaces/use-cases/adminIUsecase" 
import { TransactionDetailsByWeek, doctorsResponseModel, usersResponseModel } from "../../models/common.models"
import Doctor from "../entities/Doctor"
import { User } from "../entities/User"
import { AdminAppointmentDetails, AdminDashboardDetails, AdminDashboardUserandDoctorDetails, AppointmentListResponse, PaginatedReviewResult, ReviewDetails } from "../../models/admin.models"
import { Wallet } from "../entities/Wallet"


export class AdminUsecase implements IAdminUseCase{
    constructor(private readonly adminRepository: IAdminRepository) {}
    
    async createAdmin(admin: Admin): Promise<void> {
        try {
            await this.adminRepository.create(admin);
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
            const admin = await this.adminRepository.findByEmail(email);
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
            const admin = await this.adminRepository.findByEmail(email);
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
            const admin = await this.adminRepository.findById(id);
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
            const admin = await this.adminRepository.findByUsername(userName);
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

    async listDoctors(page?: number | undefined, searchQuery?: string | undefined, itemsPerPage?: number | undefined): Promise<doctorsResponseModel> {
        try {

           return await this.adminRepository.listDoctors(page,searchQuery,itemsPerPage)
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

    async changeDoctorStatus(id: string): Promise<Doctor> {
        try{
            if(!id){
                throw new CustomError('Doctor Id is Not defined',400)
            }
            return await this.adminRepository.changeStatusofDoctor(id);
    
        }catch (error:unknown) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                const castedError = error as Error
          console.error('Unexpected error:', error);
          throw new CustomError(castedError.message || 'Internal server error',500);
            }
        }
        }


        async  getAllUsers(searchQuery: string, page: number, pageSize: number): Promise<usersResponseModel> {
            try {
              return await this.adminRepository.getAllUsers(searchQuery,page, pageSize );
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

          async BlockOrUnblockUser(id: string): Promise<User> {
            try {
              return await this.adminRepository.toggleBlockUser(id);
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

   async  getSpecializedDoctors(specId: string, searchQuery: string): Promise<Doctor[]> {
    try {
        if(!specId){
            throw new CustomError("Specialization Id is not provided",400);
        }
        return await this.adminRepository.getSpecializedDoctors(specId,searchQuery);
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

   async  adminDashBoardDetails(adminId: string): Promise<AdminDashboardDetails> {
    try {
        if(!adminId){
            throw new CustomError("Admin Id is not provided",400);
        }
        return await this.adminRepository.adminDashBoardDetails(adminId);
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

    async adminDashboardPatientandDoctorDetails(): Promise<AdminDashboardUserandDoctorDetails> {
        try {
            return await this.adminRepository.adminDashboardPatientandDoctorDetails();
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

    async getAppointmentsList(currentPage: number, pageSize: number, searchQuery: string): Promise<AppointmentListResponse> {
        try {
        return await this.adminRepository.getAppointmentsList(currentPage,pageSize,searchQuery);
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

    async detailsOfAdmintransactionperWeek(adminId: string): Promise<TransactionDetailsByWeek[]> {
        try {
            return await this.adminRepository.detailsOfAdmintransactionperWeek(adminId)
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

    async getAdminWallet(adminId: string, page: number, pageSize: number): Promise<{ wallet: Wallet; page: number; pageSize: number; totalCount: number; totalPages: number; }> {
        try {
            return await this.adminRepository.getAdminWallet(adminId,page,pageSize)
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

    async getAppointmentDetails(appointmentId: string): Promise<AdminAppointmentDetails> {
        try {
            return await this.adminRepository.getAppointmentDetails(appointmentId)
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

   async  deleteReview(revId: string): Promise<void> {
    try {
         await this.adminRepository.deleteReview(revId)
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

   async getReviewdetails(page:number,pageSize:number,searchQuery:string): Promise<PaginatedReviewResult> {
    try {
        return await this.adminRepository.getReviewdetails(page,pageSize,searchQuery)
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
}
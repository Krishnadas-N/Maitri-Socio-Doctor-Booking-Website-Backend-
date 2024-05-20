import { adminModelIDataSource } from "../../data/interfaces/data-sources/adminIDataSource";
import { AdminAppointmentDetails, AdminDashboardDetails, AdminDashboardUserandDoctorDetails, AppointmentListResponse, PaginatedReviewResult, ReviewDetails } from "../../models/admin.models";
import { TransactionDetailsByWeek, doctorsResponseModel, usersResponseModel } from "../../models/common.models";
import { Admin } from "../entities/Admin";
import Doctor from "../entities/Doctor";
import { User } from "../entities/User";
import { Wallet } from "../entities/Wallet";
import { IAdminRepository } from "../interfaces/repositoryInterfaces/adminIRepository"; 


export class AdminRepository implements IAdminRepository{
    constructor(private adminDatasource:adminModelIDataSource){}

    async create(admin: Admin): Promise<void> {
        await this.adminDatasource.create(admin)
    }
    async findByEmail(email: string): Promise<Admin | null> {
            return await this.adminDatasource.findByemail(email);
    }
    async findById(id: string): Promise<Admin | null> {
        return await this.adminDatasource.findById(id);
    }
    async findByUsername(username: string): Promise<Admin | null> {
        return await this.adminDatasource.findByUsername(username);
    }
    async listDoctors(page?: number | undefined, searchQuery?: string | undefined, itemsPerPage?: number | undefined): Promise<doctorsResponseModel> {
        return await this.adminDatasource.listDoctors(page,searchQuery,itemsPerPage)
    }
    async changeStatusofDoctor(id: string): Promise<Doctor> {
        return  await this.adminDatasource.changeStatusofDoctor(id)
    }
    async getAllUsers(searchQuery: string, page: number, pageSize: number): Promise<usersResponseModel> {
        return await this.adminDatasource.getAllUsers(searchQuery, page, pageSize);
    }
    async toggleBlockUser(id: string): Promise<User> {
        return await this.adminDatasource.toggleBlockUser(id);
    }
    async getSpecializedDoctors(specId: string, searchQuery: string): Promise<Doctor[]> {
        return await this.adminDatasource.getSpecializedDoctors(specId,searchQuery)
    }

   async adminDashBoardDetails(adminId: string): Promise<AdminDashboardDetails> {
    return await this.adminDatasource.adminDashBoardDetails(adminId);
    }

    async adminDashboardPatientandDoctorDetails(): Promise<AdminDashboardUserandDoctorDetails> {
        return await this.adminDatasource.adminDashboardPatientandDoctorDetails()
    }
  async  getAppointmentsList(currentPage: number, pageSize: number, searchQuery: string): Promise<AppointmentListResponse> {
    return await this.adminDatasource.getAppointmentsList(currentPage,pageSize,searchQuery)
    }

    async detailsOfAdmintransactionperWeek(adminId: string): Promise<TransactionDetailsByWeek[]> {
        return this.adminDatasource.detailsOfAdmintransactionperWeek(adminId)
    }

    async getAdminWallet(adminId: string, page: number, pageSize: number): Promise<{ wallet: Wallet; page: number; pageSize: number; totalCount: number; totalPages: number; }> {
        return await this.adminDatasource.getAdminWallet(adminId,page,pageSize)
    }


   async  getAppointmentDetails(appointmentId: string): Promise<AdminAppointmentDetails> {
        return this.adminDatasource.getAppointmentDetails(appointmentId)
    }
   async  deleteReview(revId: string): Promise<void> {
       await this.adminDatasource.deleteReview(revId) 
    }

    getReviewdetails(page:number,pageSize:number,searchQuery:string): Promise<PaginatedReviewResult> {
    return this.adminDatasource.getReviewdetails(page,pageSize,searchQuery);
    }
}
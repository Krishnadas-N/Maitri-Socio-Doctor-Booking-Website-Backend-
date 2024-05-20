import { AdminAppointmentDetails, AdminDashboardDetails, AdminDashboardUserandDoctorDetails, AppointmentListResponse, PaginatedReviewResult, ReviewDetails } from "../../../models/admin.models";
import { TransactionDetailsByWeek, doctorsResponseModel, usersResponseModel } from "../../../models/common.models";
import { Admin } from "../../entities/Admin";
import Doctor from "../../entities/Doctor";
import { User } from "../../entities/User";
import { Wallet } from "../../entities/Wallet";

export interface IAdminRepository{
    findByEmail(email: string): Promise<Admin | null>;
    findByUsername(username:string):Promise<Admin|null>;
    findById(id: string): Promise<Admin | null>;
    create(admin: Admin): Promise<void>;
    listDoctors( page?: number, searchQuery?: string,itemsPerPage?: number ): Promise<doctorsResponseModel>;
    changeStatusofDoctor(id:string):Promise<Doctor>;
    getAllUsers(searchQuery: string, page: number, pageSize: number): Promise<usersResponseModel>;
    toggleBlockUser(id:string):Promise<User>;
    getSpecializedDoctors(specId:string,searchQuery:string):Promise<Doctor[]>;
    adminDashBoardDetails(adminId: string): Promise<AdminDashboardDetails>;
    adminDashboardPatientandDoctorDetails(): Promise<AdminDashboardUserandDoctorDetails>;
    getAppointmentsList(currentPage: number, pageSize: number, searchQuery: string): Promise<AppointmentListResponse> ;
    getAdminWallet(adminId: string, page: number, pageSize: number): Promise<{ wallet: Wallet; page: number; pageSize: number; totalCount: number; totalPages: number }>;
    detailsOfAdmintransactionperWeek(adminId: string): Promise<TransactionDetailsByWeek[]>;
    getAppointmentDetails(appointmentId:string):Promise<AdminAppointmentDetails>;
    getReviewdetails(page:number,pageSize:number,searchQuery:string):Promise<PaginatedReviewResult>;
    deleteReview(revId: string): Promise<void>;
//   update(admin: Admin): Promise<Admin>;
//   delete(id: string): Promise<void>;
}
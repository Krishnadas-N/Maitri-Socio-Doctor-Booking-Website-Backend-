import { Admin } from "../../../domain/entities/Admin"; 
import Doctor from "../../../domain/entities/Doctor";
import {Role} from "../../../domain/entities/Role"; 
import { User } from "../../../domain/entities/User";
import { Wallet } from "../../../domain/entities/Wallet";
import { AdminAppointmentDetails, AdminDashboardDetails, AdminDashboardUserandDoctorDetails, AppointmentListResponse, PaginatedReviewResult, ReviewDetails } from "../../../models/admin.models";
import { TransactionDetailsByWeek, doctorsResponseModel, usersResponseModel } from "../../../models/common.models";

export interface adminModelIDataSource {      
     create(admin: Admin): Promise<void>; 
     findByUsername(username: string): Promise<Admin | null>;
     findByemail(email:string):Promise<Admin | null>;
     findById(id:string):Promise<Admin|null> ;  
     changeStatusofDoctor(id:string):Promise<Doctor>;
     listDoctors( page?: number, searchQuery?: string,itemsPerPage?: number ): Promise<doctorsResponseModel>;
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
//   getRoles(): Promise<Role[]>;
//   assignRole(adminId: string, roleId: string): Promise<void>;
//   unassignRole(adminId: string, roleId: string): Promise<void>;
//   getAssignedRoles(adminId: string): Promise<Role[]>;
//   getAdmins(page?: number, searchQuery?: string, itemsPerPage?: number): Promise<Admin[]>;
//   updateAdmin(adminId: string, updates: Partial<Admin>): Promise<Admin | null>;
//   deleteAdmin(adminId: string): Promise<void>;
}
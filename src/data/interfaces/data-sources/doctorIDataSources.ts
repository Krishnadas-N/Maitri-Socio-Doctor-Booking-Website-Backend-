import Doctor, { Follower, Review } from "../../../domain/entities/Doctor";
import { DashBoardDataResponse, DashboardData } from "../../../models/doctors.model";

export interface IDoctorModelIDataSource{
    DbsaveBasicInfo(doctor: Partial<Doctor>): Promise<string>;
    DbsaveProfessionalInfo(doctor: Partial<Doctor>,doctorId:string): Promise<Partial<Doctor> | null>;
    DbsaveAdditionalInfo(doctor: Partial<Doctor>,doctorId:string): Promise<Partial<Doctor> | null>;
    findByEmail(email:string):Promise<Doctor | null>; 
    verifyDoctor(email:string):Promise<void>;
    findById(id:string):Promise<Doctor|null>;
    saveResetToken(token:string,email:string):Promise<void>;
    findResetTokenAndSavePassword(token:string,password:string):Promise<void>;
    AcceptprofileComplete(id:string):Promise<Doctor>;
    findDoctors(page?:number,searchQuery?:string,itemsPerPage?: number): Promise<Doctor[]>;
    changeStatusofDoctor(id:string):Promise<Doctor>;
    changeProfilePic(doctorId:string,image:string):Promise<void>;
    saveSelectedSlots(doctorId: string, selectedSlots: { date: Date, slots: string[] }[]): Promise<Doctor>;
    getSimilarProfiles(specializationId:string):Promise<Doctor[]>;
    followOrUnfollowDoctors(doctorId: string, userId: string,userType:'Doctor'|'User'): Promise<Follower[]>;
    addReview(doctorId: string, userId: string, rating: number, comment: string): Promise<Review>;
    getDoctorDashboardDetails(doctorId: string):Promise<DashBoardDataResponse> 
}
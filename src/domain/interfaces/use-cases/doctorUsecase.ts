import { LoginResponse } from "../../../models/docotr.authenticationModel";
import Doctor from "../../entities/Doctor";

export interface IDoctorUsecase{
    registerBasicInfoUseCase(doctor:Partial<Doctor>):Promise<string>;
    registerProfessionalInfoUseCase(doctor:Partial<Doctor>,doctorId:string):Promise<Partial<Doctor> | null>;
    RegisterAdditionalInfoUseCase(doctor:Partial<Doctor>,doctorId:string):Promise<Partial<Doctor> | null>;  
    login(email:string,password:string):Promise<LoginResponse | null>;
    forgotPassword(email:string):Promise<void>;
    setResetPassword(token:string,password:string):Promise<void>;
    AcceptDoctorProfile(id:string):Promise<Doctor>;
    GetDoctors(page:number,searchQuery:string,itemsPerPage: number):Promise<Doctor[]>;
    changeDoctorStatus(id: string): Promise<Doctor> ;
    getDoctorById(id:string):Promise<Doctor | null> ;
    changeProfilePic(doctorId:string,image:string):Promise<void>;
    saveSelectedSlots(doctorId: string, selectedSlots: { date: Date, slots: string[] }[]): Promise<Doctor>;
}
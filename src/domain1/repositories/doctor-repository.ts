import { CustomError } from "../../../utils/CustomError";
import { DoctorModelInter } from "../../data1/interfaces/data-sources/doctor-data-source";
import Doctor from "../entities/Doctor";
import { IDoctorsRepository } from "../interfaces/repositories/Doctor-Repository";

export class IDoctorRepositoryImpl  implements IDoctorsRepository {

    constructor(private  doctorDataSource:DoctorModelInter){}

    async findDoctorByEmail(email: string): Promise<Doctor | null> {
        try {
            const result = await this.doctorDataSource.findByEmail(email);
            return result ? result : null;
        } catch (error: any) {
            if (error instanceof CustomError) {
                throw error; 
            } else {
                console.error("An unexpected error occurred:", error);
                throw new CustomError(error.message || "An unexpected error occurred.", 500);
            }
        }
    }
    

    async findDoctorById(id: string): Promise<Doctor | null> {
        try{
           const doctor = await this.doctorDataSource.findById(id);
           return  doctor?doctor:null;
        }catch(error:any){
            if (error instanceof CustomError) {
                throw error; 
            } else {
                console.error("An unexpected error occurred:", error);
                throw new CustomError(error.message||"An unexpected error occurred.", 500);
            }   
        
    }
    }

    async saveBasicInfo(doctor: Partial<Doctor>): Promise<string> {
        try{
            const doctorId = await this.doctorDataSource.DbsaveBasicInfo(doctor);
            return doctorId
        }catch(error:any){
            if (error instanceof CustomError) {
                throw error; 
            } else {
                console.error("An unexpected error occurred:", error);
                throw new CustomError(error.message||"An unexpected error occurred.", 500);
            }   
        }
    }

    async saveAdditionalInfo(doctor: Partial<Doctor>, email: string): Promise<Partial<Doctor> | null> {
        try{
         return  await this.doctorDataSource.DbsaveAdditionalInfo(doctor, email);
        }catch(error:any){
        if (error instanceof CustomError) {
            throw error; 
        } else {
            console.error("An unexpected error occurred:", error);
            throw new CustomError(error.message||"An unexpected error occurred.", 500);
        }   
    }
    }

    async saveProfessionalInfo(doctor: Partial<Doctor>, email: string): Promise<Partial<Doctor> | null> {
        try{
            console.log(email,doctor,"comsole from reposootory profrssional info")
            return await this.doctorDataSource.DbsaveProfessionalInfo(doctor, email);
            }catch(error:any){
            if (error instanceof CustomError) {
                throw error; 
            } else {
                console.error("An unexpected error occurred:", error);
                throw new CustomError(error.message||"An unexpected error occurred.", 500);
            }   
        }
    }
    async markAsVerified(email: string): Promise<void> {
        await this.doctorDataSource.verifyDoctor(email);
    }



}
import Doctor from "../../../domain1/entities/Doctor";

export interface DoctorModelInter{
    DbsaveBasicInfo(doctor: Partial<Doctor>): Promise<string>;
    DbsaveProfessionalInfo(doctor: Partial<Doctor>,email:string): Promise<void>;
    DbsaveAdditionalInfo(doctor: Partial<Doctor>,email:string): Promise<void>;
    findByEmail(email:string):Promise<Doctor | null>; 
    verifyDoctor(email:string):Promise<void>;
    findById(id:string):Promise<Doctor|null>;
}
import Doctor from "../../../domain/entities/Doctor";

export interface DoctorModelInter{
    DbsaveBasicInfo(doctor: Partial<Doctor>): Promise<string>;
    DbsaveProfessionalInfo(doctor: Partial<Doctor>,email:string): Promise<Partial<Doctor> | null>;
    DbsaveAdditionalInfo(doctor: Partial<Doctor>,email:string): Promise<Partial<Doctor> | null>;
    findByEmail(email:string):Promise<Doctor | null>; 
    verifyDoctor(email:string):Promise<void>;
    findById(id:string):Promise<Doctor|null>;
    saveResetToken(token:string,email:string):Promise<void>;
    findResetTokenAndSavePassword(token:string,password:string):Promise<void>;
    AcceptprofileComplete(id:string):Promise<Doctor>;
    findDoctors(page?:number,searchQuery?:string,itemsPerPage?: number): Promise<Doctor[]>;
}
import Doctor from "../../../../entities/Doctor";

export interface DoctorService{
   registerBasicInfoUseCase(doctor:Partial<Doctor>):Promise<string>;
   registerProfessionalInfoUseCase(doctor:Partial<Doctor>,token:string):Promise<void>;
   RegisterAdditionalInfoUseCase(doctor:Partial<Doctor>,token:string):Promise<void>;  
   login(email:string,password:string):Promise<string | null>;
   
    
}
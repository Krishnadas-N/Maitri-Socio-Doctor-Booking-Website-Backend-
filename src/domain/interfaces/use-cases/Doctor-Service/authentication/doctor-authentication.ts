import { LoginResponse } from "../../../../../models/docotr-authenticationModel";
import Doctor from "../../../../entities/Doctor";

export interface DoctorService{
   registerBasicInfoUseCase(doctor:Partial<Doctor>):Promise<string>;
   registerProfessionalInfoUseCase(doctor:Partial<Doctor>,token:string):Promise<Partial<Doctor> | null>;
   RegisterAdditionalInfoUseCase(doctor:Partial<Doctor>,token:string):Promise<Partial<Doctor> | null>;  
   login(email:string,password:string):Promise<LoginResponse | null>;
   forgotPassword(email:string):Promise<void>;
   setResetPassword(token:string,password:string):Promise<void>;
    
}
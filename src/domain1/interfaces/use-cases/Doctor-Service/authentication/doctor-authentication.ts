import Doctor from "../../../../entities/Doctor";

export interface DoctorService{
   registerPartial(doctor:Partial<Doctor>):Promise<void>;
   login(email:string,password:string):Promise<Doctor | null>;
    
}
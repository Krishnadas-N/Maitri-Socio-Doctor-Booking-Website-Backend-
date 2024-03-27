import { DoctorSpecializtion } from "../../../../entities/Specialization"

export interface DoctorSpecService{
    addSpec(data:Pick<DoctorSpecializtion, "name" | "description">):Promise<void>;
    updateSpec(data:Pick<DoctorSpecializtion, "name" | "description">):Promise<void>;
    blockSpec(id:string):Promise<boolean>;
    getAllSpec():Promise<DoctorSpecializtion[] | null>;
    findASpec(id:string):Promise<DoctorSpecializtion | null>; 
}
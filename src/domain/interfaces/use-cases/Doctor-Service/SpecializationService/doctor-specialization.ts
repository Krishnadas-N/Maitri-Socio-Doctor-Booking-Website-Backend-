import { DoctorSpecializtion } from "../../../../entities/Specialization"

export interface DoctorSpecService{
    addSpec(data:Pick<DoctorSpecializtion, "name" | "description">):Promise<DoctorSpecializtion>;
    updateSpec(data:Pick<DoctorSpecializtion, "name" | "description">):Promise<DoctorSpecializtion>;
    blockSpec(id:string):Promise<DoctorSpecializtion>;
    getAllSpec():Promise<DoctorSpecializtion[] | null>;
    findASpec(id:string):Promise<DoctorSpecializtion | null>; 
}
import { DoctorSpecializtion } from "../../../domain/entities/Specialization";

export interface SpecilaizationInter{
    create(specData:Pick<DoctorSpecializtion, "name" | "description">): Promise<DoctorSpecializtion>;
    findAll(): Promise<DoctorSpecializtion[] | null>;
    updateSpec(id:string,specData: Pick<DoctorSpecializtion, "name" | "description">): Promise<DoctorSpecializtion> ;
    blockSpec(id:string): Promise<DoctorSpecializtion>;
    findOne(id:string):Promise<DoctorSpecializtion|null>;
    getByName(name: string): Promise<DoctorSpecializtion | null>; 
}
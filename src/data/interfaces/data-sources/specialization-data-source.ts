import { DoctorSpecializtion } from "../../../domain/entities/Specialization";

export interface SpecilaizationInter{
    create(specData:Pick<DoctorSpecializtion, "name" | "description">): Promise<void>;
    findAll(): Promise<DoctorSpecializtion[] | null>;
    updateSpec(id:string,specData: Pick<DoctorSpecializtion, "name" | "description">): Promise<void> ;
    blockSpec(id:string): Promise<boolean>;
    findOne(id:string):Promise<DoctorSpecializtion|null>;
    getByName(name: string): Promise<DoctorSpecializtion | null>; 
}
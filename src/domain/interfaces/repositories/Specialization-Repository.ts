import { DoctorSpecializtion } from "../../entities/Specialization";

export interface IDoctorSpecializtionRepo{
    create(specData:Pick<DoctorSpecializtion, "name" | "description">): Promise<void>;
    getAll(): Promise<DoctorSpecializtion[] | null>;
    update(id:string,specData: Pick<DoctorSpecializtion, "name" | "description">): Promise<void> ;
    block(id:string): Promise<boolean>;
    findOne(id: string):Promise<DoctorSpecializtion|null>; 
    getByName(name : string) : Promise<DoctorSpecializtion | null>;
}
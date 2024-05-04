import { DoctorSpecializtion } from "../../entities/Specialization";

export interface IDoctorSpecializtionRepository{
    create(specData:Pick<DoctorSpecializtion, "name" | "description">): Promise<DoctorSpecializtion>;
    getAll(): Promise<DoctorSpecializtion[] | null>;
    update(id:string,specData: Pick<DoctorSpecializtion, "name" | "description">): Promise<DoctorSpecializtion> ;
    block(id:string): Promise<DoctorSpecializtion>;
    findOne(id: string):Promise<DoctorSpecializtion|null>; 
    getByName(name : string) : Promise<DoctorSpecializtion | null>;
}
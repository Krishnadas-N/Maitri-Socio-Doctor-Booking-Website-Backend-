
import { CustomError } from "../../../utils/CustomError";
import { SpecilaizationInter } from "../../data/interfaces/data-sources/specialization-data-source";
import { DoctorSpecializtion } from "../entities/Specialization";
import { IDoctorSpecializtionRepo } from "../interfaces/repositories/Specialization-Repository";

export class IDoctorSpecializtionRepoImpl implements  IDoctorSpecializtionRepo{
    constructor(private SpecDataSource:SpecilaizationInter){}
    async block(id: string): Promise<DoctorSpecializtion> {
        try {
            return await this.SpecDataSource.blockSpec(id);
        } catch (error:any) {
            // Handle errors
            console.error("Error while blocking specialization:", error);
            throw new CustomError(error.message||"Error while blocking specialization",500); // Rethrow the error to the caller
        }   
    }
    async create(specData: Pick<DoctorSpecializtion, "name" | "description">): Promise<DoctorSpecializtion> {
        try {
          return  await this.SpecDataSource.create(specData);
        } catch (error:any) {
            // Handle errors
            console.error("Error while creating specialization:", error);
            throw new CustomError(error.message||"Error while creating specialization",500);
        }  
    }
    async getAll(): Promise<DoctorSpecializtion[] | null> {
        try {
            return await this.SpecDataSource.findAll();
        } catch (error:any) {
            console.error("Error while getting all specializations:", error);
            throw new CustomError(error.message||"Error while getting all specializations",500); 
        } 
    }
    async  update(id: string, specData: Pick<DoctorSpecializtion, "name" | "description">): Promise<DoctorSpecializtion> {
        try {
          return await this.SpecDataSource.updateSpec(id, specData);
        } catch (error:any) {
            console.error("Error while updating specialization:", error);
            throw new CustomError(error.message||"Error while updating specializationError while updating specialization",500);
        } 
    }
    findOne(id: string): Promise<DoctorSpecializtion | null> {
        try {
           return this.SpecDataSource.findOne(id);
        } catch (error:any) {
            console.error("Error while Fetching a specialization:", error);
            throw new CustomError(error.message||"Error while Fetching a specialization",500);
        } 
    }
    getByName(name: string): Promise<DoctorSpecializtion | null> {
        try {
        return this.SpecDataSource.getByName(name);
    } catch (error:any) {
        console.error("Error while Fetching a specialization:", error);
        throw new CustomError(error.message||"Error while Fetching a specialization",500);
    } 
    }
}
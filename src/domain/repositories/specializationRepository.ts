
import { CustomError } from "../../utils/customError"; 
import { SpecilaizationModelIDataSource } from "../../data/interfaces/data-sources/doctorSpecializationIDataSource";
import { DoctorSpecializtion } from "../entities/Specialization";
import { IDoctorSpecializtionRepository } from "../interfaces/repositoryInterfaces/specializationIRepository"; 

export class IDoctorSpecializtionRepoImpl implements  IDoctorSpecializtionRepository{
    constructor(private SpecDataSource:SpecilaizationModelIDataSource){}
    async block(id: string): Promise<DoctorSpecializtion> {
        try {
            return await this.SpecDataSource.blockSpec(id);
        }catch (error:unknown) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                const castedError = error as Error
          console.error('Unexpected error:', error);
          throw new CustomError(castedError.message || 'Internal server error',500);
            }
        }  
    }
    async create(specData: Pick<DoctorSpecializtion, "name" | "description">): Promise<DoctorSpecializtion> {
        try {
          return  await this.SpecDataSource.create(specData);
        } catch (error:unknown) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                const castedError = error as Error
          console.error('Unexpected error:', error);
          throw new CustomError(castedError.message || 'Internal server error',500);
            }
        } 
    }
    async getAll(): Promise<DoctorSpecializtion[] | null> {
        try {
            return await this.SpecDataSource.findAll();
        } catch (error:unknown) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                const castedError = error as Error
          console.error('Unexpected error:', error);
          throw new CustomError(castedError.message || 'Internal server error',500);
            }
        }
    }
    async  update(id: string, specData: Pick<DoctorSpecializtion, "name" | "description">): Promise<DoctorSpecializtion> {
        try {
          return await this.SpecDataSource.updateSpec(id, specData);
        } catch (error:unknown) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                const castedError = error as Error
          console.error('Unexpected error:', error);
          throw new CustomError(castedError.message || 'Internal server error',500);
            }
        }
    }
    findOne(id: string): Promise<DoctorSpecializtion | null> {
        try {
           return this.SpecDataSource.findOne(id);
        }catch (error:unknown) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                const castedError = error as Error
          console.error('Unexpected error:', error);
          throw new CustomError(castedError.message || 'Internal server error',500);
            }
        }
    }
    getByName(name: string): Promise<DoctorSpecializtion | null> {
        try {
        return this.SpecDataSource.getByName(name);
    } catch (error:unknown) {
        if (error instanceof CustomError) {
            throw error;
        } else {
            const castedError = error as Error
      console.error('Unexpected error:', error);
      throw new CustomError(castedError.message || 'Internal server error',500);
        }
    } 
    }
}
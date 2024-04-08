
import { CustomError } from "../../../../utils/CustomError";
import { DoctorSpecializtion } from "../../entities/Specialization";
import { IDoctorSpecializtionRepo } from "../../interfaces/repositories/Specialization-Repository";
import { DoctorSpecService } from "../../interfaces/use-cases/Doctor-Service/SpecializationService/doctor-specialization";

export class DoctorServiceImpl implements DoctorSpecService{
    constructor(private readonly specializationRepo:IDoctorSpecializtionRepo){}
    
    async addSpec(data: Pick<DoctorSpecializtion, "name" | "description">): Promise<DoctorSpecializtion> {
        try {
            const exist = await this.specializationRepo.getByName(data.name);
            if(exist) throw new CustomError("This Specialization is Already Exists",409);
            return await this.specializationRepo.create(data);
        } catch (error) {
            console.error("Error while adding specialization:", error);
            throw error;
        }
    }
    async blockSpec(id: string): Promise<DoctorSpecializtion> {
        try {
            return await this.specializationRepo.block(id);
        } catch (error) {
            console.error("Error while blocking specialization:", error);
            throw error;
        }
    }
    async getAllSpec(): Promise<DoctorSpecializtion[] | null> {
        try {
            return await this.specializationRepo.getAll();
        } catch (error) {
            console.error("Error while getting all specializations:", error);
            throw error;
        }
    }
    async updateSpec(data: Pick<DoctorSpecializtion, "name" | "description"|"_id">): Promise<DoctorSpecializtion> {
        try {
            const id = data._id; 
            if (!id) {
                throw new Error("Missing ID for updating specialization");
            }
            const isExists = await this.specializationRepo.findOne(id);
            if(!isExists){
                throw new CustomError(`No such specialization with id ${id}` ,404);
            }
            return await this.specializationRepo.update(id, data);
        } catch (error) {
            console.error("Error while updating specialization:", error);
            throw error;
        }
    }
    async findASpec(id: string): Promise<DoctorSpecializtion | null> {
        try {
            return await this.specializationRepo.findOne(id);
        } catch (error) {
            console.error("Error while finding specialization:", error);
            throw error;
        }
    }

}
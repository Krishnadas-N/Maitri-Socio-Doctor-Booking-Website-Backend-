import { CustomError } from "../../utils/customError";
import { InterestedDoctor } from "../entities/InterestedDoctors";
import { IInterestedDoctorsUseCase } from "../interfaces/use-cases/interestedDoctorsIUsecase";
import { IIntersetedDoctorsRepository } from "../interfaces/repositoryInterfaces/InterstedDoctorIRepository"; 

export  class InterestedDoctors implements IInterestedDoctorsUseCase{
    constructor(private interestedDoctorsRepo:IIntersetedDoctorsRepository){}
   async addInterestForUser(userId: string, doctorId: string): Promise<InterestedDoctor> {
        try{
            return await this.interestedDoctorsRepo.addInterest(userId, doctorId);
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
    async getUserInterestsForUser(userId: string): Promise<InterestedDoctor> {
        try{
            return await this.interestedDoctorsRepo.getUserInterests(userId)
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

    async removeInterestForUser(userId: string, doctorId: string): Promise<void> {
        try{
            await this.interestedDoctorsRepo.removeInterest(userId,doctorId)
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
 }
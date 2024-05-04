import { CustomError } from "../../utils/customError";
import { InterestedDoctor } from "../entities/InterestedDoctors";
import { IInterestedDoctorsUseCase } from "../interfaces/use-cases/interestedDoctorsIUsecase";
import { IIntersetedDoctorsRepository } from "../interfaces/repositoryInterfaces/InterstedDoctorIRepository"; 

export  class InterestedDoctors implements IInterestedDoctorsUseCase{
    constructor(private interestedDoctorsRepo:IIntersetedDoctorsRepository){}
   async addInterestForUser(userId: string, doctorId: string): Promise<InterestedDoctor> {
        try{
            return await this.interestedDoctorsRepo.addInterest(userId, doctorId);
        }catch(err:any){
            if(err instanceof CustomError){
                throw err
            }else{
                throw new CustomError(err.message||'INTEREST_ADD_FAIL',409 )
            }
        }
    }
    async getUserInterestsForUser(userId: string): Promise<InterestedDoctor> {
        try{
            return await this.interestedDoctorsRepo.getUserInterests(userId)
        }catch(err:any){
            if(err instanceof CustomError){
                throw err
            }else{
                throw new CustomError(err.message||'INTEREST_Get_FAIL',409 )
            }
        }
    }

    async removeInterestForUser(userId: string, doctorId: string): Promise<void> {
        try{
            await this.interestedDoctorsRepo.removeInterest(userId,doctorId)
        }catch(err:any){
            if(err instanceof CustomError){
                throw err
            }else{
                throw new CustomError(err.message||'INTEREST_REMOVE_FAIL',409 )
            }
        }
    }
 }
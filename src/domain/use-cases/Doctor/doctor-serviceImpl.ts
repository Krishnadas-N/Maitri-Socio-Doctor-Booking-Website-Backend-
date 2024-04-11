import { CustomError } from "../../../../utils/CustomError";
import Doctor from "../../entities/Doctor";
import { IDoctorsRepository } from "../../interfaces/repositories/Doctor-Repository";
import { IDoctorUsecase } from "../../interfaces/use-cases/Doctor-Service/Idoctor-Service";


export class DoctorUseCaseImpl implements IDoctorUsecase{
    constructor(private doctorRepository:IDoctorsRepository){}

    async GetDoctors(page: number , searchQuery: string, itemsPerPage: number ): Promise<Doctor[]> {
        try{
            return await this.doctorRepository.GetDoctors(page, searchQuery,itemsPerPage);

        }catch(error:any){
            if (error instanceof CustomError) {
                throw error;
              }
          
              console.error('Unexpected error:', error);
              throw new Error(error.message || 'Internal server error');
            }
    }

   async changeDoctorStatus(id: string): Promise<Doctor> {
    try{
        if(!id){
            throw new CustomError('Doctor Id is Not defined',400)
        }
        return await this.doctorRepository.changeStatusofDoctor(id);

    }catch(error:any){
        if (error instanceof CustomError) {
            throw error;
          }
      
          console.error('Unexpected error:', error);
          throw new Error(error.message || 'Internal server error');
        }
    }

    async getDoctorById(id: string): Promise<Doctor | null> {
        try{
            if(!id){
                throw new CustomError('Doctor Id is Not defined',400)
            }
            return await this.doctorRepository.findDoctorById(id);
    
        }catch(error:any){
            if (error instanceof CustomError) {
                throw error;
              }
          
              console.error('Unexpected error:', error);
              throw new Error(error.message || 'Internal server error');
            }
    }
    
}
    
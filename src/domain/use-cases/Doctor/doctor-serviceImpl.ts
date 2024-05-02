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
    async changeProfilePic(doctorId: string, image: string): Promise<void> {
        try {
          if (!doctorId) {
            throw new CustomError("User Id is not Defined", 404);
          }
          if (image.trim().length === 0) {
            throw new CustomError("Image Is Not Provided", 422);
          }
          return await this.doctorRepository.changeProfilePic(doctorId, image);
        } catch (error: any) {
          if (error instanceof CustomError) {
            throw error;
          }
          throw new CustomError(
            error.message || "Error In While Changing the status of the User",
            500
          );
        }
      }

      async saveSelectedSlots(doctorId: string, selectedSlots: { date: Date; slots: string[]; }[]): Promise<Doctor> {
        try {
          if (!doctorId) {
            throw new CustomError("User Id is not Defined", 404);
          }
          if(!selectedSlots){
            throw new CustomError("Slots is  is not provided", 404);
          }
          return await this.doctorRepository.saveSelectedSlots(doctorId, selectedSlots);
        } catch (error: any) {
          if (error instanceof CustomError) {
            throw error;
          }
          throw new CustomError(
            error.message || "Error In While Changing the status of the User",
            500
          );
        }
      }

    //   async getDoctorBookedSlots(date: Date): Promise<string[]> {
    //   try{
    //     if (!(date instanceof Date) || isNaN(date.getTime())) {
    //       throw new CustomError('Invalid date',400);
    //      }
    //      return this.getDoctorBookedSlots(date);
    //   }catch(error:any){
    //     if (error instanceof CustomError) {
    //       throw error;
    //     }
    //     throw new CustomError(
    //       error.message || "Error In While Changing the status of the User",
    //       500
    //     );
    //   }
    // }
}
    
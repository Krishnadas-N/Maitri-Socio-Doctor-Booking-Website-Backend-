import { CustomError } from "../../utils/customError"; 
import Doctor, { Follower, Review } from "../entities/Doctor";
import { IDoctorRepository } from "../interfaces/repositoryInterfaces/doctorIRepository";
import { IDoctorUsecase } from "../interfaces/use-cases/doctorUsecase";
import { OtpRepository } from "../interfaces/repositoryInterfaces/otpIRepository";
import { LoginResponse } from "../../models/docotr.authenticationModel";
import { generateToken } from "../../utils/tokenizeDataHelper";
import { PasswordUtil } from "../../utils/passwordUtils";
import { issueJWT } from "../../utils/passportUtils";
import { DashBoardDataResponse } from "../../models/doctors.model";


export class DoctorUseCaseImpl implements IDoctorUsecase{
    constructor(private doctorRepository:IDoctorRepository,private readonly otpRepository: OtpRepository){}

    async registerBasicInfoUseCase(doctorData: Partial<Doctor>): Promise<string> {
      try {
          const requiredFields:Array<keyof Partial<Doctor>> = ['firstName', 'lastName', 'email', 'phone', 'gender', 'dateOfBirth', 'password'];
          for (const field of requiredFields) {
              if (!doctorData[field]) {
                  throw new CustomError(`Missing ${field}`, 406);
              }
          }
      if(doctorData.email){
      const isDoctorExists = await this.doctorRepository.findDoctorByEmail(doctorData.email);
      if (isDoctorExists && isDoctorExists.isVerified === true) {
          throw new CustomError("This Email is already Exists, Please Login", 409);
      }else{
          if(!isDoctorExists){
              await this.doctorRepository.saveBasicInfo(doctorData);
          }
          const otp = this.otpRepository.generateOTP();
          console.log(otp);
         const otpId = await this.otpRepository.sendOTP(doctorData.email,otp);
          console.log("OTP sent successfully");
          console.log("Otp data Saved in datbase");
          const token  = await generateToken(otpId);
          return token;
      } 
      }else{
          throw new CustomError("Missing Email Field ",406)
      }
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

  async registerProfessionalInfoUseCase(doctorData: Partial<Doctor>,doctorId:string): Promise<Partial<Doctor> | null> {
      try {
          console.log(doctorId)
          return await this.doctorRepository.saveProfessionalInfo(doctorData,doctorId);
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
      

  async RegisterAdditionalInfoUseCase(doctorData: Partial<Doctor>,doctorId:string): Promise<Partial<Doctor> | null> {
      try {
         return await this.doctorRepository.saveAdditionalInfo(doctorData,doctorId);
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
 
  
  async login(email: string, password: string): Promise<LoginResponse | null> {
      try {
          const doctor=await this.doctorRepository.findDoctorByEmail(email);
          if(!doctor){
              throw new CustomError("Invalid Crenditials",404);
          }
          if(!doctor.isVerified){
              throw new CustomError("User is Not Verified",403)
          }
          const isValidPassword = await PasswordUtil.comparePasswords(password, doctor.password);
          if (!isValidPassword) {
              throw new CustomError('Invalid password',409);          
          }
          if (doctor && doctor._id) {
              console.log(email,password);
              const tokenData = issueJWT({_id:doctor._id.toString(),roles: doctor.roles || []});
              console.log(tokenData);
              return { doctor, token:tokenData.token };
            }else{
              throw new CustomError('Id is not found in Doctor',404)
            }
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
  async forgotPassword(email: string): Promise<void> {
      try {
         if(!email){
             throw new CustomError('Email is Not Found',404)
         }
        return this.doctorRepository.setResetToken(email);
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
 
    async  setResetPassword(token: string, password: string): Promise<void> {
     try {
         if(!token || password){
             throw new CustomError('Token or Password  is not provided',400);
         }
         await this.doctorRepository.findResetTokenAndSavePassword(token,password);
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

    async AcceptDoctorProfile(id: string): Promise<Doctor> {
      try {
          if(!id ){
              throw new CustomError('Id  is not provided',400);
          }
          return await this.doctorRepository.AcceptDoctorProfile(id);
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

    async GetDoctors(page: number , searchQuery: string, itemsPerPage: number ): Promise<Doctor[]> {
        try{
            return await this.doctorRepository.GetDoctors(page, searchQuery,itemsPerPage);

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

   

    async getDoctorById(id: string): Promise<Doctor | null> {
        try{
            if(!id){
                throw new CustomError('Doctor Id is Not defined',400)
            }
            return await this.doctorRepository.findDoctorById(id);
    
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
    async changeProfilePic(doctorId: string, image: string): Promise<void> {
        try {
          if (!doctorId) {
            throw new CustomError("User Id is not Defined", 404);
          }
          if (image.trim().length === 0) {
            throw new CustomError("Image Is Not Provided", 422);
          }
          return await this.doctorRepository.changeProfilePic(doctorId, image);
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

      async saveSelectedSlots(doctorId: string, selectedSlots: { date: Date; slots: string[]; }[]): Promise<Doctor> {
        try {
          if (!doctorId) {
            throw new CustomError("User Id is not Defined", 404);
          }
          if(!selectedSlots){
            throw new CustomError("Slots is  is not provided", 404);
          }
          return await this.doctorRepository.saveSelectedSlots(doctorId, selectedSlots);
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

     async getSimilarProfiles(specializationId: string): Promise<Doctor[]> {
        try {
            if (!specializationId) {
              throw new CustomError("specializationId  is not Defined", 404);
            }
          
            return await this.doctorRepository.getSimilarProfiles(specializationId);
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

     async followOrUnfollowDoctors(doctorId: string, userId: string, userType: "Doctor" | "User"): Promise<Follower[]> {
        try {
            if (!doctorId || !userId || !userType) {
              throw new CustomError("Doctor Id or UserId or UserRole  is not Defined", 400);
            }
          
            return await this.doctorRepository.followOrUnfollowDoctors(doctorId ,userId ,userType);
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

     async addReviewAndRating(appoinmentId: string, userId: string, rating: number, comment: string): Promise<Review> {
        try {
            if (!appoinmentId || !userId || !rating) {
              throw new CustomError("appoinmentId Id or UserId or rating  is not Defined", 400);
            }
          
            return await this.doctorRepository.addReview(appoinmentId,userId,rating,comment);
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

     async getDoctorDashboardDetails(doctorId: string): Promise<DashBoardDataResponse> {
        try {
            if (!doctorId) {
              throw new CustomError("Doctor Id  is not Defined", 400);
            }
          
            return await this.doctorRepository.getDoctorDashboardDetails(doctorId)
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

     async getReviewsOfDoctor(doctorId: string): Promise<Review[]> {
        try {
            if (!doctorId) {
              throw new CustomError("Doctor Id  is not Defined", 400);
            }
          
            return await this.doctorRepository.getReviewsOfDoctor(doctorId)
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
    
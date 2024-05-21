import { IOtpUsecase } from "../interfaces/use-cases/otpIUsecase"; 
import { OtpRepository } from "../interfaces/repositoryInterfaces/otpIRepository"; 
import { OTP } from "../entities/OTP";
import { CustomError } from "../../utils/customError";
import { IUserRepository } from "../interfaces/repositoryInterfaces/userIRepository"; 
import { IDoctorRepository } from "../interfaces/repositoryInterfaces/doctorIRepository";
import { generateToken, verifyToken  } from "../../utils/tokenizeDataHelper"; 

export class OTPServiceImpl implements IOtpUsecase {
  constructor(
    private readonly otpRepository: OtpRepository,
    private readonly userRepository: IUserRepository,
    private readonly doctorRepostory :IDoctorRepository
  ) {}

  async verifyOTP(
    code: string,
    section: string
  ): Promise<boolean|string> {

    console.log(code ,section,"From otp  service");
    const otp = await this.otpRepository.findByOwnerAndCode(code);
    console.log("Log from use case VerifyOtp");
    console.log(otp);
    if (!otp) {
      throw new CustomError("Invalid Email", 404);
    }
    if (otp.status === "USED") {
      throw new CustomError("The Otp already Used", 409);
    }
    const currentTime = new Date().getTime();
    const createdAtTime = otp.createdAt.getTime();
    const elapsedTime = currentTime - createdAtTime;
    const validForMs = otp.validFor * 1000;
    if (elapsedTime > validForMs) {
      throw new CustomError("OTP has expired", 400);
    }
    let token:string;
    switch (section) {
      case "User":
        await this.userRepository.markAsVerified(otp.email);
        break;
      // case 'admin':
      //     await this.adminRepository.markAsVerified(email);
      //     break;
      case "Doctor":
        await this.doctorRepostory.markAsVerified(otp.email);
        token = await generateToken(otp.email); // Generate token for doctor
        await this.otpRepository.markAsUsed(otp.email);
        return token; // Return the token
      default:
        await this.userRepository.markAsVerified(otp.email);
        break;
    }
    
    await this.otpRepository.markAsUsed(otp.email);
    return otp.otp === code;
  }


  async resendOtp(authToken: string): Promise<void> {
    try {
      console.log("Log from use case resend otp");
      const ownerId = verifyToken(authToken);
  
      if (!ownerId) {
        throw new CustomError('OTP is expired. Please register again with the same credentials.', 403);
      }
  
      await this.otpRepository.resendOtp(ownerId.data);
    } catch (err) {
      console.error("Error occurred while resending OTP:", err);
      throw err; // Re-throw the error for the caller to handle
    }
  }
  
}

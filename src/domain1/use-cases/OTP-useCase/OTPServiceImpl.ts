import { OTPService } from "../../interfaces/use-cases/OTP-SERVICE/OTPService";
import { OTPRepository } from "../../interfaces/repositories/OTP-Repository";
import { OTP } from "../../entities/OTP";
import { CustomError } from "../../../../utils/CustomError";
import { UserRepository } from "../../interfaces/repositories/user-Authentication";

export class OTPServiceImpl implements OTPService {
  constructor(
    private readonly otpRepository: OTPRepository,
    private readonly userRepository: UserRepository
  ) {}

  async verifyOTP(
    email: string,
    code: string,
    userType: string
  ): Promise<boolean> {
    const otp = await this.otpRepository.findByOwnerAndCode(email, code);
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
    switch (userType) {
      case "user":
        await this.userRepository.markAsVerified(email);
        break;
      // case 'admin':
      //     await this.adminRepository.markAsVerified(email);
      //     break;
      case "doctor":
      default:
        await this.userRepository.markAsVerified(email);
        break;
    }
    await this.otpRepository.markAsUsed(email);
    return otp.otp === code;
  }
  async resendOtp(email: string): Promise<void> {
    console.log("Log from use case resend otp");
    console.log(email);
    this.otpRepository.resendOtp(email);
  }
}

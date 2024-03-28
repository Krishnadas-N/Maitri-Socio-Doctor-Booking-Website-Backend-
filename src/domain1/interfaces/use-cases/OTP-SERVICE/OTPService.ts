
export interface OTPService{
    resendOtp(email:string):Promise<void>;
    verifyOTP(email: string, code: string,userType:string): Promise<boolean>;
}
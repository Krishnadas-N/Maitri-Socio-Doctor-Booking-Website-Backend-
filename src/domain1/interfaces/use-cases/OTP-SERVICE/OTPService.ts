
export interface OTPService{
    generateOTP():string;
    sendOTP(email:string,otp:string):Promise<void>;
    verifyOTP(email: string, code: string): Promise<boolean>;
}
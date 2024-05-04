
export interface IOtpUsecase{
    resendOtp(email:string):Promise<void>;
    verifyOTP(code: string,section:string): Promise<boolean | string>;
}
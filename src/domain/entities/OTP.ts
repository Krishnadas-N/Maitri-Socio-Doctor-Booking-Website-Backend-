
export class OTP{
    constructor(
        public email:string,
        public otp:string,
        public status:'USED'|'NOTUSED',
        public createdAt:Date,
        public validFor:number,
        public expiresAt: Date
    ) {}
}
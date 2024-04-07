export class User {
    constructor(
        
        public email: string,
        public password: string,
        public username: string,
        public firstName?: string,
        public lastName?: string,
        public gender?: string,
        public dateOfBirth?: Date,
        public _id?: string | null,
        public profilePic?: string | null,
        public isVerified?:boolean,
        public resetToken ?:string | null,
    ) {}
}

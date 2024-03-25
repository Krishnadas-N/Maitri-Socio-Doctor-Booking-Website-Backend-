export class User {
    constructor(
        
        public email: string,
        public password: string,
        public username: string,
        public firstname?: string,
        public lastName?: string,
        public gender?: string,
        public dateOfBirth?: Date,
        public _id?: string | null,
        public profilePic?: string | null
    ) {}
}
